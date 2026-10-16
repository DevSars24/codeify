import test from "node:test";
import assert from "node:assert/strict";
import { AICache } from "../app/lib/ai/cache";
import { SimulateResultSchema, AssessResultSchema } from "../app/lib/ai/types";
import { executeAIRequest } from "../app/lib/ai/provider";

test("Cache Key Generation & User Isolation", () => {
  const cache = new AICache();

  const key1 = cache.buildSimulateKey("user_A", "print(1)", "python", "input1", "qwen/qwen3.8-27b");
  const key2 = cache.buildSimulateKey("user_B", "print(1)", "python", "input1", "qwen/qwen3.8-27b");
  const key3 = cache.buildSimulateKey("user_A", "print(2)", "python", "input1", "qwen/qwen3.8-27b");
  const key4 = cache.buildSimulateKey("user_A", "print(1)", "python", "input2", "qwen/qwen3.8-27b");

  // User isolation: User A and User B must NOT share private execution cache
  assert.notEqual(key1, key2, "Different users must have isolated cache keys");

  // Code isolation: Different code must yield different cache keys
  assert.notEqual(key1, key3, "Different code must have different cache keys");

  // Input isolation: Different input must yield different cache keys
  assert.notEqual(key1, key4, "Different input must have different cache keys");
});

test("Cache Hit triggers zero underlying calls", async () => {
  const cache = new AICache();
  const testKey = "test_key_123";
  let callCount = 0;

  async function mockExpensiveAICall() {
    callCount++;
    return { predictedOutput: "4", confidence: "High" };
  }

  // First call (Miss)
  let val = cache.get<any>(testKey);
  if (!val) {
    val = await mockExpensiveAICall();
    cache.set(testKey, val);
  }
  assert.equal(callCount, 1, "First invocation should call AI once");

  // Second call (Hit)
  val = cache.get<any>(testKey);
  if (!val) {
    val = await mockExpensiveAICall();
  }
  assert.equal(callCount, 1, "Cache hit must trigger ZERO model calls");
  assert.equal(val?.predictedOutput, "4");
  assert.equal(cache.hits, 1);
});

test("Deduplication of simultaneous rapid clicks", async () => {
  const cache = new AICache();
  let underlyingCalls = 0;

  async function simulateRapidClick() {
    return await cache.deduplicate("dedup_key", async () => {
      underlyingCalls++;
      await new Promise((res) => setTimeout(res, 20));
      return { output: "done" };
    });
  }

  // 5 simultaneous clicks
  const results = await Promise.all([
    simulateRapidClick(),
    simulateRapidClick(),
    simulateRapidClick(),
    simulateRapidClick(),
    simulateRapidClick(),
  ]);

  assert.equal(underlyingCalls, 1, "Concurrent duplicate clicks must trigger exactly 1 AI call");
  assert.equal(results.length, 5);
  results.forEach((r) => assert.equal(r.output, "done"));
});

test("Simulate Schema Validation & Fallback Handling", () => {
  const validPayload = {
    predictedOutput: "123",
    hasSyntaxError: false,
    hasRuntimeError: false,
    errorSummary: undefined,
    confidence: "High",
    reasoning: "Simple sequential print.",
  };

  const parsed = SimulateResultSchema.parse(validPayload);
  assert.equal(parsed.predictedOutput, "123");
  assert.equal(parsed.confidence, "High");

  // Invalid confidence defaults safely
  const partialPayload = {
    predictedOutput: "456",
  };
  const parsedPartial = SimulateResultSchema.parse(partialPayload);
  assert.equal(parsedPartial.confidence, "Medium");
  assert.equal(parsedPartial.hasSyntaxError, false);
});

test("Assess Schema Validation enforces AI-estimated score bounds", () => {
  const validAssessment = {
    aiEstimatedScore: 85,
    verdictLabel: "Likely Correct",
    summary: "Optimal O(N) linear scan.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    likelyEdgeCaseFailures: ["Empty array"],
    confidence: "High",
  };

  const parsed = AssessResultSchema.parse(validAssessment);
  assert.equal(parsed.aiEstimatedScore, 85);
  assert.equal(parsed.verdictLabel, "Likely Correct");

  // Out-of-bounds score rejection
  assert.throws(() => {
    AssessResultSchema.parse({
      ...validAssessment,
      aiEstimatedScore: 150, // Invalid > 100
    });
  });
});

test("Simulated Groq Failure triggers Gemini Fallback gracefully", async () => {
  // Mock Groq failing with 429 Rate Limit
  const originalFetch = globalThis.fetch;
  let groqCalled = false;

  globalThis.fetch = async (url, options) => {
    const urlStr = String(url);
    if (urlStr.includes("groq.com")) {
      groqCalled = true;
      return new Response(JSON.stringify({ error: { message: "Rate limit reached" } }), {
        status: 429,
        statusText: "Too Many Requests",
      });
    }
    return originalFetch(url, options);
  };

  try {
    // If Gemini key is set in environment, Gemini will be called
    if (process.env.GEMINI_API_KEY) {
      const result = await executeAIRequest({
        systemPrompt: "You are a test assistant.",
        userPrompt: "Respond with OK",
        maxTokens: 10,
        timeoutMs: 5000,
      });

      assert.equal(groqCalled, true, "Groq was called first as primary");
      assert.equal(result.provider, "gemini", "Fallback to Gemini was triggered successfully");
      assert.equal(result.fallbackTriggered, true);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Both providers failing returns clear error without fabricated output", async () => {
  const originalFetch = globalThis.fetch;

  // Mock both providers failing
  globalThis.fetch = async () => {
    return new Response(JSON.stringify({ error: "Service Unavailable" }), {
      status: 503,
      statusText: "Service Unavailable",
    });
  };

  try {
    await assert.rejects(
      async () => {
        await executeAIRequest({
          systemPrompt: "Test",
          userPrompt: "Test",
          maxTokens: 10,
          timeoutMs: 2000,
        });
      },
      (err) => {
        assert(err instanceof Error);
        return true;
      },
      "Must throw error when both providers fail, never fabricating output"
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
