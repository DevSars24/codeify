import { GoogleGenerativeAI } from "@google/generative-ai";

/* ================= FALLBACK TASKS ================= */
function fallbackTasks(category: string, level: string) {
  return [
    {
      title: "Build a Responsive Layout",
      description:
        "Create a responsive layout using Flexbox or CSS Grid that works well on mobile and desktop screens.",
    },
    {
      title: "Form Validation",
      description:
        "Build a form with client-side validation and display meaningful error messages for invalid input.",
    },
    {
      title: "API Integration",
      description:
        "Fetch data from a public API and render it with proper loading and error states.",
    },
    {
      title: "Component Refactoring",
      description:
        "Refactor a large UI component into smaller reusable components.",
    },
    {
      title: "Performance Optimization",
      description:
        "Optimize a page by reducing unnecessary re-renders and improving performance.",
    },
  ];
}

/* ================= QUOTA CHECK ================= */
function isQuotaError(error: any) {
  const msg = error?.message?.toLowerCase() || "";
  return (
    msg.includes("quota") ||
    msg.includes("429") ||
    msg.includes("exceeded") ||
    msg.includes("too many requests")
  );
}

/* ================= POST HANDLER ================= */
export async function POST(req: Request) {
  try {
    const { category, level, title, count } = await req.json();

    // 🔒 Missing API Key
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        tasks: fallbackTasks(category, level),
        warning: "AI unavailable. Showing default practice tasks.",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const prompt = `
You are an API.

Return STRICT JSON ONLY.
No explanation.
No markdown.
No extra text.

Example:
{
  "tasks": [
    {
      "title": "Example Task",
      "description": "Example description"
    }
  ]
}

Generate ${count} practical coding tasks.

Category: ${category}
Level: ${level}
Topic: ${title}

Return JSON ONLY.
`.trim();

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err: any) {
      if (isQuotaError(err)) {
        return Response.json({
          tasks: fallbackTasks(category, level),
          warning: "High traffic. Showing default tasks.",
        });
      }
      throw err;
    }

    const raw = result?.response?.text?.() || "";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json({
        tasks: fallbackTasks(category, level),
        warning: "AI returned invalid JSON. Using defaults.",
      });
    }

    if (!Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
      return Response.json({
        tasks: fallbackTasks(category, level),
        warning: "AI returned empty tasks. Using defaults.",
      });
    }

    return Response.json({ tasks: parsed.tasks });

  } catch (err) {
    console.error("DEV GENERATE ERROR:", err);

    return Response.json({
      tasks: fallbackTasks("web", "Basic"),
      warning: "Server error. Showing safe practice tasks.",
    });
  }
}
