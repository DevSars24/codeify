# CodeSaarthi (Codeify): System Design Document

> **Version**: 2.0.0  
> **Platform**: CodeSaarthi (*Codeify*)  
> **Stack**: Next.js 16 (App Router), React 19, Groq, Google Gemini, LiveKit, Prisma, PostgreSQL (Supabase), Clerk, Monaco Editor, Cloudinary, GSAP, TailwindCSS v4  
> **Author**: Saurabh Singh Rajput

---

## Executive Summary

**CodeSaarthi** is an AI-native developer platform that combines a multi-language code playground, competitive-programming contests, a Socratic project-review mentor, and live video mentorship rooms.

Core capabilities:

- **Code Playground** with 11 languages (JavaScript, Python, Java, C++, C, TypeScript, C#, Go, Rust, PHP, Bash) and streaming AI actions: explain, optimize, fix, simulate.
- **DSA Arena**: timed contests judged in one batched LLM call (LLM-as-a-judge).
- **Dev Arena**: architecture and full-stack challenges reviewed by the *Kautilya Saarthi* mentor persona, which guides instead of giving answers.
- **Live Cohorts**: low-latency video rooms built on the LiveKit SFU.
- **History and Leaderboard**: Recharts dashboards over saved contest attempts.

The design philosophy is **serverless-first, edge-guarded, and multi-provider resilient**.

---

## Table of Contents

1. [System Topology](#1-system-topology)
2. [Architectural Decisions and Trade-Offs](#2-architectural-decisions-and-trade-offs)
3. [Core Subsystems and Workflows](#3-core-subsystems-and-workflows)
4. [Database Design](#4-database-design)
5. [File-by-File Directory Breakdown](#5-file-by-file-directory-breakdown)
6. [Component Hierarchy and Client State Machine](#6-component-hierarchy-and-client-state-machine)
7. [AI Output Sanitization and Resilience](#7-ai-output-sanitization-and-resilience)
8. [Performance and Caching](#8-performance-and-caching)
9. [Security and Secret Handling](#9-security-and-secret-handling)
10. [Local Setup Guide](#10-local-setup-guide)
11. [Known Limitations](#11-known-limitations)
12. [Roadmap v3.0](#12-roadmap-v30)

---

## 1. System Topology

CodeSaarthi is one Next.js 16 App Router application deployed on Vercel. Specialized work is delegated to managed services: Supabase (Postgres), Groq and Gemini (inference), LiveKit (WebRTC), Cloudinary (media), and Clerk (identity).

```mermaid
flowchart TD
    Client["User Browser<br/>React 19, Monaco, LiveKit client"]

    subgraph EDGE["Edge Security Tier"]
        MW["middleware.ts<br/>Clerk route guard"]
        Public["Public routes<br/>home, blogs, welcome"]
        Redirect["Redirect to sign-in"]
    end

    subgraph COMPUTE["Serverless Compute"]
        AI_API["AI routes<br/>api/gemini, api/dsa, api/dev"]
        RTC_API["api/livekit/token"]
        DATA_API["Data routes<br/>contest, leaderboard, history"]
        UP_API["api/upload"]
    end

    subgraph AIGW["AI Resilience Gateway"]
        Cache{"LRU cache<br/>SHA-256 key"}
        Pool["Round-robin<br/>Groq key pool"]
        Groq["Groq primary"]
        Gemini["Gemini fallback"]
        Stream["SSE stream encoder"]
    end

    subgraph RTC["Real-Time Media"]
        Sign["livekit-server-sdk<br/>signed JWT"]
        SFU["LiveKit Cloud SFU"]
    end

    subgraph DB["Persistence"]
        Prisma["Prisma client singleton"]
        Pooler["Supavisor pooler<br/>port 6543"]
        PG[("PostgreSQL<br/>Supabase")]
    end

    subgraph ASSETS["Media"]
        Cloud["Cloudinary storage and CDN"]
    end

    Client -->|"HTTPS"| MW
    MW -->|"public"| Public
    MW -->|"valid session"| COMPUTE
    MW -->|"no session"| Redirect

    AI_API --> Cache
    Cache -->|"hit"| Client
    Cache -->|"miss"| Pool
    Pool --> Groq
    Groq -->|"429 or timeout"| Gemini
    Groq -->|"tokens"| Stream
    Gemini --> Stream

    RTC_API --> Sign
    Sign -->|"short-lived JWT"| Client
    Client <-->|"WebRTC media"| SFU

    DATA_API --> Prisma
    Prisma --> Pooler
    Pooler --> PG

    UP_API --> Cloud
```

**How a request flows**

1. **Edge interception**: every request passes `middleware.ts`. Unauthenticated users hitting `/dsa`, `/dev`, `/history`, or `/admin` are redirected before any serverless code runs.
2. **Stateless compute**: route handlers hold no application state between requests, so the app scales horizontally. (The in-memory AI cache is a per-instance optimization, not a source of truth.)
3. **Decoupled services**: contest saves go only to Postgres, live sessions only to LiveKit, uploads only to Cloudinary, and code evaluation only to the AI gateway.

---

## 2. Architectural Decisions and Trade-Offs

### 2.1 LLM-as-a-Judge vs. Sandboxed Execution (Docker, Judge0, Piston)

| Dimension | LLM-as-a-Judge (chosen) | Sandboxed containers |
|---|---|---|
| Security surface | User code is never executed, so no fork bombs or container escapes. Risk moves to prompt injection (see Known Limitations). | Large attack surface. Needs seccomp, cgroups, and network isolation. |
| Compute cost | No local CPU or RAM. Inference is offloaded to Groq or Gemini. | Needs warm container pools and kernel resource limits. |
| Accuracy | Judges approach, complexity, and logic. May misjudge edge cases. | Deterministic stdin/stdout comparison against hidden tests. |
| Language support | Any language the model understands, with no compilers to maintain. | Each of the 11 runtimes must be built, patched, and secured. |
| Cost | Very low per request, helped by the key pool and cache. | Fixed monthly cost for always-on infrastructure. |

> [!NOTE]
> **Decision**: LLM-as-a-Judge with a conservative fail-safe: a timeout or malformed JSON yields a score of 0 with an explanation. This removes infrastructure cost and gives instant 11-language support, at the price of non-deterministic judging.

### 2.2 Multi-Key Groq Pool with Gemini Fallback vs. Single Vendor

```mermaid
flowchart LR
    subgraph SINGLE["Single provider: fragile"]
        R1["Request"] --> K1["One API key"]
        K1 -->|"429 rate limit"| F1["Feature outage"]
    end

    subgraph MULTI["CodeSaarthi gateway: fault tolerant"]
        R2["Request"] --> H2{"Cache check"}
        H2 -->|"hit"| Out1["Instant response"]
        H2 -->|"miss"| RR["Round-robin selector"]
        RR --> G1["Groq key 1"]
        RR --> G2["Groq key 2"]
        RR --> GN["Groq key N"]
        G1 -->|"429"| G2
        G2 -->|"pool exhausted"| GM["Gemini circuit"]
        GM --> Out2["Response or typed error"]
    end
```

1. **LRU cache**: the prompt and settings are hashed with SHA-256. Repeat requests return in about a millisecond and spend no tokens.
2. **Key pool** (`GROQ_API_KEY_POOL`): keys are rotated round-robin, multiplying effective rate limits by the number of keys.
3. **Cross-provider failover**: on a 429 or a timeout beyond 9000 ms, the request falls over to Gemini (`gemini-2.5-flash-lite`). If Gemini also fails, an `AIProviderError` is thrown and the UI shows a retry state.

### 2.3 Supavisor Transaction Pooling vs. Direct Database Connections

- **Problem**: on serverless, each concurrent request may start its own Node instance and open its own Postgres connection. Postgres typically supports only tens to low hundreds of connections, so a burst of contest submissions can exhaust it.
- **Solution**:
  - `DATABASE_URL` points to **Supavisor on port 6543** (transaction mode). A small set of physical connections is multiplexed across many short-lived queries.
  - `DIRECT_URL` points to **Postgres on port 5432** (session mode). It is used only by Prisma migrations and `db push`, which need features that transaction-mode poolers do not support.

### 2.4 SFU vs. Peer-to-Peer Mesh

```mermaid
flowchart LR
    subgraph MESH["P2P mesh: N x (N-1) streams"]
        A1(("A")) --- B1(("B"))
        A1 --- C1(("C"))
        A1 --- D1(("D"))
        B1 --- C1
        B1 --- D1
        C1 --- D1
    end

    subgraph SFUG["SFU: one upload per user"]
        A2(("A")) --> HUB["LiveKit SFU"]
        B2(("B")) --> HUB
        C2(("C")) --> HUB
        D2(("D")) --> HUB
        HUB --> A2
        HUB --> B2
        HUB --> C2
        HUB --> D2
    end
```

- **Mesh problem**: each participant sends media to every other participant, so total streams grow as N x (N - 1). Ten participants means 90 streams, which exhausts client bandwidth and CPU.
- **SFU benefit**: each client uploads one stream and the server forwards it to subscribers, with simulcast for adaptive quality. Client upload stays constant as the room grows.

### 2.5 Denormalized JSON Submissions vs. Normalized Rows

| Approach | Writes per contest | Reads for history and leaderboard | Trade-off |
|---|---|---|---|
| Normalized (Attempt + Submission rows) | 1 + N inserts | Joins required | Easy per-question queries, more complexity |
| **Denormalized (chosen)** | **1 insert** | **Single indexed scan** | Per-question analytics need JSON queries |

`ContestAttempt.submissions` is stored as a single `Json` column, so a whole attempt is saved atomically in one insert.

---

## 3. Core Subsystems and Workflows

### 3.1 Edge Authentication and Route Guard

**Source**: `middleware.ts`

```mermaid
sequenceDiagram
    autonumber
    actor Client as Browser
    participant Edge as Edge Middleware
    participant Clerk as Clerk
    participant Route as App Router

    Client->>Edge: GET protected route
    Edge->>Clerk: Validate session cookie and JWT
    alt Public route
        Edge->>Route: Forward request
    else Protected and valid session
        Clerk-->>Edge: Session claims confirmed
        Edge->>Route: Forward with auth context
    else Protected and no session
        Edge-->>Client: 302 redirect to sign-in
    end
```

- **Central gating**: route protection lives in one place using Clerk's `createRouteMatcher`, instead of `if (!user)` checks scattered across pages.
- **Public routes** include `/`, `/home`, `/blogs`, `/welcome`.
- **Admin routes** (`/admin/sessions`, `/admin/blog`) verify the signed-in user's email against an administrator address. Recommended: read this from an environment variable such as `ADMIN_EMAIL` instead of hardcoding it.
- **Token endpoint**: `/api/livekit/token` authenticates the user itself inside the handler (see 3.6), so keep it consistent with the matcher configuration.

### 3.2 AI Resilience Gateway

**Source**: `app/lib/ai/provider.ts`, `service.ts`, `cache.ts`

```mermaid
flowchart TD
    Start["executeAIRequest"] --> Hash["SHA-256 of system prompt,<br/>user prompt and model"]
    Hash --> Check{"LRU cache"}
    Check -->|"hit"| Cached["Return cached result"]
    Check -->|"miss"| Select["Pick next Groq key<br/>index modulo pool size"]
    Select --> CallGroq["Call Groq<br/>9 second timeout"]
    CallGroq --> Status{"Groq result"}
    Status -->|"200"| Clean["Strip markdown fences"]
    Status -->|"429 or timeout"| More{"More keys?"}
    More -->|"yes"| Select
    More -->|"no"| CallGemini["Call Gemini fallback"]
    CallGemini --> GStatus{"Gemini result"}
    GStatus -->|"200"| Clean
    GStatus -->|"error"| Fatal["Throw AIProviderError"]
    Clean --> Zod{"Zod validation"}
    Zod -->|"valid"| Save["Write to cache, TTL 10 min"]
    Zod -->|"invalid"| Heal["Retry with correction prompt"]
    Heal --> Clean
    Save --> Done["Return typed result"]
```

### 3.3 Streaming AI Responses (SSE)

**Source**: `app/lib/ai/stream.ts`, `client.ts`, `app/api/gemini/route.ts`

```mermaid
sequenceDiagram
    autonumber
    actor User as Browser
    participant Route as api/gemini
    participant Cache as LRU Cache
    participant Provider as AI Provider
    participant Groq as Groq

    User->>Route: POST prompt with stream true
    Route->>Cache: Look up hash
    alt Cache hit
        Cache-->>Route: Full cached text
        Route-->>User: Stream cached text and close
    else Cache miss
        Route->>Provider: Start stream request
        Provider->>Groq: Stream completion
        Groq-->>Provider: Token chunks
        Provider-->>Route: ReadableStream
        Route-->>User: 200 chunked response
        loop Each chunk
            Route-->>User: Byte chunk
            User->>User: Append and render markdown
        end
        Route->>Cache: Save full output
    end
```

### 3.4 DSA Arena: Batched Evaluation

**Source**: `app/api/dsa/evaluate-all/route.ts`, `app/contestdsa/page.tsx`, `app/components/ContestDsa.tsx`

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Participant
    participant UI as ContestDsa
    participant Eval as api/dsa/evaluate-all
    participant AI as AI Service
    participant Save as api/contest/save
    participant DB as Postgres

    Candidate->>UI: Click Submit Contest
    UI->>Eval: POST questions, submissions, language
    Note over Eval: Filter empty answers. If all are empty, return score 0 with no LLM call.
    Eval->>AI: Send batched judge prompt
    AI-->>Eval: JSON with correct, total, accuracy
    Eval-->>UI: Verdict
    UI->>Save: POST topic, scores, submissions
    Save->>DB: contestAttempt.create
    DB-->>Save: Saved
    Save-->>UI: 200 OK
    UI->>Candidate: Redirect to history
```

### 3.5 Dev Arena: Socratic Mentor (Kautilya Saarthi)

**Source**: `app/api/dev/submit/route.ts`, `app/contestdev/page.tsx`, `app/components/ContestDev.tsx`

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant Client as ContestDev
    participant Route as api/dev/submit
    participant AI as AI Service

    Dev->>Client: Write solution code
    Client->>Route: POST task and code
    Route->>Route: Validate minimum code length
    Note over Route: Mentor persona prompt. Never give working code. Guide with questions.
    Route->>AI: executeAIRequest with JSON format
    AI-->>Route: verdict, score 0 or 1, feedback
    Route-->>Client: Mentor feedback
    Client->>Dev: Render feedback card
```

### 3.6 Live Cohorts with LiveKit

**Source**: `app/api/livekit/token/route.ts`, `app/sessions/[id]/room/page.tsx`, `app/components/VideoRoom.tsx`

```mermaid
sequenceDiagram
    autonumber
    actor User as Student
    participant Room as Room page
    participant Token as api/livekit/token
    participant Clerk as Clerk
    participant LK as LiveKit Cloud

    User->>Room: Open session room
    Room->>Token: GET token for room name
    Token->>Clerk: auth check
    alt Not signed in
        Token-->>Room: 401 Unauthorized
    else Signed in
        Token->>Token: Create AccessToken with user identity
        Token->>Token: Add video grant for this room
        Token->>Token: Sign JWT with HMAC-SHA256
        Token-->>Room: 200 with token
    end
    Room->>LK: Connect over WSS with token
    LK->>LK: Verify signature and grants
    LK-->>Room: Connection established
    Room->>LK: Publish camera and screen tracks
    LK-->>Room: Forward other participants
```

### 3.7 Multi-Language Code Studio

**Source**: `app/home/page.tsx`, `app/components/Home.tsx`

```mermaid
flowchart TD
    Pick["Select language"] --> Starter["Load starter template"]
    Starter --> Monaco["Monaco editor<br/>client-only dynamic import"]
    Monaco --> Edit["User edits code"]
    Edit --> Action{"AI action"}
    Action --> Abort["Abort any stale request"]
    Abort --> Fetch["POST api/gemini with stream true"]
    Fetch --> Decode["Read stream with TextDecoder"]
    Decode --> Append["Append chunks to React state"]
    Append --> Render["Render markdown with syntax highlighting"]
```

### 3.8 Image Uploads (Cloudinary)

**Source**: `app/api/upload/route.ts`, `app/admin/blog/new/page.tsx`

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin
    participant UI as Blog editor
    participant Route as api/upload
    participant CDN as Cloudinary
    participant DB as Postgres

    Admin->>UI: Choose cover image
    UI->>Route: POST multipart form data
    Route->>Route: Read file into buffer
    Route->>CDN: upload_stream to codeify_blogs folder
    CDN-->>Route: Secure CDN URL
    Route-->>UI: url
    UI->>DB: Save blog with imageUrl
```

---

## 4. Database Design

Prisma ORM on PostgreSQL (Supabase). Clerk is the source of truth for identity, so tables store Clerk identifiers (`userId`, `authorEmail`, `hostEmail`) and never passwords.

```mermaid
erDiagram
    ContestAttempt {
        string id PK
        string userId "Clerk user id, indexed"
        string topic
        int correct
        int total
        float accuracy
        string language
        string difficulty
        json submissions "all answers by question id"
        datetime createdAt "indexed"
        datetime updatedAt
    }

    Blog {
        string id PK
        string title
        string content "markdown"
        string domains "tag list"
        string source
        string pattern
        string imageUrl "Cloudinary URL"
        string authorEmail
        string slug UK
        datetime createdAt "indexed"
        datetime updatedAt
    }

    LiveSession {
        string id PK
        string title
        string description
        string roomName UK "LiveKit room"
        datetime scheduledAt "indexed"
        int duration "minutes, default 60"
        string status "scheduled, live or finished"
        string hostEmail
        int maxParticipants "default 50"
        datetime createdAt
        datetime updatedAt
    }
```

The three models are intentionally independent. They link to users only through Clerk identifiers, not through foreign keys.

### 4.1 Index Strategy

| Index | Purpose |
|---|---|
| `ContestAttempt.userId` | Fast per-user history on `/history` |
| `ContestAttempt.createdAt` | Recent-first ordering for `/leaderboard` |
| `LiveSession.scheduledAt` | Upcoming sessions on `/sessions` |
| `Blog.slug` (unique) | Direct lookup for `/blogs/[slug]` |

### 4.2 Connection Topology

```mermaid
flowchart TD
    subgraph FN["Serverless instances"]
        F1["Handler 1"]
        F2["Handler 2"]
        FN1["Handler N"]
    end

    F1 --> Single["Prisma singleton<br/>globalThis guard"]
    F2 --> Single
    FN1 --> Single

    Single -->|"DATABASE_URL, port 6543"| Pooler["Supavisor transaction pooler"]
    CLI["Prisma CLI migrations"] -->|"DIRECT_URL, port 5432"| Direct["Direct Postgres"]

    Pooler --> PG[("PostgreSQL")]
    Direct --> PG
```

---

## 5. File-by-File Directory Breakdown

### 5.1 Root Configuration

| File | Role |
|---|---|
| `middleware.ts` | Edge route guard using Clerk `createRouteMatcher` |
| `package.json` | Dependencies: Next 16, React 19, Prisma, LiveKit, GSAP, Monaco, Recharts |
| `next.config.ts` | Compiler settings and allowed image domains (Cloudinary, Clerk, Unsplash) |
| `tsconfig.json` | Strict TypeScript and path aliases |
| `eslint.config.mjs` | Flat ESLint config for Next.js and React 19 |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` for Tailwind v4 |
| `components.json` | shadcn / Radix UI component mapping |
| `.env.example` | Template of all required environment variables |

### 5.2 Persistence

| File | Role |
|---|---|
| `prisma/schema.prisma` | Models (`ContestAttempt`, `Blog`, `LiveSession`) and the two connection URLs |
| `app/lib/prisma.ts` | `PrismaClient` singleton on `globalThis` to avoid connection exhaustion during dev hot reload |

### 5.3 AI Engine (`app/lib/ai/`)

| File | Role |
|---|---|
| `provider.ts` | Groq key-pool rotation, timeouts, and Gemini fallback |
| `service.ts` | Judge and mentor prompts, fence stripping, Zod validation |
| `cache.ts` | In-memory LRU cache with SHA-256 keys and TTL |
| `stream.ts` | Converts provider token streams into browser-readable streams |
| `client.ts` | Client helper for decoding streamed chunks |
| `types.ts` | Shared TypeScript types and error classes |

### 5.4 Utility Libraries (`app/lib/`)

| File | Role |
|---|---|
| `motion.ts` | Reusable Framer Motion variants |
| `questionBank.ts` | Static DSA problem bank |
| `questionBank2.ts` | Dev Arena challenge bank |
| `utils.ts` | `clsx` and `tailwind-merge` class helper |

### 5.5 API Routes (`app/api/`)

| Route | Role |
|---|---|
| `gemini/route.ts` | Playground AI endpoint with SSE streaming and cache |
| `dsa/evaluate-all/route.ts` | Batched DSA judge, skips empty answers |
| `dsa/generate/route.ts` | Generates problems by topic and difficulty |
| `dsa/simulate/route.ts` | Step-by-step execution simulation |
| `dsa/mentor-explanation/route.ts` | Hints and conceptual explanations |
| `dev/submit/route.ts` | Kautilya Saarthi evaluation |
| `dev/generate/route.ts` | Generates Dev Arena briefs |
| `contest/save/route.ts` | Persists a `ContestAttempt` |
| `leaderboard/route.ts` | Aggregates rankings by user |
| `history/route.ts` | Returns the signed-in user's attempts |
| `livekit/token/route.ts` | Mints signed LiveKit tokens |
| `blogs/route.ts` | Blog CRUD |
| `sessions/route.ts` | Create and list live sessions |
| `upload/route.ts` | Uploads images to Cloudinary |

### 5.6 Pages (`app/`)

| Page | Role |
|---|---|
| `page.tsx` | Landing page with GSAP animations |
| `layout.tsx` | Root layout with `ClerkProvider` and dark theme |
| `globals.css` | Design tokens and Tailwind v4 styles |
| `home/page.tsx` | 11-language playground |
| `welcome/page.tsx` | Track onboarding (DSA, Dev, Cohorts) |
| `dsa/page.tsx` | DSA contest configuration |
| `contestdsa/page.tsx` | DSA contest workspace |
| `dev/page.tsx` | Dev challenge configuration |
| `contestdev/page.tsx` | Dev contest workspace |
| `sessions/page.tsx` | Live session directory |
| `sessions/[id]/room/page.tsx` | LiveKit video room |
| `blogs/page.tsx` | Blog list with search and filters |
| `blogs/[slug]/page.tsx` | Blog reader |
| `leaderboard/page.tsx` | Global rankings |
| `history/page.tsx` | Recharts analytics dashboard |
| `admin/page.tsx` | Admin hub for sessions and blogs |
| `sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in |
| `sign-up/[[...sign-up]]/page.tsx` | Clerk sign-up |

### 5.7 Components (`app/components/`)

| Component | Role |
|---|---|
| `AmbientBackground.tsx` | Particle canvas and ambient lighting backdrop |
| `Home.tsx` | Playground: templates, Monaco state, AI actions, streamed output |
| `Navbar.tsx` | Global navigation with Clerk profile and admin link |
| `ContestDsa.tsx` | Contest engine: pagination, timer, submission modal |
| `ContestDev.tsx` | Dev Arena input and mentor feedback |
| `VideoRoom.tsx` | LiveKit room UI |
| `VideoRoomWrapper.tsx` | Client-only wrapper (`ssr: false`) |
| `HistoryVisualizations.tsx` | Recharts accuracy and performance charts |
| `LeaderboardList.tsx` | Ranked list with badges |
| `MeetDeveloperSection.tsx` | Developer showcase card |
| `PlaygroundPreviewSection.tsx` | Animated landing page playground preview |
| `PricingSection.tsx` | Free and Pro tier presentation |
| `TerminalMission.tsx` | Retro terminal feature demo |

---

## 6. Component Hierarchy and Client State Machine

### 6.1 Contest Workspace Tree

```mermaid
flowchart TD
    Root["RootLayout<br/>ClerkProvider, dark theme"] --> Page["ContestDSAPage"]
    Page --> Nav["Navbar"]
    Page --> Container["ContestDsa<br/>core state container"]

    Container --> Left["Problem statement pane"]
    Container --> Right["Monaco editor<br/>ssr false"]
    Container --> Timer["Countdown timer<br/>auto submit"]
    Container --> Tabs["Question tabs"]
    Container --> Submit["Submit contest"]

    Submit --> Eval["api/dsa/evaluate-all"]
    Eval --> Modal["Verdict modal"]
    Modal --> SaveCall["api/contest/save"]
    SaveCall --> Redirect["Redirect to history"]
```

### 6.2 State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : mount workspace
    Loading --> InProgress : questions loaded, timer starts

    state InProgress {
        [*] --> EditingCode
        EditingCode --> SwitchingQuestion : select another tab
        SwitchingQuestion --> EditingCode : load saved code
    }

    InProgress --> Submitting : submit clicked or timer ends
    Submitting --> Evaluating : send to evaluate-all
    Evaluating --> EvaluationSuccess : verdict received
    Evaluating --> EvaluationError : timeout or AI error
    EvaluationError --> InProgress : show toast, allow retry
    EvaluationSuccess --> SavingAttempt : write to database
    SavingAttempt --> Complete : record saved
    Complete --> [*]
```

---

## 7. AI Output Sanitization and Resilience

LLM output is treated as untrusted input. Every response goes through the same pipeline before it reaches the UI.

```mermaid
flowchart LR
    Raw["Raw model output"] --> Strip["Strip markdown code fences"]
    Strip --> Parse["JSON.parse"]
    Parse -->|"syntax error"| Fail["Fail-safe:<br/>score 0, Evaluation Failed"]
    Parse -->|"parsed"| Zod{"Zod safeParse"}
    Zod -->|"valid"| Ok["Cache and return typed object"]
    Zod -->|"invalid"| Reflect["Correction prompt:<br/>reformat to exact schema"]
    Reflect --> Strip
```

Resilience rules:

1. **Empty-submission short-circuit**: if every answer is blank, `/api/dsa/evaluate-all` returns 0 without calling any model. This saves quota and prevents a model from rating empty code as correct.
2. **Conservative failure**: a timeout (over 9000 ms) or unparseable response produces a score of 0 plus an explanatory message.
3. **Bounded self-healing**: the correction-prompt retry should be limited to a small fixed number of attempts to prevent loops and cost spikes.

---

## 8. Performance and Caching

```mermaid
flowchart TD
    T1["Tier 1: ISR<br/>revalidate 60 seconds<br/>blogs and leaderboard"]
    T2["Tier 2: in-memory LRU cache<br/>AI responses, SHA-256 keys"]
    T3["Tier 3: client-only dynamic imports<br/>Monaco and LiveKit"]
    T4["Tier 4: Supavisor pooling<br/>few DB connections, many requests"]

    T1 --> T2 --> T3 --> T4
```

1. **ISR**: `/blogs` and `/leaderboard` use `export const revalidate = 60`, so most visits are served from cache and the database is hit at most about once a minute per page.
2. **Dynamic imports**: `@monaco-editor/react` and `@livekit/components-react` load with `ssr: false`, keeping them out of the server bundle and avoiding hydration errors with `window` and `navigator.mediaDevices`.
3. **GPU-friendly styling**: animations use transforms and `will-change` so they run on the compositor thread.
4. **LRU scope**: the AI cache lives in one serverless instance's memory, so hit rate depends on instance reuse. A shared cache is on the roadmap.

---

## 9. Security and Secret Handling

```mermaid
flowchart LR
    subgraph PUB["Public client bundle"]
        P1["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"]
        P2["NEXT_PUBLIC_CLERK_SIGN_IN_URL"]
        P3["NEXT_PUBLIC_LIVEKIT_URL"]
        P4["NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"]
    end

    subgraph SRV["Server only, never exposed"]
        S1["CLERK_SECRET_KEY"]
        S2["DATABASE_URL and DIRECT_URL"]
        S3["GROQ_API_KEY and GROQ_API_KEY_POOL"]
        S4["GEMINI_API_KEY"]
        S5["LIVEKIT_API_KEY and LIVEKIT_API_SECRET"]
        S6["CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET"]
    end

    PUB -->|"HTTPS and JWT"| SRV
```

- **Secret confinement**: Groq, Gemini, LiveKit, Cloudinary, and database secrets are read only in server route handlers and have no `NEXT_PUBLIC_` prefix.
- **Short-lived LiveKit tokens**: tokens are minted per user with a room-specific grant and a short expiry.
- **SQL injection**: Prisma issues parameterized queries.
- **Recommended hardening**: validate request bodies with Zod on every route, cap upload file size and MIME type, and rate-limit AI routes per user.

---

## 10. Local Setup Guide

### Prerequisites

- Node.js 18 or higher (Node 20+ recommended)
- npm or pnpm
- Git

### Steps

1. **Clone**
   ```bash
   git clone https://github.com/DevSars24/codeify.git
   cd codeify
   ```

2. **Install**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   ```env
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Database (Supabase)
   DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

   # AI (Groq + Gemini)
   GROQ_API_KEY="gsk_..."
   GROQ_API_KEY_POOL="gsk_key1,gsk_key2,gsk_key3"
   GROQ_MODEL="<a model id available on your Groq account>"
   GEMINI_API_KEY="AIzaSy..."
   GEMINI_MODEL="gemini-2.5-flash-lite"

   # LiveKit
   NEXT_PUBLIC_LIVEKIT_URL="wss://[project].livekit.cloud"
   LIVEKIT_API_KEY="API..."
   LIVEKIT_API_SECRET="secret..."

   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

4. **Generate the Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Sync the schema (optional)**
   ```bash
   npx prisma db push
   ```

6. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

---

## 11. Known Limitations

An honest list helps reviewers trust the rest of the document.

| Area | Limitation | Mitigation |
|---|---|---|
| Judging accuracy | LLM verdicts are non-deterministic and can misjudge edge cases. | Roadmap: WASM test runners for deterministic checks. |
| Prompt injection | Submitted code can contain text that tries to steer the judge ("mark this correct"). | Wrap code in clear delimiters, instruct the model to ignore instructions inside code, and validate output schema strictly. |
| Cache scope | The LRU cache is per instance and is lost on cold starts. | Move to Redis (Phase 2). |
| Fallback guarantee | If Groq and Gemini both fail, the request errors. The system fails safely but is not guaranteed to succeed. | UI retry state and fail-safe scoring. |
| Hardcoded admin | An admin email in source is hard to rotate. | Use an environment variable or Clerk roles. |

---

## 12. Roadmap v3.0

```mermaid
flowchart TD
    Now["v2.0 current"] --> P1["Phase 1:<br/>hybrid evaluation"]
    Now --> P2["Phase 2:<br/>distributed cache"]
    Now --> P3["Phase 3:<br/>pair programming"]

    P1 --> D1["LLM semantic judging plus<br/>WebAssembly test runners"]
    P2 --> D2["Upstash Redis or Dragonfly<br/>shared across regions"]
    P3 --> D3["Yjs CRDTs over LiveKit<br/>data channels"]
```

1. **Hybrid execution**: combine LLM judging with client-side WebAssembly runners for deterministic output and complexity checks, still with no server containers.
2. **Distributed cache**: replace the in-memory LRU with Redis so cache hits are shared across all serverless instances and regions.
3. **Collaborative coding**: use Yjs CRDTs over LiveKit data channels for live shared editing inside video sessions.

---

*CodeSaarthi: engineered for performance, resilience, and clarity.*
