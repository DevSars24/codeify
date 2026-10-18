# CodeSaarthi (Codeify) — Enterprise System Design Document & Architectural Blueprint 🏛️

> **Version**: 2.0.0-PROD  
> **Platform**: CodeSaarthi (*Codeify*)  
> **Engineering Scope**: Next.js 16 (App Router) · React 19 · Groq LPU Clusters · Google Gemini Multi-Model Failover · LiveKit WebRTC SFU · Prisma ORM · PostgreSQL (Supabase Supavisor) · Clerk Edge Auth · Monaco Editor · Cloudinary CDN · GSAP & TailwindCSS v4  
> **Primary Author**: Saurabh Singh Rajput

---

## Executive Summary

**CodeSaarthi** is an enterprise-grade, AI-native developer accelerator, competitive programming platform, and live interactive mentorship arena. Designed from first principles around a **Serverless-First, Edge-Guarded, and Multi-Cloud Resilient** philosophy, the platform integrates real-time browser code execution simulation across 11 programming languages, batched LLM-as-a-judge contest assessments, Socratic dev project evaluations (*Kautilya Saarthi*), ultra-low latency WebRTC video cohorts via an SFU, and an interactive developer history dashboard powered by Recharts.

This document serves as the **definitive architectural, file-by-file, and trade-off blueprint** for the entire codebase. An engineer, technical auditor, or architect reading this document will gain deep, actionable insights into every subsystem, sequence lifecycle, data model, directory file, failure mode, and engineering compromise made across the system.

---

## Table of Contents

