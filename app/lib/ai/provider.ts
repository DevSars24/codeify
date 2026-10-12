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

/**
 * Call Groq API (Primary)
 */
async function callGroq(config: AICallConfig): Promise<AICallResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AIProviderError("GROQ_API_KEY is not configured.", 500, "groq");
  }

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
    tokensUsed: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}

/**
 * Call Gemini API (Bounded Fallback)
 */
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

/**
 * Unified AI execution with Groq primary and Gemini fallback
 * Only falls back on transient errors (429, 500, 502, 503, timeout)
 */
export async function executeAIRequest(config: AICallConfig): Promise<AICallResult> {
  // Step 1: Attempt Groq (Primary)
  try {
    return await callGroq(config);
  } catch (groqErr: unknown) {
    const err = groqErr as { status?: number; message?: string };
    const status = err?.status;
    const msg = err?.message?.toLowerCase() || "";

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

    console.warn(`[AI Hub] Groq failed (${status || msg}). Checking fallback eligibility...`);

    // If Gemini is available and the error was transient (or Groq misconfigured), trigger fallback
    if (process.env.GEMINI_API_KEY && (isTransient || status === 401 || !process.env.GROQ_API_KEY)) {
      try {
        console.info("[AI Hub] Executing Gemini fallback...");
        return await callGemini(config);
      } catch (geminiErr: unknown) {
        const gemErr = geminiErr as { message?: string };
        console.error("[AI Hub] Gemini fallback also failed:", gemErr?.message);
        throw new AIProviderError(
          `Both AI providers failed. Primary Groq: ${err?.message}. Fallback Gemini: ${gemErr?.message}`,
          503,
          "both",
          geminiErr
        );
      }
    }

    throw groqErr;
  }
}
