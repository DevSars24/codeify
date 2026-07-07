# 🚀 CodeSaarthi Setup & Run Guide

Welcome to the **CodeSaarthi** project. This document explains how the project is structured, the environment setup, and the exact steps to run and test the application at this stage.

---

## 🛠️ Prerequisites

To run this application, make sure you have the following installed on your machine:
- **Node.js**: Version 18.0.0 or higher
- **npm** (comes with Node) or **pnpm**

---

## ⚙️ Environment Configuration

The application requires several external integrations (Authentication, Database, AI, Media Storage, and Live Video Streaming). The `.env` file in the root directory contains the necessary credentials:

1. **Authentication (Clerk)**: Handles user login, registration, and session management.
2. **Database (Prisma & Supabase)**: Connects to a PostgreSQL database hosted on Supabase.
3. **AI Core (Google Gemini)**: Evaluates user submissions and generates dynamic coding questions.
4. **Media Storage (Cloudinary)**: Handles image uploads for the blog platform.
5. **Video Streaming (LiveKit)**: Powers real-time WebRTC audio/video rooms for live sessions.

> [!NOTE]
> All credentials and API keys are already configured in your local `.env` file. No additional service configuration is required to run the project.

---

## 🚀 How to Run the Project

Follow these steps to run the project on your machine:

### 1. Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
```

### 2. Generate Prisma Client
Generate the TypeScript database client from the Prisma schema:
```bash
npx prisma generate
```

### 3. Sync Database Schema (Optional)
If you make changes to the database models in `prisma/schema.prisma` or need to sync the tables on the remote Supabase database:
```bash
npx prisma db push
```

### 4. Start the Development Server
Run the Next.js development server:
```bash
npm run dev
```

The server will spin up:
- Next.js will run on **[http://localhost:3000](http://localhost:3000)** (or **3001** if port 3000 is occupied).
- The server will automatically watch for any changes you make to the code and hot-reload.

---

## 📂 Key Features & Routes to Explore

Once the server is running, you can explore the following modules in your browser:

### 1. 🎯 DSA & Web Development Contests
* **Route:** `/contest` (with query params, e.g., `?category=dsa&level=Basic` or `?category=web&level=Basic`)
* **Features:** A fully integrated **Monaco Editor** interface where you can write code, submit it, and receive instant feedback evaluated by Gemini AI.

### 2. 📺 WebRTC Live Sessions
* **Route:** `/sessions`
* **Features:** Join scheduled live audio/video streaming sessions. Admin users can initiate and host live rooms, while students can join in real-time.

### 3. 📊 Dashboard / Mission Logs
* **Route:** `/history`
* **Features:** Track your coding stats, view accuracy breakdowns, and look up details of your past contest submissions.

### 4. 🏆 Leaderboard
* **Route:** `/leaderboard`
* **Features:** Compare scores and see who is leading the rankings.

### 5. 📝 Blogs
* **Route:** `/blogs`
* **Features:** Read programming posts and technical guides.

---

## 🔐 Admin Dashboard Access

Certain administrative tasks, such as scheduling live sessions (`/admin/sessions`) and creating/editing blogs (`/admin/blog/new`), are restricted to the admin email address:
* **Admin Email:** `saurabhsingh100605@gmail.com`

When logged in with this email, the administrative options will automatically appear on the navbar and dashboard.
