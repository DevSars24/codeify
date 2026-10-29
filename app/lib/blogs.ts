export interface BlogItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  domains: string[];
  source?: string | null;
  pattern?: string | null;
  slug: string;
  createdAt: Date;
}

export const FALLBACK_BLOGS: BlogItem[] = [
  {
    id: "blog-dp-1",
    title: "Mastering Dynamic Programming: From Memoization to State Machines",
    content: "Dynamic programming becomes intuitive once you recognize recurrence relations and state boundaries. In this deep dive, we walk through 0/1 knapsack, interval DP, and tree DP with optimal space-saving techniques.",
    imageUrl: "/assets/DSA-arena.jpg",
    domains: ["DSA", "Algorithms"],
    source: "CodeSaarthi Insights",
    pattern: "Dynamic Programming",
    slug: "mastering-dynamic-programming",
    createdAt: new Date("2026-03-15"),
  },
  {
    id: "blog-ai-2",
    title: "Building Resilient Multi-Model AI Pipelines with Groq & Gemini",
    content: "How round-robin API key pooling across Groq LPUs paired with automatic Gemini fallbacks eliminates 429 rate limit spikes, minimizes API costs, and delivers sub-200ms latency on code execution simulations.",
    imageUrl: "/assets/DSAcontest.jpg",
    domains: ["AI Systems", "Groq"],
    source: "System Architecture",
    pattern: "Multi-Model Fallback",
    slug: "resilient-multi-model-ai-pipelines",
    createdAt: new Date("2026-03-20"),
  },
  {
    id: "blog-sys-3",
    title: "Real-time Collaborative Code Editors with WebRTC and LiveKit",
    content: "Exploring low-latency audio/video tracks, peer data channels, and state synchronization needed to run live peer-coding classrooms without server bottlenecks.",
    imageUrl: "/assets/webdev.jpeg",
    domains: ["WebRTC", "Live Coding"],
    source: "LiveKit Engineering",
    pattern: "Realtime Collaboration",
    slug: "realtime-collaborative-editors",
    createdAt: new Date("2026-03-25"),
  },
];
