# Frontend Project - React + Vite + Tailwind + AI Code Reviewer

frontend/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js

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
