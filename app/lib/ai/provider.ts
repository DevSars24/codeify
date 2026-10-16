import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AICallConfig {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  modelType?: "fast" | "reasoning"; // fast uses 8B model on Groq, reasoning uses 70B
  responseFormat?: "json" | "text";
  timeoutMs?: number;
}

export interface AICallResult {
  text: string;
  provider: "groq" | "gemini";
  model: string;
  latencyMs: number;
  fallbackTriggered: boolean;
  groqKeyIndex?: number;
  tokensUsed?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class AIProviderError extends Error {
  public readonly status?: number;
  public readonly provider?: string;
  public readonly cause?: unknown;

  constructor(
    message: string,
    status?: number,
    provider?: string,
    cause?: unknown
  ) {
    super(message);
    this.name = "AIProviderError";
    this.status = status;
    this.provider = provider;
    this.cause = cause;
  }
}

// ─── Multi-Key Groq Pool ────────────────────────────────────────────
// Round-robin across all Groq API keys to distribute rate-limit pressure.
// Keys are sourced from GROQ_API_KEY_POOL (comma-separated) with GROQ_API_KEY as fallback.

let groqKeyPool: string[] = [];
let groqKeyIndex = 0;

function getGroqKeyPool(): string[] {
  if (groqKeyPool.length > 0) return groqKeyPool;

  const poolEnv = process.env.GROQ_API_KEY_POOL;
  if (poolEnv) {
    groqKeyPool = poolEnv
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  // Fallback: single key
  if (groqKeyPool.length === 0 && process.env.GROQ_API_KEY) {
    groqKeyPool = [process.env.GROQ_API_KEY];
  }

  return groqKeyPool;
}

function getNextGroqKey(): { key: string; index: number } {
  const pool = getGroqKeyPool();
  if (pool.length === 0) {
    throw new AIProviderError("No GROQ_API_KEY configured.", 500, "groq");
  }

  const index = groqKeyIndex % pool.length;
  groqKeyIndex = (groqKeyIndex + 1) % pool.length;
  return { key: pool[index], index };
}

// ─── Gemini Singleton ───────────────────────────────────────────────

let geminiInstance: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new AIProviderError("GEMINI_API_KEY is not configured.", 500, "gemini");
    }
    geminiInstance = new GoogleGenerativeAI(key);
  }
  return geminiInstance;
}

// ─── Call Groq (Primary — Superior Provider) ────────────────────────

async function callGroq(config: AICallConfig, specificKeyIndex?: number): Promise<AICallResult> {
  const { key: apiKey, index: keyIdx } =
    specificKeyIndex !== undefined
      ? { key: getGroqKeyPool()[specificKeyIndex], index: specificKeyIndex }
      : getNextGroqKey();

  const model =
    config.modelType === "fast"
      ? process.env.GROQ_SIMULATE_MODEL || "qwen/qwen3.8-27b"
      : process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

  const timeoutMs = config.timeoutMs || 9000;
  const startTime = Date.now();

  const bodyPayload: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: config.systemPrompt },
      { role: "user", content: config.userPrompt },
    ],
    max_tokens: config.maxTokens || 400,
    temperature: config.temperature ?? 0.1,
  };

  if (config.responseFormat === "json") {
    bodyPayload.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(bodyPayload),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new AIProviderError(
      `Groq HTTP ${response.status}: ${errorText.slice(0, 300)}`,
      response.status,
      "groq"
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";

  if (!text) {
    throw new AIProviderError("Groq returned empty text.", 500, "groq");
  }

  return {
    text,
    provider: "groq",
    model,
    latencyMs,
    fallbackTriggered: false,
    groqKeyIndex: keyIdx,
    tokensUsed: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}

// ─── Call Gemini (Bounded Fallback) ──────────────────────────────────

async function callGemini(config: AICallConfig): Promise<AICallResult> {
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: modelName });

  const timeoutMs = config.timeoutMs || 9000;
  const startTime = Date.now();

  const combinedPrompt = `${config.systemPrompt}\n\n${config.userPrompt}`;

  const genConfig: Record<string, unknown> = {
    maxOutputTokens: config.maxTokens || 400,
    temperature: config.temperature ?? 0.1,
  };

  if (config.responseFormat === "json") {
    genConfig.responseMimeType = "application/json";
  }

  // Wrap in Promise.race for reliable timeout
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new AIProviderError("Gemini call timed out.", 408, "gemini")), timeoutMs)
  );

  const callPromise = (async () => {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
      generationConfig: genConfig,
    });
    const text = result.response.text()?.trim() || "";
    return text;
  })();

  const text = await Promise.race([callPromise, timeoutPromise]);
  const latencyMs = Date.now() - startTime;

  if (!text) {
    throw new AIProviderError("Gemini returned empty text.", 500, "gemini");
  }

  return {
    text,
    provider: "gemini",
    model: modelName,
    latencyMs,
    fallbackTriggered: true,
  };
}