1. [High-Level System Topology & Request Architecture](#1-high-level-system-topology--request-architecture)
2. [Architectural Decisions & In-Depth Trade-Off Analysis](#2-architectural-decisions--in-depth-trade-off-analysis)
3. [Core Subsystems & Execution Workflows](#3-core-subsystems--execution-workflows)
   - [3.1 Edge Authentication & Route Guard Lifecycle](#31-edge-authentication--route-guard-lifecycle)
   - [3.2 AI Resilience Gateway: Multi-Key Round-Robin & Fallback](#32-ai-resilience-gateway-multi-key-round-robin--fallback)
   - [3.3 Zero-Buffering Server-Sent Events (SSE) AI Streaming](#33-zero-buffering-server-sent-events-sse-ai-streaming)
   - [3.4 DSA Arena: Batched Evaluation & CP Judge Engine](#34-dsa-arena-batched-evaluation--cp-judge-engine)
   - [3.5 Dev Arena: Socratic Mentorship Engine (Kautilya Saarthi)](#35-dev-arena-socratic-mentorship-engine-kautilya-saarthi)
   - [3.6 WebRTC SFU Live Cohort & Audio/Video Signaling](#36-webrtc-sfu-live-cohort--audiovideo-signaling)
   - [3.7 Multi-Language Browser Code Studio Engine](#37-multi-language-browser-code-studio-engine)
   - [3.8 Cloudinary Binary Media Processing Pipe](#38-cloudinary-binary-media-processing-pipe)
4. [Database Architecture & Schema Design (Prisma + Supabase)](#4-database-architecture--schema-design-prisma--supabase)
5. [Complete File-by-File Technical Directory Breakdown](#5-complete-file-by-file-technical-directory-breakdown)
6. [Component Hierarchy & Client State Transition Machine](#6-component-hierarchy--client-state-transition-machine)
7. [Zero-Trust AI Sanitization & Resilience Engineering](#7-zero-trust-ai-sanitization--resilience-engineering)
8. [Performance, Caching & Optimization Hierarchy](#8-performance-caching--optimization-hierarchy)
9. [Security Posture & Secret Confinement](#9-security-posture--secret-confinement)
10. [Local Environment Setup & Verification Guide](#10-local-environment-setup--verification-guide)
11. [Future Scaling Roadmap (v3.0)](#11-future-scaling-roadmap-v30)

---

## 1. High-Level System Topology & Request Architecture

The CodeSaarthi platform is deployed as a single, highly-optimized Next.js 16 App Router application running on Vercel's global edge network, delegating specialized workloads to managed external infrastructure (Supabase for persistence, Groq and Google Gemini for inference, LiveKit for WebRTC, Cloudinary for binary blobs, and Clerk for identity).

```mermaid
graph TD
    Client(["User Browser (React 19 / Monaco / LiveKit Client)"]) -->|HTTPS / WSS| EdgeDNS["Cloudflare / Vercel Edge Network"]
    
    subgraph Edge_Security ["Edge Ingestion & Security Tier"]
        EdgeDNS --> EdgeMW["Edge Middleware: middleware.ts (Clerk Edge Runtime)"]
        EdgeMW -->|Public Route Allowed| PublicPaths["Public Paths: /, /home, /blogs, /welcome"]
        EdgeMW -->|Protected: Valid Session JWT| AppRouter["Next.js 16 App Router (Node.js Serverless Runtime)"]
        EdgeMW -->|Protected: Unauthenticated| AuthRedirect["HTTP 302 Redirect -> /sign-in"]
    end

    subgraph Compute_Layer ["Serverless Compute & Route Handlers"]
        AppRouter --> API_AI["AI Gateway: /api/gemini, /api/dsa/*, /api/dev/*"]
        AppRouter --> API_RTC["LiveKit Token Service: /api/livekit/token"]
        AppRouter --> API_Data["Data Services: /api/contest/*, /api/leaderboard, /api/history"]
        AppRouter --> API_Upload["Media Ingest: /api/upload"]
    end

    subgraph AI_Engine ["High-Resilience AI Gateway (app/lib/ai/*)"]
        API_AI --> LRU{"In-Memory LRU Cache\n(SHA-256 Prompt Hash)"}
        LRU -->|Cache Hit: < 1ms| CachedJSON["Instant Cached Response"]
        LRU -->|Cache Miss| KeyPool["Atomic Round-Robin Selector\n(GROQ_API_KEY_POOL)"]
        KeyPool --> GroqLPU["Primary: Groq LPU Clusters\n(Qwen 27B / LLaMA 3.3-70B)"]
        GroqLPU -->|429 Rate Limit / 504 Timeout| GeminiFailover["Fallback Circuit: Google Gemini\n(gemini-2.5-flash-lite)"]
        GroqLPU -->|200 OK Token Stream| SSEHandler["SSE Stream Encoder (stream.ts)"]
        GeminiFailover -->|200 OK| SSEHandler
    end

    subgraph WebRTC_Mesh ["Real-Time Video Media Tier (SFU)"]
        API_RTC --> LK_SDK["livekit-server-sdk (HMAC-SHA256 Token Signing)"]
        LK_SDK --> SignedJWT["Short-Lived Video JWT"]
        SignedJWT --> Client
        Client <-->|WebRTC Media Tracks (Opus/VP8/H.264)| LKSFU["LiveKit Cloud SFU (Selective Forwarding Unit)"]
    end

    subgraph Persistence_Tier ["Data Persistence & Connection Management"]
        API_Data --> PrismaSingleton["Prisma Client Singleton (app/lib/prisma.ts)"]
        PrismaSingleton -->|Port 6543 (Transaction Mode)| Supavisor["Supavisor Connection Pooler"]
        Supavisor --> PostgresDB[("PostgreSQL Remote Instance (Supabase)")]
        PrismaCLI["Prisma CLI Migrations"] -->|Port 5432 (Session Mode: DIRECT_URL)| PostgresDB
    end

    subgraph Asset_Tier ["Blob Storage & CDN"]
        API_Upload --> CloudinarySDK["Cloudinary API (Buffer Upload)"]
        CloudinarySDK --> CloudinaryCDN["Cloudinary Asset Storage & Edge CDN"]
    end
```

### High-Level Topology Walkthrough
1. **Edge Interception**: Every HTTP request hits `middleware.ts` running on the Vercel Edge Runtime. Unauthenticated attempts to access `/dsa`, `/dev`, `/history`, or `/admin` are redirected before touching serverless compute.
2. **Stateless Compute**: Next.js App Router handlers spin up on demand. No application state is held in Node.js server memory across instances, guaranteeing horizontal scaling.
3. **Decoupled Backend Services**: Route handlers isolate external calls. The contest submission flow writes strictly to Postgres via Prisma; live sessions communicate strictly with LiveKit; media uploads stream to Cloudinary; and code evaluations hit the AI Resilience Gateway.

---

## 2. Architectural Decisions & In-Depth Trade-Off Analysis

Every architectural decision in CodeSaarthi was evaluated against performance, financial sustainability, security risk, and engineering velocity. Below is the comprehensive trade-off matrix.

```mermaid
quadrantChart
    title Architectural Trade-Off Landscape: Cost vs. Complexity vs. Value
    x-axis Low Operational Overhead --> High Operational Overhead
    y-axis Low System Reliability / Scalability --> High System Reliability / Scalability
    quadrant-1 High Value / High Maintenance
    quadrant-2 High Value / Sustainable Architecture
    quadrant-3 Low Value / High Risk
    quadrant-4 Low Value / High Maintenance
    "LLM-as-a-Judge": [0.25, 0.88]
    "Docker Sandboxes (Piston/Judge0)": [0.85, 0.70]
    "Groq Multi-Key Pool + Gemini Fallback": [0.30, 0.94]
    "Single AI Vendor": [0.10, 0.40]
    "Supavisor Transaction Pooling": [0.20, 0.92]
    "Direct Postgres Connections": [0.15, 0.30]
    "LiveKit SFU": [0.35, 0.95]
    "P2P WebRTC Mesh": [0.12, 0.25]
    "Denormalized JSON Submissions": [0.22, 0.85]
    "Normalized Relational Rows": [0.75, 0.60]
```

### 2.1 Trade-Off 1: LLM-as-a-Judge vs. Isolated Docker/Piston Sandboxes

| Dimension | LLM-as-a-Judge (CodeSaarthi Approach) | Sandboxed Containers (Docker/Judge0/Piston) |
|---|---|---|
| **Security Surface** | **Zero host vulnerability**. Untrusted code is never compiled or executed natively. Immune to fork-bombs, memory leaks, and container escapes. | High vulnerability surface. Requires seccomp filters, strict cgroups, and network isolation to prevent sandbox escapes. |
| **Compute Overhead** | **Zero local CPU/RAM load**. Offloaded entirely to ultra-fast Groq LPUs (~200ms) or Gemini APIs. | High server footprint. Requires warm container pools, memory pre-allocation, and Linux kernel execution limits. |
| **Judging Accuracy** | Evaluates algorithmic approach, time/space complexity semantics, and logical correctness. Can occasionally hallucinate edge-case behavior. | Deterministic byte-for-byte output comparison against hidden stdin/stdout test suites. |
| **Multi-Language Support** | Instant out-of-the-box support for any programming language understood by LLMs without maintaining compilers. | Requires maintaining, compiling, and patching 11+ distinct language runtimes, SDKs, and sandboxes. |
| **Cost Profile** | $0 to fractions of a cent per prompt (leveraging round-robin free/tier key pools). | High fixed monthly server costs for persistent container compute clusters. |

> [!NOTE]  
> **Architectural Decision**: CodeSaarthi selected **LLM-as-a-Judge** with a conservative fail-safe scoring contract (defaulting to 0 upon timeout or malformed JSON). This completely eliminated infrastructure maintenance costs while enabling instant support for 11 programming languages.

---

### 2.2 Trade-Off 2: Multi-Key Groq LPU Key Pool + Gemini Fallback vs. Single AI Vendor

```mermaid
graph LR
    subgraph Single_Vendor ["Single Provider Architecture (Fragile)"]
        Req1[Client Request] --> Provider1[Single API Key]
        Provider1 -->|HTTP 429 Rate Limit| Outage1[Hard Platform Failure & Crash]
    end

    subgraph Resilient_Architecture ["CodeSaarthi AI Gateway (Fault-Tolerant)"]
        Req2[Client Request] --> Hash2[SHA-256 LRU Cache Check]
        Hash2 -->|Hit: 0ms| FastReturn[Immediate Output]
        Hash2 -->|Miss| RoundRobin[Atomic Round-Robin Selector]
        RoundRobin --> GroqKey1[Groq Key 1]
        RoundRobin --> GroqKey2[Groq Key 2]
        RoundRobin --> GroqKeyN[Groq Key N...]
        GroqKey1 -->|429 Rate Limit| GroqKey2
        GroqKey2 -->|All Groq Keys Exhausted / Timeout| GeminiCircuit[Google Gemini Circuit Breaker]
        GeminiCircuit --> Return200[Guaranteed 200 OK Delivery]
    end
```

- **Single Provider Failure**: If a platform relies exclusively on one Groq API key or Gemini API key, burst traffic triggers HTTP 429 Rate Limit quotas, causing immediate platform-wide judging and playground failure.
- **CodeSaarthi Strategy**:
  1. **In-Memory LRU Cache**: Hashes prompt and settings via SHA-256; repeated requests return in < 1ms with 0 tokens spent.
  2. **Multi-Key Pool (`GROQ_API_KEY_POOL`)**: Round-robins across multiple Groq keys atomically, multiplying effective TPM (Tokens Per Minute) and RPM (Requests Per Minute) quotas by $N$.
  3. **Automated Cross-Cloud Circuit Breaker**: If Groq returns 429 or times out past 9000ms, the request seamlessly fails over to Google Gemini (`gemini-2.5-flash-lite`).

---

### 2.3 Trade-Off 3: Supavisor Transaction-Mode Pooling vs. Direct Database Sockets

- **The Problem**: In serverless architectures (Next.js route handlers on Vercel), each incoming HTTP request can spin up an isolated Node.js container instance. If 1,000 users concurrently submit a contest, 1,000 independent functions attempt to open persistent TCP sockets to PostgreSQL. Physical PostgreSQL servers crash when connection counts exceed hardware limits (typically 50–100 connections).
- **The Solution**:
  - `DATABASE_URL` connects to **Supavisor on Port 6543** in **Transaction Pooling Mode**. Supavisor holds 5–15 physical database connections open and multiplexes thousands of incoming short-lived transactions across them. As soon as a Prisma query finishes, the socket is released back to the pool.
  - `DIRECT_URL` connects to **PostgreSQL on Port 5432** in **Session Mode**, reserved exclusively for Prisma migrations and schema engine synchronization commands (`prisma db push` / `prisma migrate`), which require transactional DDL locks not supported by poolers.

---

### 2.4 Trade-Off 4: Selective Forwarding Unit (SFU) vs. Peer-to-Peer (P2P) WebRTC Mesh

```mermaid
graph TD
    subgraph P2P_Mesh ["P2P Mesh Network (Unscalable: O(N^2) Complexity)"]
        U1((User 1)) <--> U2((User 2))
        U1 <--> U3((User 3))
        U1 <--> U4((User 4))
        U2 <--> U3
        U2 <--> U4
        U3 <--> U4
    end

    subgraph LiveKit_SFU ["LiveKit SFU Architecture (CodeSaarthi: O(N) Complexity)"]
        C1((User 1)) -->|1 Upload Stream| SFUHub[LiveKit Cloud SFU]
        C2((User 2)) -->|1 Upload Stream| SFUHub
        C3((User 3)) -->|1 Upload Stream| SFUHub
        C4((User 4)) -->|1 Upload Stream| SFUHub
        SFUHub -->|Forward Downlink| C1
        SFUHub -->|Forward Downlink| C2
        SFUHub -->|Forward Downlink| C3
        SFUHub -->|Forward Downlink| C4
    end
```

- **P2P Mesh Bottleneck**: In a pure WebRTC mesh, every participant must stream their webcam and audio track directly to every other participant. For $N$ participants, total network streams equals $N \times (N - 1)$. With just 10 participants, 90 media streams are circulating, immediately causing client bandwidth exhaustion, frame drops, and browser tab crashes.
- **LiveKit SFU Advantage**: Each candidate uploads **exactly one** video/audio stream to LiveKit Cloud. The SFU server forwards downlinks only to active subscribers, providing adaptive bitrate streaming (simulcast) and keeping client upload bandwidth strictly $O(1)$.

---

### 2.5 Trade-Off 5: Denormalized JSON Submissions vs. Normalized Relational Rows

```mermaid
erDiagram
    Denormalized_ContestAttempt {
        String id PK
        String userId FK
        String topic
        Int correct
        Int total
        Float accuracy
        String language
        Json submissions "Single JSON blob holding all answers"
    }
    
    Normalized_Attempt_Model {
        String id PK
        String userId FK
    }
    Normalized_Submission_Row {
        String id PK
        String attemptId FK
        String questionId
        String userCode
        Boolean isCorrect
        Int score
    }
    
    Normalized_Attempt_Model ||--|{ Normalized_Submission_Row : "1 to N relation"
```

- **Trade-Off Evaluation**:
  - Normalized schema requires $N$ database inserts per contest submission and complex SQL `JOIN` statements when rendering user history or global leaderboards.
  - CodeSaarthi stores `submissions` as an optimized `Json` column on `ContestAttempt`. The client workspace saves the entire contest attempt in a single atomic database `INSERT`. The `/history` and `/leaderboard` dashboards execute blazing-fast index scans without relational join overhead.

---

## 3. Core Subsystems & Execution Workflows

### 3.1 Edge Authentication & Route Guard Lifecycle
- **Primary Source File**: [`middleware.ts`](file:///c:/Users/DELL/codeify/middleware.ts)

```mermaid
sequenceDiagram
    autonumber
    actor Client as User Browser
    participant Edge as Edge Middleware (middleware.ts)
    participant Clerk as Clerk Edge Identity Provider
    participant Route as App Router Route Handler / Page

    Client->>Edge: HTTP GET /dsa or /sessions/room-101
    Edge->>Clerk: Validate __session cookie & JWT signature
    alt Path matches isPublicRoute (/, /home, /blogs, /welcome, /api/livekit/token)
        Clerk-->>Edge: Public Route Whitelisted
        Edge->>Route: Forward Request to App Router
    else Path is Protected & Valid Session
        Clerk-->>Edge: Session Claims Confirmed (userId, email, role)
        Edge->>Edge: Inject Auth Headers (x-clerk-auth-user)
        Edge->>Route: Forward Request with Authenticated Context
    else Path is Protected & Unauthenticated
        Clerk-->>Edge: No Valid Session
        Edge-->>Client: HTTP 302 Redirect -> /sign-in?redirect_url=...
    end
```

#### Detailed Execution Mechanics
1. **Edge Execution**: `middleware.ts` runs inside Vercel's Edge Runtime using V8 isolates with < 5ms startup latency.
2. **Centralized Security**: Rather than writing `if (!user) return 401;` inside 20+ different pages, route gating is maintained centrally via Clerk's `createRouteMatcher`.
3. **Role-Based Admin Protection**: Handlers for `/admin/sessions` and `/admin/blog` extract `currentUser().emailAddresses` to verify authorization against the administrative master address (`saurabhsingh100605@gmail.com`).

---

### 3.2 AI Resilience Gateway: Multi-Key Round-Robin & Fallback
- **Primary Source Files**:
  - [`app/lib/ai/provider.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/provider.ts)
  - [`app/lib/ai/service.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/service.ts)
  - [`app/lib/ai/cache.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/cache.ts)

```mermaid
flowchart TD
    ReqStart["Incoming AI Request: executeAIRequest(config)"] --> GenHash["Generate SHA-256 Hash:\nHash(systemPrompt + userPrompt + modelType)"]
    GenHash --> CheckCache{"LRU Cache Check\n(app/lib/ai/cache.ts)"}
    
    CheckCache -- "Cache HIT" --> ReturnCache["Return Cached JSON / Stream\nLatency: ~0.4ms | Tokens: 0"]
    
    CheckCache -- "Cache MISS" --> KeyRotation["Atomic Key Selection:\nkey = pool[groqKeyIndex++ % pool.length]"]
    KeyRotation --> InvokeGroq["Invoke Groq API (LLaMA-3 / Qwen 27B)\nTimeout: 9,000ms"]
    
    InvokeGroq --> GroqStatus{"Groq Response Status"}
    GroqStatus -- "200 OK" --> StripFences["Clean Code Fences (Strip ```json)"]
    
    GroqStatus -- "429 Rate Limit / Timeout" --> NextKey{"More Groq Keys in Pool?"}
    NextKey -- "Yes" --> KeyRotation
    NextKey -- "No (Pool Exhausted)" --> CircuitBreaker["Trigger Fallback Circuit:\nInvoke Google Gemini (gemini-2.5-flash-lite)"]
    
    CircuitBreaker --> GeminiStatus{"Gemini Response Status"}
    GeminiStatus -- "200 OK" --> StripFences
    GeminiStatus -- "Failure" --> ThrowFatal["Throw AIProviderError(500)"]
    
    StripFences --> ValidateZod{"Zod Schema Validation\n(ZodSchema.safeParse)"}
    ValidateZod -- "Schema Valid" --> WriteCache["Write to LRU Cache (TTL 10m)"]
    ValidateZod -- "Invalid JSON Keys" --> SelfHeal["Self-Healing Correction Prompt Retry"]
    SelfHeal --> StripFences
    WriteCache --> ReturnResponse["Return Strongly-Typed Result"]
```

---

### 3.3 Zero-Buffering Server-Sent Events (SSE) AI Streaming
- **Primary Source Files**:
  - [`app/lib/ai/stream.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/stream.ts)
  - [`app/lib/ai/client.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/client.ts)
  - [`app/api/gemini/route.ts`](file:///c:/Users/DELL/codeify/app/api/gemini/route.ts)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser (Monaco Editor)
    participant Route as Route Handler (/api/gemini)
    participant Provider as AI Provider (provider.ts)
    participant Groq as Groq LPU Engine
    participant Cache as LRU Cache

    User->>Route: POST /api/gemini { prompt, stream: true }
    Route->>Cache: Check SHA-256 cache
    alt Cache Hit
        Cache-->>Route: Cached Full String
        Route-->>User: Enqueue Cached Stream & Close (0ms TTFB)
    else Cache Miss
        Route->>Provider: executeAIStreamRequest(config)
        Provider->>Groq: Stream Completion { stream: true }
        Groq-->>Provider: Raw Token Stream (chunks)
        Provider-->>Route: Native Web ReadableStream<Uint8Array>
        Route-->>User: HTTP 200 OK (Content-Type: text/plain, chunked)
        loop Stream Token Accumulation
            Groq->>Route: Next Word / Token
            Route-->>User: Stream Byte Chunk
            User->>User: Incremental Markdown Render
        end
        Route->>Cache: Save Accumulated Full Output
    end
```

---

### 3.4 DSA Arena: Batched Evaluation & CP Judge Engine
- **Primary Source Files**:
  - [`app/api/dsa/evaluate-all/route.ts`](file:///c:/Users/DELL/codeify/app/api/dsa/evaluate-all/route.ts)
  - [`app/contestdsa/page.tsx`](file:///c:/Users/DELL/codeify/app/contestdsa/page.tsx)
  - [`app/components/ContestDsa.tsx`](file:///c:/Users/DELL/codeify/app/components/ContestDsa.tsx)

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Contest Participant
    participant UI as ContestDsa.tsx (Monaco Workspace)
    participant EvalAPI as Route: /api/dsa/evaluate-all
    participant AIService as AI Resilience Service
    participant SaveAPI as Route: /api/contest/save
    participant DB as Postgres (Prisma: ContestAttempt)

    Candidate->>UI: Solves 3 Problems & Clicks "Submit Contest"
    UI->>UI: Inspect Submissions (Strip Whitespace)
    UI->>EvalAPI: POST { questions, submissions, language }
    Note over EvalAPI: Step 1: Filter Empty Submissions.<br/>If all empty -> Return Score 0 (0 LLM Calls Spent)
    EvalAPI->>AIService: Formulate CP Judge Evaluation Prompt
    AIService-->>EvalAPI: Returns Strict JSON: { correct, total, accuracy }
    EvalAPI-->>UI: Deliver Verdict Modal { score, accuracy }
    UI->>SaveAPI: POST /api/contest/save { topic, correct, total, accuracy, submissions }
    SaveAPI->>DB: Prisma.contestAttempt.create()
    DB-->>SaveAPI: Record Saved (UUID Generated)
    SaveAPI-->>UI: Confirmation 200 OK
    UI->>Candidate: Redirect to /history (Visualized with Recharts)
```

---

### 3.5 Dev Arena: Socratic Mentorship Engine (Kautilya Saarthi)
- **Primary Source Files**:
  - [`app/api/dev/submit/route.ts`](file:///c:/Users/DELL/codeify/app/api/dev/submit/route.ts)
  - [`app/contestdev/page.tsx`](file:///c:/Users/DELL/codeify/app/contestdev/page.tsx)
  - [`app/components/ContestDev.tsx`](file:///c:/Users/DELL/codeify/app/components/ContestDev.tsx)

```mermaid
sequenceDiagram
    autonumber
    actor Engineer as Developer
    participant Client as ContestDev.tsx
    participant Route as /api/dev/submit
    participant AI as AIService (Kautilya Saarthi Prompt)

    Engineer->>Client: Writes React/Node.js Architecture Code
    Client->>Route: POST { task, code }
    Route->>Route: Validate minimum code length (length >= 5)
    Note over Route: Construct Mentor Persona Prompt:<br/>"You are Kautilya Saarthi, inspired by Chanakya.<br/>NEVER give working code. Guide intuition socratically."
    Route->>AI: executeAIRequest(prompt, responseFormat: 'json')
    AI-->>Route: JSON { verdict: "Accepted"|"Needs Improvement", score: 0|1, feedback }
    Route-->>Client: Deliver Mentor Feedback
    Client->>Engineer: Render Feedback Card with Markdown Syntax Highlighting
```

---

### 3.6 WebRTC SFU Live Cohort & Audio/Video Signaling
- **Primary Source Files**:
  - [`app/api/livekit/token/route.ts`](file:///c:/Users/DELL/codeify/app/api/livekit/token/route.ts)
  - [`app/sessions/[id]/room/page.tsx`](file:///c:/Users/DELL/codeify/app/sessions/%5Bid%5D/room/page.tsx)
  - [`app/components/VideoRoom.tsx`](file:///c:/Users/DELL/codeify/app/components/VideoRoom.tsx)

```mermaid
sequenceDiagram
    autonumber
    actor User as Mentorship Student
    participant RoomPage as /sessions/[id]/room
    participant TokenAPI as /api/livekit/token
    participant Clerk as Clerk Identity
    participant LiveKitCloud as LiveKit SFU Cloud

    User->>RoomPage: Joins /sessions/interview-room-42/room
    RoomPage->>TokenAPI: GET /api/livekit/token?room=interview-room-42
    TokenAPI->>Clerk: currentUser() / auth()
    alt Not Logged In
        TokenAPI-->>RoomPage: 401 Unauthorized
    else Logged In
        TokenAPI->>TokenAPI: AccessToken(apiKey, apiSecret, identity=userId)
        TokenAPI->>TokenAPI: Attach VideoGrant({ roomJoin: true, room: roomName, canPublish: true })
        TokenAPI->>TokenAPI: Sign JWT with HMAC-SHA256
        TokenAPI-->>RoomPage: 200 OK { token: "eyJhbGciOiJIUzI1Ni..." }
    end
    RoomPage->>LiveKitCloud: Connect WSS (wss://project.livekit.cloud) with JWT
    LiveKitCloud->>LiveKitCloud: Verify Cryptographic Signature & Grants
    LiveKitCloud-->>RoomPage: Establish WebRTC PeerConnection
    par Audio / Video Tracks
        RoomPage->>LiveKitCloud: Publish Camera & Screen Tracks
    and Downlink Forwarding
        LiveKitCloud->>RoomPage: Forward Mentor & Cohort Video Downlinks
    end
```

---

### 3.7 Multi-Language Browser Code Studio Engine
- **Primary Source Files**:
  - [`app/home/page.tsx`](file:///c:/Users/DELL/codeify/app/home/page.tsx)
  - [`app/components/Home.tsx`](file:///c:/Users/DELL/codeify/app/components/Home.tsx)
  - Supported: **JavaScript, Python, Java, C++, C, TypeScript, C#, Go, Rust, PHP, Bash**

```mermaid
flowchart TD
    UserSelect["User selects language: e.g., Rust / Python / C++"] --> LoadStarter["Load STARTER_CODES[language] Template"]
    LoadStarter --> MonacoInit["Initialize Monaco Editor (Client-Only dynamic import)"]
    MonacoInit --> UserEdit["User modifies logic / standard algorithms"]
    UserEdit --> ActionTrigger{"User clicks AI Action:\n[Explain / Optimize / Fix / Run Simulation]"}
    ActionTrigger --> AbortExisting["AbortController.abort() to cancel stale requests"]
    AbortExisting --> FetchAI["POST /api/gemini { prompt: CMD + code, stream: true }"]
    FetchAI --> StreamDecode["TextDecoder.decode() stream loop"]
    StreamDecode --> UIAppend["Append chunks to React State"]
    UIAppend --> SyntaxHighlighter["Prism SyntaxHighlighter (vscDarkPlus Theme)"]
```

---

### 3.8 Cloudinary Binary Media Processing Pipe
- **Primary Source Files**:
  - [`app/api/upload/route.ts`](file:///c:/Users/DELL/codeify/app/api/upload/route.ts)
  - [`app/admin/blog/new/page.tsx`](file:///c:/Users/DELL/codeify/app/admin/blog/new/page.tsx)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin Content Creator
    participant Editor as Admin Blog UI
    participant Route as /api/upload Route Handler
    participant Cloudinary as Cloudinary API & Storage
    participant DB as Postgres (Blog.imageUrl)

    Admin->>Editor: Uploads cover image (JPEG/PNG/WebP)
    Editor->>Route: POST multipart/form-data (Binary buffer)
    Route->>Route: Read buffer into memory
    Route->>Cloudinary: cloudinary.uploader.upload_stream({ folder: "codeify_blogs" })
    Cloudinary-->>Route: Returns Secure CDN URL (https://res.cloudinary.com/...)
    Route-->>Editor: Return { url: "https://..." }
    Editor->>DB: Save Blog Record with imageUrl reference
```

---

## 4. Database Architecture & Schema Design (Prisma + Supabase)

CodeSaarthi relies on a normalized schema managed by Prisma ORM against PostgreSQL on Supabase. Clerk is the single source of truth for user authentication; therefore, database tables store Clerk-issued string identifiers (`userId`, `authorEmail`, `hostEmail`) rather than storing password hashes or credentials.

```mermaid
erDiagram
    ContestAttempt {
        String id PK "UUID Primary Key"
        String userId FK "Clerk User Identity (Indexed)"
        String topic "Arrays, Dynamic Programming, Strings"
        Int correct "Number of Passed Questions"
        Int total "Total Contest Questions"
        Float accuracy "Percentage Accuracy (0.0 to 100.0)"
        String language "javascript, python, cpp, etc."
        String difficulty "Basic, Intermediate, Advanced"
        Json submissions "Raw code indexed by question ID"
        DateTime createdAt "Timestamp (B-Tree Indexed)"
        DateTime updatedAt "Timestamp"
    }

    Blog {
        String id PK "UUID Primary Key"
        String title "Article Headline"
        String content "Markdown Documentation Content"
        String_Array domains "Category Tags: [React, Architecture]"
        String source "Origin Source URL / Reference"
        String pattern "System Design Pattern Reference"
        String imageUrl "Cloudinary Hosted CDN Asset URL"
        String authorEmail "Clerk Author Email Reference"
        String slug UK "Human-Readable Unique URL Slug"
        DateTime createdAt "Timestamp (B-Tree Indexed)"
        DateTime updatedAt "Timestamp"
    }

    LiveSession {
        String id PK "UUID Primary Key"
        String title "Session Topic Headline"
        String description "Detailed Cohort Agenda"
        String roomName UK "LiveKit Unique SFU Room Identifier"
        DateTime scheduledAt "Scheduled Start (B-Tree Indexed)"
        Int duration "Duration in Minutes (Default: 60)"
        String status "scheduled | live | finished"
        String hostEmail "Clerk Host Email Reference"
        Int maxParticipants "Maximum Room Capacity (Default: 50)"
        DateTime createdAt "Timestamp"
        DateTime updatedAt "Timestamp"
    }
```

### 4.1 Schema Optimization & B-Tree Indexing Strategy

1. **`@@index([userId])` on `ContestAttempt`**: Optimizes the user dashboard at `/history`, allowing sub-millisecond retrieval of all past contest submissions for a logged-in user without sequential table scans.
2. **`@@index([createdAt])` on `ContestAttempt`**: Enables blazing-fast aggregation for the global `/leaderboard` page (`ORDER BY createdAt DESC LIMIT 50`), ensuring zero table locking during high write volumes.
3. **`@@index([scheduledAt])` on `LiveSession`**: Accelerates queries on the upcoming sessions page (`/sessions`), filtering active or upcoming cohorts without table thrashing.
4. **`slug @unique` on `Blog`**: Guarantees $O(1)$ indexed lookups for article pages at `/blogs/[slug]`.

### 4.2 Database Connection Pool Topology

```mermaid
flowchart TD
    subgraph NextJS_Functions ["Serverless Vercel Edge / Node.js Instances"]
        F1["Route Handler Instance 1"]
        F2["Route Handler Instance 2"]
        FN["Route Handler Instance N..."]
    end

    subgraph Global_Prisma_Singleton ["Singleton Guard (app/lib/prisma.ts)"]
        F1 --> PrismaSingleton["globalThis.prisma || new PrismaClient()"]
        F2 --> PrismaSingleton
        FN --> PrismaSingleton
    end

    subgraph Connection_Modes ["Supabase Dual-Port Connectivity"]
        PrismaSingleton -->|DATABASE_URL: Port 6543| SupavisorPooler["Supavisor Transaction Pooler\n(Multiplexes 10,000 requests -> 15 DB Sockets)"]
        CLI["Prisma CLI Migrations"] -->|DIRECT_URL: Port 5432| DirectPostgres["Direct PostgreSQL Socket\n(Required for DDL migrations & Locks)"]
    end

    SupavisorPooler --> PhysicalDB[("PostgreSQL Remote Physical Database")]
    DirectPostgres --> PhysicalDB
```

---

## 5. Complete File-by-File Technical Directory Breakdown

Below is the complete inventory of files in the CodeSaarthi repository, detailing their subsystem, role, and critical dependencies.

### 5.1 Root Configuration & Infrastructure Files

| File | Subsystem | Engineering Responsibility & Technical Notes | Key Imports / Tools |
|---|---|---|---|
| [`middleware.ts`](file:///c:/Users/DELL/codeify/middleware.ts) | Edge Security | Intercepts all incoming HTTP traffic on Vercel Edge Runtime. Defines public route matchers and enforces Clerk session protection. | `@clerk/nextjs/server`, `createRouteMatcher` |
| [`package.json`](file:///c:/Users/DELL/codeify/package.json) | Package Manifest | Declares project dependencies (Next 16, React 19, Prisma, LiveKit, GSAP, Monaco, Recharts). | NPM / Node.js |
| [`next.config.ts`](file:///c:/Users/DELL/codeify/next.config.ts) | Next.js Engine | Configures Next.js compiler settings, image domains (Cloudinary, Clerk, Unsplash), and experimental flags. | `NextConfig` |
| [`tsconfig.json`](file:///c:/Users/DELL/codeify/tsconfig.json) | TypeScript Config | Sets strict TypeScript compiler flags, path aliases (`@/*` pointing to `./app/*`). | TypeScript |
| [`eslint.config.mjs`](file:///c:/Users/DELL/codeify/eslint.config.mjs) | Code Linting | Flat config ESLint rules for Next.js core web vitals and React 19 compatibility. | ESLint |
| [`postcss.config.mjs`](file:///c:/Users/DELL/codeify/postcss.config.mjs) | CSS Processor | Configures PostCSS pipeline with `@tailwindcss/postcss` for TailwindCSS v4. | PostCSS, TailwindCSS |
| [`components.json`](file:///c:/Users/DELL/codeify/components.json) | UI Configuration | UI component mapping and alias rules for Radix UI primitives. | shadcn / Radix UI |
| [`.env.example`](file:///c:/Users/DELL/codeify/.env.example) | Environment Template | Master blueprint of all required environment secrets (Clerk, Supabase, Groq, Gemini, LiveKit, Cloudinary). | Dotenv |

---

### 5.2 Persistence & Database Layer ([`prisma/`](file:///c:/Users/DELL/codeify/prisma))

| File | Subsystem | Engineering Responsibility & Technical Notes | Key Imports / Tools |
|---|---|---|---|
| [`prisma/schema.prisma`](file:///c:/Users/DELL/codeify/prisma/schema.prisma) | Data Definition | Declares PostgreSQL schema, connection pooling endpoints (`DATABASE_URL` / `DIRECT_URL`), and models (`ContestAttempt`, `Blog`, `LiveSession`). | Prisma Schema Engine |
| [`app/lib/prisma.ts`](file:///c:/Users/DELL/codeify/app/lib/prisma.ts) | Persistence Singleton | Prevents socket exhaustion during development Hot Module Replacement (HMR) by attaching `PrismaClient` to `globalThis`. | `@prisma/client`, `globalThis` |

---

### 5.3 Core AI Resilience Engine ([`app/lib/ai/`](file:///c:/Users/DELL/codeify/app/lib/ai))

| File | Subsystem | Engineering Responsibility & Technical Notes | Key Imports / Tools |
|---|---|---|---|
| [`app/lib/ai/provider.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/provider.ts) | Multi-Model Provider | Core AI engine: Manages `GROQ_API_KEY_POOL` round-robin rotation, Groq LPU execution, error catching, and automated Google Gemini fallback. | `groq-sdk`, `@google/generative-ai` |
| [`app/lib/ai/service.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/service.ts) | AI Logic & Prompts | Formulates strict system/user prompts for DSA judging and Dev arena. Sanitizes markdown fences and runs Zod validation. | `zod`, `crypto` |
| [`app/lib/ai/cache.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/cache.ts) | High-Speed LRU Cache | In-memory doubly-linked LRU cache with SHA-256 prompt hashing and TTL expiration (~0.4ms cache hits). | Node.js `crypto` |
| [`app/lib/ai/stream.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/stream.ts) | Stream Transformation | Converts raw async token streams from Groq/Gemini into browser-compliant Server-Sent Events (SSE) readable streams. | Web `ReadableStream`, `TextEncoder` |
| [`app/lib/ai/client.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/client.ts) | Stream Consumer | Client-side utility for decoding streamed byte chunks and managing incremental Markdown updates. | Streams API, `TextDecoder` |
| [`app/lib/ai/types.ts`](file:///c:/Users/DELL/codeify/app/lib/ai/types.ts) | Type Definitions | TypeScript interfaces for AI payloads, judging results, cache entries, and error classes. | TypeScript |

---

### 5.4 Utility Libraries ([`app/lib/`](file:///c:/Users/DELL/codeify/app/lib))

| File | Subsystem | Engineering Responsibility & Technical Notes | Key Imports / Tools |
|---|---|---|---|
| [`app/lib/motion.ts`](file:///c:/Users/DELL/codeify/app/lib/motion.ts) | Animation System | Framer Motion reusable animation variants (fade-in, staggered slide-up, card hover effects). | `framer-motion` |
| [`app/lib/questionBank.ts`](file:///c:/Users/DELL/codeify/app/lib/questionBank.ts) | Algorithm Bank | Curated static competitive programming problem statements across difficulty tiers. | TypeScript |
| [`app/lib/questionBank2.ts`](file:///c:/Users/DELL/codeify/app/lib/questionBank2.ts) | Dev Challenge Bank | Full-stack, API, and frontend challenges for the Dev Arena. | TypeScript |
| [`app/lib/utils.ts`](file:///c:/Users/DELL/codeify/app/lib/utils.ts) | Class Utility | Classname merger merging Tailwind classes without conflicts. | `clsx`, `tailwind-merge` |

---

### 5.5 Serverless API Route Handlers ([`app/api/`](file:///c:/Users/DELL/codeify/app/api))

| File | Subsystem | Engineering Responsibility & Technical Notes |
|---|---|---|
| [`app/api/gemini/route.ts`](file:///c:/Users/DELL/codeify/app/api/gemini/route.ts) | Universal AI Studio | Powers the interactive multi-language playground with zero-buffering SSE streaming and LRU cache checks. |
| [`app/api/dsa/evaluate-all/route.ts`](file:///c:/Users/DELL/codeify/app/api/dsa/evaluate-all/route.ts) | DSA Judge Engine | Batches all submitted contest questions into a single judge prompt; filters out empty answers locally to conserve tokens. |
| [`app/api/dsa/generate/route.ts`](file:///c:/Users/DELL/codeify/app/api/dsa/generate/route.ts) | Problem Generator | Generates dynamic, algorithmic challenges on demand based on requested category and difficulty. |
| [`app/api/dsa/simulate/route.ts`](file:///c:/Users/DELL/codeify/app/api/dsa/simulate/route.ts) | Code Simulator | Simulates code execution step-by-step with state tracing and output prediction. |
| [`app/api/dsa/mentor-explanation/route.ts`](file:///c:/Users/DELL/codeify/app/api/dsa/mentor-explanation/route.ts) | Socratic DSA Mentor | Generates conceptual breakdowns and hints for difficult algorithmic problems. |
| [`app/api/dev/submit/route.ts`](file:///c:/Users/DELL/codeify/app/api/dev/submit/route.ts) | Dev Arena Evaluator | Evaluates architecture code submissions through the Kautilya Saarthi persona. |
| [`app/api/dev/generate/route.ts`](file:///c:/Users/DELL/codeify/app/api/dev/generate/route.ts) | Dev Brief Generator | Creates system design and full-stack challenges with specific constraints. |
| [`app/api/contest/save/route.ts`](file:///c:/Users/DELL/codeify/app/api/contest/save/route.ts) | Contest Persistence | Writes completed `ContestAttempt` records to Supabase PostgreSQL using Prisma. |
| [`app/api/leaderboard/route.ts`](file:///c:/Users/DELL/codeify/app/api/leaderboard/route.ts) | Leaderboard Aggregator | Aggregates user attempts, calculates global rankings, and groups accuracy scores by `userId`. |
| [`app/api/history/route.ts`](file:///c:/Users/DELL/codeify/app/api/history/route.ts) | User History Fetcher | Retrieves all past contest attempts for the authenticated Clerk user. |
| [`app/api/livekit/token/route.ts`](file:///c:/Users/DELL/codeify/app/api/livekit/token/route.ts) | WebRTC Token Service | Validates user session and mints HMAC-SHA256 signed JWTs with LiveKit video grants. |
| [`app/api/blogs/route.ts`](file:///c:/Users/DELL/codeify/app/api/blogs/route.ts) | Blog Management | Handles CRUD operations for technical articles (ISR cached with 60s revalidation). |
| [`app/api/sessions/route.ts`](file:///c:/Users/DELL/codeify/app/api/sessions/route.ts) | Cohort Scheduler | Creates and queries scheduled live audio/video mentorship sessions. |
| [`app/api/upload/route.ts`](file:///c:/Users/DELL/codeify/app/api/upload/route.ts) | Asset Upload Pipe | Ingests binary image buffers and uploads directly to Cloudinary CDN. |

---

### 5.6 Pages & Routing Architecture ([`app/`](file:///c:/Users/DELL/codeify/app))

| Directory / File | Subsystem | Responsibility & User Experience Flow |
|---|---|---|
| [`app/page.tsx`](file:///c:/Users/DELL/codeify/app/page.tsx) | Landing Page | High-conversion entry point; orchestrates GSAP scroll-triggered hero animations, feature showcases, and developer portfolio card. |
| [`app/layout.tsx`](file:///c:/Users/DELL/codeify/app/layout.tsx) | Root Layout | Top-level HTML shell; wraps the entire application in Clerk's `ClerkProvider` and injects global dark-mode styles. |
| [`app/globals.css`](file:///c:/Users/DELL/codeify/app/globals.css) | Global Design Tokens | Obsidian dark color scheme, hardware-accelerated glassmorphism utilities, and typography definitions in TailwindCSS v4. |
| [`app/home/page.tsx`](file:///c:/Users/DELL/codeify/app/home/page.tsx) | Universal Playground | 11-Language online code studio with Monaco Editor, standard I/O console, and instantaneous AI review actions. |
| [`app/welcome/page.tsx`](file:///c:/Users/DELL/codeify/app/welcome/page.tsx) | Track Onboarding | Interactive onboarding screen guiding users to select between the DSA Track, Dev Arena, or Live Cohorts. |
| [`app/dsa/page.tsx`](file:///c:/Users/DELL/codeify/app/dsa/page.tsx) | DSA Configuration | Configures algorithmic topics (Arrays, DP, Graphs) and launches timed contests. |
| [`app/contestdsa/page.tsx`](file:///c:/Users/DELL/codeify/app/contestdsa/page.tsx) | DSA Contest Arena | Full-screen competitive programming workspace with live timers, test execution, and Monaco editor. |
| [`app/dev/page.tsx`](file:///c:/Users/DELL/codeify/app/dev/page.tsx) | Dev Configuration | Configures open-ended web, app, and API system design challenges. |
| [`app/contestdev/page.tsx`](file:///c:/Users/DELL/codeify/app/contestdev/page.tsx) | Dev Contest Arena | Architecture coding workspace evaluated by Kautilya Saarthi. |
| [`app/sessions/page.tsx`](file:///c:/Users/DELL/codeify/app/sessions/page.tsx) | Cohorts Directory | Lists scheduled, live, and past interactive mentorship video rooms. |
| [`app/sessions/[id]/room/page.tsx`](file:///c:/Users/DELL/codeify/app/sessions/%5Bid%5D/room/page.tsx) | Live Video Studio | WebRTC video room powered by LiveKit components with screen sharing, mic/cam controls, and participant grids. |
| [`app/blogs/page.tsx`](file:///c:/Users/DELL/codeify/app/blogs/page.tsx) | Articles Directory | Displays technical system design and coding blogs with search and category filtering (ISR). |
| [`app/blogs/[slug]/page.tsx`](file:///c:/Users/DELL/codeify/app/blogs/%5Bslug%5D/page.tsx) | Article Reader | Markdown blog reader with syntax-highlighted code snippets and social sharing. |
| [`app/leaderboard/page.tsx`](file:///c:/Users/DELL/codeify/app/leaderboard/page.tsx) | Global Rankings | Ranked leaderboard displaying scores, solved counts, and user accuracy percentiles. |
| [`app/history/page.tsx`](file:///c:/Users/DELL/codeify/app/history/page.tsx) | Mission Logs | Recharts-powered analytics dashboard showing score trajectories and submission logs. |
| [`app/admin/page.tsx`](file:///c:/Users/DELL/codeify/app/admin/page.tsx) | Admin Portal | Administrative hub for scheduling live sessions and authoring technical blog posts. |
| [`app/sign-in/[[...sign-in]]/page.tsx`](file:///c:/Users/DELL/codeify/app/sign-in/%5B%5B...sign-in%5D%5D/page.tsx) | Authentication | Embedded Clerk authentication modal for user sign-in. |
| [`app/sign-up/[[...sign-up]]/page.tsx`](file:///c:/Users/DELL/codeify/app/sign-up/%5B%5B...sign-up%5D%5D/page.tsx) | Registration | Embedded Clerk registration modal for new developer onboarding. |

---

### 5.7 UI Components ([`app/components/`](file:///c:/Users/DELL/codeify/app/components))

| Component | Responsibility & Implementation |
|---|---|
| [`Home.tsx`](file:///c:/Users/DELL/codeify/app/components/Home.tsx) | Core playground component: Handles 11 language starter templates, Monaco editor state, AI command dispatch, and streaming Markdown output. |
| [`Navbar.tsx`](file:///c:/Users/DELL/codeify/app/components/Navbar.tsx) | Glassmorphic global navigation bar with Clerk user profile buttons, mobile hamburger menu, and admin link injection. |
| [`ContestDsa.tsx`](file:///c:/Users/DELL/codeify/app/components/ContestDsa.tsx) | DSA contest engine: Manages question pagination, user code state per problem, contest countdown timer, and submission modal. |
| [`ContestDev.tsx`](file:///c:/Users/DELL/codeify/app/components/ContestDev.tsx) | Dev arena engine: Manages architecture challenge code input and renders Kautilya Saarthi socratic critiques. |
| [`VideoRoom.tsx`](file:///c:/Users/DELL/codeify/app/components/VideoRoom.tsx) | LiveKit video conferencing wrapper with audio/video controls, participant tiles, and screen sharing. |
| [`VideoRoomWrapper.tsx`](file:///c:/Users/DELL/codeify/app/components/VideoRoomWrapper.tsx) | Dynamic wrapper ensuring `VideoRoom.tsx` is loaded strictly on the client side (`ssr: false`). |
| [`HistoryVisualizations.tsx`](file:///c:/Users/DELL/codeify/app/components/HistoryVisualizations.tsx) | Interactive charts using Recharts: Renders accuracy bar charts and contest performance graphs. |
| [`LeaderboardList.tsx`](file:///c:/Users/DELL/codeify/app/components/LeaderboardList.tsx) | Ranked list displaying user medals, accuracy badges, and submission volumes. |
| [`MeetDeveloperSection.tsx`](file:///c:/Users/DELL/codeify/app/components/MeetDeveloperSection.tsx) | Glassmorphic developer showcase card presenting engineering philosophies, certifications, and links. |
| [`PlaygroundPreviewSection.tsx`](file:///c:/Users/DELL/codeify/app/components/PlaygroundPreviewSection.tsx) | Interactive landing page preview of the coding playground with animated syntax-highlighted code. |
| [`PricingSection.tsx`](file:///c:/Users/DELL/codeify/app/components/PricingSection.tsx) | Tiered feature presentation showcasing Free Tier and Pro Accelerator capabilities. |
| [`TerminalMission.tsx`](file:///c:/Users/DELL/codeify/app/components/TerminalMission.tsx) | Interactive retro CRT terminal emulator demonstrating platform features and mission briefings. |

---

## 6. Component Hierarchy & Client State Transition Machine

### 6.1 Contest Workspace Component Tree

```mermaid
graph TD
    RootLayout["RootLayout (app/layout.tsx)\n[ClerkProvider, Dark Theme]"] --> ContestPage["ContestDSAPage (app/contestdsa/page.tsx)"]
    
    ContestPage --> Navbar["Navbar.tsx (Session Context & User Profile)"]
    ContestPage --> ContestContainer["ContestDsa.tsx (Core State Container)"]
    
    subgraph Workspace_Layout ["Interactive Dual-Pane Workspace"]
        ContestContainer --> LeftPane["Problem Statement Pane\n[Topic, Difficulty, Test Constraints]"]
        ContestContainer --> RightPane["Monaco Editor Container\n[dynamic ssr:false, Language Config]"]
        ContestContainer --> TimerHeader["Contest Timer Component\n[Interval Countdown & Auto-Submit]"]
        ContestContainer --> QuestionNav["Question Tabs Selector\n[Q1, Q2, Q3 State Switching]"]
    end
    
    subgraph Submission_Pipeline ["Verdict & Results Modal"]
        ContestContainer --> SubmitBtn["Submit Contest Action"]
        SubmitBtn -->|Trigger POST| EvalAPI["/api/dsa/evaluate-all"]
        EvalAPI --> ResultModal["Verdict Modal\n[Score, Accuracy %, Pass/Fail]"]
        ResultModal --> SaveAction["POST /api/contest/save"]
        SaveAction --> RedirectHistory["router.push('/history')"]
    end
```

### 6.2 Client State Transition Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Mount Workspace
    Idle --> Loading: Fetch Questions (questionBank or AI Generate)
    Loading --> InProgress: Questions Loaded & Timer Starts
    
    state InProgress {
        [*] --> EditingCode
        EditingCode --> SwitchingQuestion: Select Tab (Q1 -> Q2)
        SwitchingQuestion --> EditingCode: Load Saved Code for Tab
        EditingCode --> LocalSyntaxCheck: Monaco Worker Linting
    }
    
    InProgress --> Submitting: User clicks "Submit Contest" or Timer Reaches 00:00
    Submitting --> Evaluating: Filter Empty Answers & Send POST /api/dsa/evaluate-all
    
    Evaluating --> EvaluationSuccess: 200 OK Verdict Received
    Evaluating --> EvaluationError: Timeout / 500 AI Error
    
    EvaluationError --> InProgress: Display Warning Toast & Allow Manual Retry
    
    EvaluationSuccess --> SavingAttempt: POST /api/contest/save (Prisma DB Write)
    SavingAttempt --> Complete: Record Persisted in Supabase
    Complete --> [*]: Redirect to /history (Mission Logs)
```

---

## 7. Zero-Trust AI Sanitization & Resilience Engineering

Because Large Language Models are non-deterministic and can output invalid markdown fences or conversational apologies, CodeSaarthi implements a multi-stage **Zero-Trust Sanitization Pipeline** to guarantee that malformed AI outputs never crash the user interface.

```mermaid
flowchart LR
    RawOutput["Raw Model Output (String)"] --> Step1["Regex Code-Fence Stripping:\n.replace(/```json/g, '').replace(/```/g, '')"]
    Step1 --> Step2["JSON.parse() Safe Deserialization"]
    Step2 --> Step3{"Zod Schema Validation:\nSchema.safeParse(parsed)"}
    
    Step3 -- "Valid" --> Step4["Store in Cache & Return Strongly-Typed Object"]
    Step3 -- "Invalid / Hallucination" --> Step5["Reflection Correction Prompt:\n'Reformat into exact JSON schema'"]
    Step5 --> Step1
    
    Step2 -- "JSON Syntax Error" --> FallbackScore["Trigger Fail-Safe:\nReturn score: 0, verdict: 'Evaluation Failed'"]
```

### Self-Healing & Resilience Mechanics
1. **Empty Submission Short-Circuit**: If a candidate leaves all problems blank, `/api/dsa/evaluate-all` immediately returns a score of 0 without dispatching requests to Groq or Gemini. This conserves API quota and prevents models from hallucinating correct verdicts on empty submissions.
2. **Conservative Fail-Safe Scoring**: If a model timeout occurs (exceeding 9000ms) or returns an unparseable response, the system defaults to a `0` score accompanied by an explanatory message. This ensures the platform fails safely and predictably.

---

## 8. Performance, Caching & Optimization Hierarchy

CodeSaarthi utilizes a 4-tier performance architecture to maintain high responsiveness across global regions:

```mermaid
graph TD
    subgraph Tier1 ["Tier 1: Edge CDN & Static Regeneration"]
        T1_ISR["ISR (revalidate = 60s)\nServed from Vercel Edge for /blogs and /leaderboard"]
    end

    subgraph Tier2 ["Tier 2: In-Memory SHA-256 LRU Cache"]
        T2_LRU["AICache (app/lib/ai/cache.ts)\nCache hits return in < 1ms with 0 tokens consumed"]
    end

    subgraph Tier3 ["Tier 3: Browser Client Dynamic Bundling"]
        T3_Dynamic["Dynamic Imports (ssr: false)\nMonaco Editor & LiveKit SFU loaded only on client"]
    end

    subgraph Tier4 ["Tier 4: Connection Pool Multiplexing"]
        T4_Supavisor["Supavisor Transaction Pooler (:6543)\nMultiplexes 1000s of serverless requests across 15 DB connections"]
    end

    Tier1 --> Tier2 --> Tier3 --> Tier4
```

1. **Incremental Static Regeneration (ISR)**: The `/blogs` and `/leaderboard` pages specify `export const revalidate = 60;`. Edge caches serve pre-rendered HTML to millions of visitors, re-evaluating database rows at most once per minute.
2. **Zero-SSR Dynamic Imports**: Heavily stateful browser libraries (`@monaco-editor/react`, `@livekit/components-react`) are imported with `dynamic(() => import(...), { ssr: false })`. This reduces initial server bundle size and avoids hydration mismatches with browser APIs (`window`, `navigator.mediaDevices`).
3. **GPU-Accelerated 60 FPS Styling**: UI components leverage `backdrop-filter: blur()`, `will-change: transform`, and hardware-accelerated transforms to offload animations directly to the GPU compositor thread.

---

## 9. Security Posture & Secret Confinement

CodeSaarthi strictly follows the principle of least privilege regarding secret handling and database access:

```mermaid
graph LR
    subgraph Public_Client_Bundle ["Public Client Bundle (Browser)"]
        ClientVar1["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"]
        ClientVar2["NEXT_PUBLIC_CLERK_SIGN_IN_URL"]
        ClientVar3["NEXT_PUBLIC_LIVEKIT_URL (WSS Endpoint)"]
    end

    subgraph Guarded_Serverless_Boundary ["Guarded Serverless Boundary (Never Exposed)"]
        ServerSec1["CLERK_SECRET_KEY"]
        ServerSec2["DATABASE_URL & DIRECT_URL"]
        ServerSec3["GROQ_API_KEY & GROQ_API_KEY_POOL"]
        ServerSec4["GEMINI_API_KEY"]
        ServerSec5["LIVEKIT_API_KEY & LIVEKIT_API_SECRET"]
        ServerSec6["CLOUDINARY_API_SECRET"]
    end

    Public_Client_Bundle -.->|HTTP / JWT Request| Guarded_Serverless_Boundary
```

* **No Secret Leakage**: API secrets for Groq, Gemini, LiveKit, Cloudinary, and PostgreSQL are referenced exclusively inside server-side route handlers. None are prefixed with `NEXT_PUBLIC_`.
* **Short-Lived Signed JWTs**: LiveKit room tokens are generated on-demand with room-specific grants and short expiration windows, minimizing the impact of token interception.
* **SQL Injection Immunity**: Prisma ORM uses parameterized queries for all operations, preventing SQL injection vulnerabilities.

---

## 10. Local Environment Setup & Verification Guide

Follow these steps to configure and run CodeSaarthi locally.

### 10.1 Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm` or `pnpm`
- **Git**

### 10.2 Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DevSars24/codeify.git
   cd codeify
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Ensure your `.env` contains the required keys:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Database (Supabase PostgreSQL)
   DATABASE_URL="postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

   # AI Resilience Engine (Groq + Gemini)
   GROQ_API_KEY="gsk_..."
   GROQ_API_KEY_POOL="gsk_key1,gsk_key2,gsk_key3"
   GROQ_MODEL="qwen/qwen3.8-27b"
   GEMINI_API_KEY="AIzaSy..."
   GEMINI_MODEL="gemini-2.5-flash-lite"

   # Real-Time Video (LiveKit)
   NEXT_PUBLIC_LIVEKIT_URL="wss://[project].livekit.cloud"
   LIVEKIT_API_KEY="API..."
   LIVEKIT_API_SECRET="secret..."

   # Cloudinary Media Storage
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Synchronize Database Schema (Optional)**:
   ```bash
   npx prisma db push
   ```

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 11. Future Scaling Roadmap (v3.0)

As CodeSaarthi grows, the following architectural milestones are planned for the v3.0 release:

```mermaid
graph TD
    Current["CodeSaarthi v2.0 (Current)"] --> Phase1["Phase 1: Hybrid Evaluation Runner"]
    Current --> Phase2["Phase 2: Distributed Caching Tier"]
    Current --> Phase3["Phase 3: Real-Time Pair Programming"]

    Phase1 --> P1_Detail["Combine LLM semantic judging with WebAssembly (WASM)\nclient-side test verification for strict O(N) runtime checks"]
    Phase2 --> P2_Detail["Deploy Upstash Redis / Dragonfly cluster\nreplacing in-memory LRU cache across multi-region edge nodes"]
    Phase3 --> P3_Detail["Integrate Yjs CRDTs over LiveKit DataChannels\nenabling real-time collaborative code editing during live video sessions"]
```

1. **Hybrid Execution Engine**: Augment LLM-as-a-judge with client-side WebAssembly (WASM) micro-runners to verify strict Big-O execution constraints while preserving zero-container infrastructure.
2. **Distributed Redis Caching Tier**: Replace the single-instance in-memory LRU cache with Upstash Redis, enabling shared cache hits across all distributed Vercel serverless regions.
3. **Real-Time Collaborative Coding**: Leverage LiveKit DataChannels and Yjs CRDTs to allow simultaneous code collaboration between mentors and students directly inside the WebRTC video rooms.

---

*CodeSaarthi Documentation Architecture — Engineered for Performance, Resilience, and Clarity.*
