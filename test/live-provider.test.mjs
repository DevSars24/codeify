import test from "node:test";
import assert from "node:assert/strict";

const groqKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

test("Live Groq Provider Check (Primary)", async () => {
  assert(groqKey, "GROQ_API_KEY must be configured");

  const startTime = Date.now();
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: groqModel,
      messages: [
        {
          role: "system",
          content:
            "You are an AI code simulation engine. Predict stdout in JSON: { \"predictedOutput\": string }",
        },
        {
          role: "user",
          content: "Code: print(5 * 5)",
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 50,
      temperature: 0.1,
    }),
  });

  const latency = Date.now() - startTime;
  assert.equal(res.status, 200, `Groq API returned HTTP ${res.status}`);

  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}");

  assert(
    String(parsed.predictedOutput).includes("25"),
    `Expected output to contain 25, got: ${parsed.predictedOutput}`
  );
  console.log(`[Live Check] Groq (${groqModel}) responded in ${latency}ms, tokens: prompt=${data.usage?.prompt_tokens}, completion=${data.usage?.completion_tokens}`);
});

test("Live Gemini Provider Check (Fallback)", async () => {
  assert(geminiKey, "GEMINI_API_KEY must be configured");

  const startTime = Date.now();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Say READY in exactly 1 word" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 10,
          temperature: 0.1,
        },
      }),
    }
  );

  const latency = Date.now() - startTime;
  assert.equal(res.status, 200, `Gemini API returned HTTP ${res.status}`);

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  assert(text && text.toLowerCase().includes("ready"), `Expected READY, got: ${text}`);
  console.log(`[Live Check] Gemini (${geminiModel}) responded in ${latency}ms`);
});
