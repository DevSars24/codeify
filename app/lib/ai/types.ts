import { z } from "zod";

export const SupportedLanguages = ["python", "c++", "cpp", "javascript", "js", "java"] as const;

// 1. Simulation Schema
export const SimulateRequestSchema = z.object({
  code: z.string().min(1, "Code cannot be empty").max(4000, "Code exceeds 4,000 characters limit"),
  language: z.string().min(1, "Language is required"),
  input: z.string().max(1000, "Input exceeds 1,000 characters limit").default(""),
  problemId: z.number().optional(),
  problemTitle: z.string().max(150).optional(),
});

export const SimulateResultSchema = z.object({
  predictedOutput: z.string(),
  hasSyntaxError: z.boolean().default(false),
  hasRuntimeError: z.boolean().default(false),
  errorSummary: z.string().optional(),
  confidence: z.enum(["High", "Medium", "Low"]).default("Medium"),
  reasoning: z.string().default(""),
});

export type SimulateResult = z.infer<typeof SimulateResultSchema> & {
  action: "Simulate with AI";
  disclaimer: "Predicted output — code was not executed.";
  provider: "groq" | "gemini";
  model: string;
  cached?: boolean;
  latencyMs?: number;
};

// 2. Assessment Schema
export const AssessRequestSchema = z.object({
  code: z.string().min(1, "Code cannot be empty").max(4000, "Code exceeds 4,000 characters limit"),
  language: z.string().min(1, "Language is required"),
  problemId: z.number().optional(),
  problemTitle: z.string().min(1, "Problem title is required"),
  problemDescription: z.string().max(2000, "Description exceeds limit").default(""),
});

export const AssessResultSchema = z.object({
  aiEstimatedScore: z.number().min(0).max(100),
  verdictLabel: z.enum([
    "Likely Correct",
    "Potential Logic Error",
    "Potential Syntax Error",
    "Edge Case Failure",
    "Uncertain",
  ]),
  summary: z.string(),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  likelyEdgeCaseFailures: z.array(z.string()).default([]),
  confidence: z.enum(["High", "Medium", "Low"]).default("Medium"),
});

export type AssessResult = z.infer<typeof AssessResultSchema> & {
  action: "AI Assessment";
  scoreLabel: "AI-estimated score";
  disclaimer: "AI-estimated assessment — code was not executed on a sandbox runner.";
  isVerified: false;
  provider: "groq" | "gemini";
  model: string;
  cached?: boolean;
  latencyMs?: number;
  assessmentId: string;
};

// 3. Mentor Explanation Schema
export const MentorExplanationRequestSchema = z.object({
  code: z.string().min(1).max(4000),
  language: z.string(),
  problemTitle: z.string(),
  problemDescription: z.string().default(""),
  assessmentSummary: z.string().max(500).default(""),
  likelyEdgeCases: z.array(z.string()).default([]),
});

export interface MentorExplanationResult {
  explanation: string;
  suggestedFixHint: string;
  provider: "groq" | "gemini";
  model: string;
  cached?: boolean;
  latencyMs?: number;
}