// ─── Unified Multi-Model Execution ──────────────────────────────────
// Strategy: Groq is SUPERIOR / primary. Round-robin across all Groq keys.
// If one key is rate-limited, try the next key in the pool before falling back to Gemini.
// This distributes cost and prevents all pressure on a single API key.

export async function executeAIRequest(config: AICallConfig): Promise<AICallResult> {
  const pool = getGroqKeyPool();
  const poolSize = pool.length;
  const errors: { provider: string; message: string; status?: number }[] = [];

  // Step 1: Try each Groq key in pool (round-robin starting point)
  for (let attempt = 0; attempt < poolSize; attempt++) {
    try {
      return await callGroq(config);
    } catch (groqErr: unknown) {
      const err = groqErr as { status?: number; message?: string };
      const status = err?.status;
      const msg = err?.message?.toLowerCase() || "";

      errors.push({ provider: `groq-key-${attempt}`, message: msg, status });

      const isTransient =
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        status === 408 ||
        msg.includes("rate") ||
        msg.includes("quota") ||
        msg.includes("timed out") ||
        msg.includes("timeout") ||
        msg.includes("overloaded");

      if (!isTransient) {
        // Non-transient error, don't try other keys — go to fallback
        console.warn(`[AI Hub] Groq non-transient error (${status}): ${msg}`);
        break;
      }

      console.warn(`[AI Hub] Groq key ${attempt} failed (${status || msg}). Rotating to next key...`);
    }
  }

  // Step 2: All Groq keys exhausted → Gemini fallback
  if (process.env.GEMINI_API_KEY) {
    try {
      console.info("[AI Hub] All Groq keys exhausted. Executing Gemini fallback...");
      return await callGemini(config);
    } catch (geminiErr: unknown) {
      const gemErr = geminiErr as { message?: string };
      errors.push({ provider: "gemini", message: gemErr?.message || "unknown" });
      console.error("[AI Hub] Gemini fallback also failed:", gemErr?.message);
    }
  }

  // Step 3: Everything failed
  const errorSummary = errors.map((e) => `${e.provider}: ${e.message}`).join(" | ");
  throw new AIProviderError(
    `All AI providers failed. ${errorSummary}`,
    503,
    "all",
  );
}

// ─── Multi-Model Streaming Execution ────────────────────────────────
// Streams response from Groq (superior/primary), rotating pool keys if rate limited,
// and gracefully falling back to Gemini streaming.

function createGroqStreamTransformer(responseBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = responseBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          let hasEmitted = false;
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(":")) continue;
            if (trimmed === "data: [DONE]") {
              controller.close();
              return;
            }
            if (trimmed.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                  hasEmitted = true;
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
          if (hasEmitted) return;
        }
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

function createGeminiStreamTransformer(geminiStream: AsyncIterable<any>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const iterator = geminiStream[Symbol.asyncIterator]();

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await iterator.next();
        if (done) {
          controller.close();
          return;
        }
        const text = value.text?.() || "";
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export interface AIStreamResult {
  stream: ReadableStream<Uint8Array>;
  provider: "groq" | "gemini";
  model: string;
}

export async function executeAIStreamRequest(config: {
  systemPrompt: string;
  userPrompt: string;
  modelType?: "fast" | "reasoning";
  temperature?: number;
  timeoutMs?: number;
}): Promise<AIStreamResult> {
  const pool = getGroqKeyPool();
  const poolSize = pool.length;
  const timeoutMs = config.timeoutMs || 10000;

  for (let attempt = 0; attempt < poolSize; attempt++) {
    const { key: apiKey } = getNextGroqKey();
    const model =
      config.modelType === "fast"
        ? process.env.GROQ_SIMULATE_MODEL || "qwen/qwen3.8-27b"
        : process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: config.systemPrompt },
            { role: "user", content: config.userPrompt },
          ],
          temperature: config.temperature ?? 0.2,
          stream: true,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text().catch(() => "");
        console.warn(
          `[AI Stream] Groq key attempt ${attempt} returned ${response.status}: ${errorText.slice(0, 150)}`
        );
        continue;
      }

      return {
        stream: createGroqStreamTransformer(response.body),
        provider: "groq",
        model,
      };
    } catch (err: any) {
      console.warn(`[AI Stream] Groq attempt ${attempt} failed:`, err?.message);
    }
  }

  // Fallback to Gemini Stream
  if (process.env.GEMINI_API_KEY) {
    console.info("[AI Stream] Falling back to Gemini streaming...");
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: modelName });
    const combinedPrompt = `${config.systemPrompt}\n\n${config.userPrompt}`;

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
      generationConfig: {
        temperature: config.temperature ?? 0.2,
      },
    });

    return {
      stream: createGeminiStreamTransformer(result.stream),
      provider: "gemini",
      model: modelName,
    };
  }

  throw new AIProviderError("All streaming AI providers failed.", 503, "all");
}

