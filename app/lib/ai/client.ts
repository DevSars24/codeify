import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

let genAIInstance: GoogleGenerativeAI | null = null;
const modelCache = new Map<string, GenerativeModel>();

/**
 * Returns a singleton instance of GoogleGenerativeAI
 */
export function getGenAIClient(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

/**
 * Returns a cached model instance to avoid re-creation overhead
 */
export function getAIModel(modelName = "gemini-flash-lite-latest"): GenerativeModel {
  if (!modelCache.has(modelName)) {
    const client = getGenAIClient();
    modelCache.set(modelName, client.getGenerativeModel({ model: modelName }));
  }
  return modelCache.get(modelName)!;
}

interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
}

/**
 * Executes AI API calls with exponential backoff and jitter for rate-limit resilient execution
 */
export async function executeAIWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, initialDelayMs = 500, backoffFactor = 2 } = options;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.statusCode;
      const message = error?.message?.toLowerCase() || "";

      // Check if error is transient / rate limit (429, 503, resource_exhausted, overloaded)
      const isRateLimitOrOverload =
        status === 429 ||
        status === 503 ||
        message.includes("quota") ||
        message.includes("rate") ||
        message.includes("overloaded") ||
        message.includes("resource_exhausted");

      if (!isRateLimitOrOverload || attempt === maxRetries) {
        throw error;
      }

      // Calculate jittered exponential backoff
      const delay = initialDelayMs * Math.pow(backoffFactor, attempt) + Math.random() * 200;
      console.warn(
        `[AI Retry] Retrying Gemini API call (Attempt ${attempt + 1}/${maxRetries}) after ${Math.round(delay)}ms. Cause: ${message}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
