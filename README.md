# Frontend Project - React + Vite + Tailwind + AI Code Reviewer

<pre> ```bash frontend/ ├── node_modules/ # Project dependencies ├── public/ # Static assets (e.g., favicon, images) ├── src/ # Source code │ ├── components/ # Reusable React components │ │ └── Navbar.jsx # Navigation bar with dark mode toggle │ ├── App.css # Custom styles for the main app │ ├── App.jsx # Main app component with editor and AI response │ ├── index.css # Global styles (Tailwind CSS) │ └── main.jsx # Entry point for React app ├── .gitignore # Files and directories to ignore in Git ├── eslint.config.js # ESLint configuration for code linting ├── index.html # HTML entry point ├── package-lock.json # Dependency lock file ├── package.json # Project metadata and scripts ├── README.md # Project documentation (this file) └── vite.config.js # Vite configuration ``` </pre>
## Overview

This project is a React-based frontend application built using Vite as the build tool. It features:

- **React 18** with functional components and hooks
- **Tailwind CSS** for styling and responsive UI
- **Monaco Editor** for code editing
- **React Select** for language dropdown
- **AI Integration** with GoogleGenAI for code reviewing, explaining, improving, and fixing
- **Markdown rendering** with syntax highlighting for AI responses
- **Loading spinner** during AI API calls
- **Dark mode toggle** support in UI

---

## Project Structure

- `src/components/` - Reusable UI components (e.g. Navbar)
- `src/App.jsx` - Main app component with editor, AI interaction, and response view
- `src/main.jsx` - React app entry point
- `src/App.css` and `src/index.css` - Styling files
- `public/` - Static assets
- `package.json` - Project dependencies and scripts
- `vite.config.js` - Vite configuration

---

## Installation & Setup

1. Clone the repo and navigate to the frontend directory:

   ```bash
   cd frontend

✍️ Author
Saurabh Singh Rajput
2nd Year, IIIT Bhagalpur
Self-taught programmer | Code-curious | Believer in code readability | Strives for the best

"When something is important enough, you do it even if the odds are not in your favor." – Elon Musk
