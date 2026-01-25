# 🚀 CodeSaarthi

**Your Ultimate Coding Companion** — Master DSA, Practice Coding, and Learn with Live Sessions

Built with ❤️ by **Saurabh Singh Rajput**

---

## ✨ Features

### 🎯 DSA & Development Contests
Practice coding problems with an integrated **Monaco Editor** (the same editor used in VS Code). Features include:
- **Topic-based question banks** — Arrays, Trees, Graphs, DP & more
- **Difficulty levels** — Easy, Medium, Hard
- **Multiple languages** — Python, C++, JavaScript
- **AI-powered evaluation** — Get instant feedback on your solutions using Gemini AI
- **Code submissions saved** — Track your progress over time

### 🤖 AI-Powered Responses
Integrated with **Google Gemini AI** for:
- Intelligent code evaluation
- Generating contextual DSA questions
- Providing hints and explanations

### 📺 Live Sessions (WebRTC)
Real-time video sessions using **LiveKit**:
- **Admin scheduling** — Schedule upcoming live sessions
- **One-click Go Live** — Start streaming instantly
- **Student participation** — Join live video rooms with real-time interaction
- **Video conferencing** — Full audio/video with controls

### 📊 Personalized Dashboard (Mission Logs)
Track your coding journey with:
- **Attempt history** — View all your past contests
- **Accuracy metrics** — Easy/Medium/Hard performance breakdown
- **Detailed submissions** — Review your code for each problem
- **Leaderboard** — Compete with other coders

### 📝 Blogs & Knowledge Base
Curated technical content:
- **Rich Markdown editor** — Monaco Editor with live preview
- **Syntax highlighting** — Beautiful code blocks with Prism.js
- **Image uploads** — Cloudinary integration
- **Search & filter** — Find articles by topic, source, or pattern
- **Admin-only publishing** — Content managed by Saurabh Singh Rajput

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Auth** | Clerk |
| **Database** | PostgreSQL (Supabase) with Prisma ORM |
| **AI** | Google Gemini API |
| **Code Editor** | Monaco Editor |
| **Video** | LiveKit (WebRTC) |
| **Media** | Cloudinary |
| **Charts** | Recharts |

---

## 📁 Project Structure

```
codeify/
├── app/
│   ├── api/                    # API Routes
│   │   ├── blogs/              # Blog CRUD
│   │   ├── contest/            # Save contest attempts
│   │   ├── dsa/                # DSA questions & evaluation
│   │   ├── livekit/            # LiveKit token generation
│   │   ├── sessions/           # Live session management
│   │   └── leaderboard/        # Leaderboard data
│   ├── admin/                  # Admin pages
│   │   ├── blog/               # Blog management
│   │   └── sessions/           # Session scheduling
│   ├── blogs/                  # Public blog pages
│   ├── sessions/               # Live sessions pages
│   ├── history/                # Mission logs dashboard
│   ├── leaderboard/            # Leaderboard page
│   └── components/             # Reusable components
│       ├── ContestDsa.tsx      # DSA contest interface
│       ├── ContestDev.tsx      # Dev contest interface
│       ├── VideoRoom.tsx       # LiveKit video room
│       ├── Navbar.tsx          # Navigation
│       └── ...
├── prisma/
│   └── schema.prisma           # Database schema
└── public/                     # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL database (Supabase recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevSars24/codeify.git
   cd codeify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret

   # Database
   DATABASE_URL="postgresql://..."

   # Gemini AI
   GEMINI_API_KEY=your_gemini_key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud

   # LiveKit
   LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_key
   LIVEKIT_API_SECRET=your_secret
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
   ```

4. **Push database schema**
   ```bash
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Screenshots

| Feature | Description |
|---------|-------------|
| **Home** | Landing page with features overview |
| **DSA Contest** | Monaco editor with problem statement |
| **Mission Logs** | Personal dashboard with stats |
| **Live Sessions** | WebRTC video conferencing |
| **Blogs** | Technical articles with syntax highlighting |

---

## 🔐 Admin Access

Admin features (blog creation, session scheduling) are restricted to:
- **Email**: `saurabhsingh100605@gmail.com`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Saurabh Singh Rajput**

- GitHub: [@DevSars24](https://github.com/DevSars24)
- Email: saurabhsingh100605@gmail.com

---

<p align="center">
  <b>Happy Coding! 🎉</b>
</p>

