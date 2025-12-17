"use client";

import { useState, type ReactNode } from "react";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import RingLoader from "react-spinners/RingLoader";

/* -------------------- LANGUAGE OPTIONS -------------------- */
const options = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "bash", label: "Bash" },
];

/* -------------------- SELECT STYLES -------------------- */
const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "#18181b",
    borderColor: "#3f3f46",
    color: "#fff",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#18181b",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#fff",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#27272a" : "#18181b",
    color: "#fff",
  }),
};

/* -------------------- MARKDOWN RENDERER -------------------- */
const MarkdownRenderer = ({ children }: { children: string }) => (
  <Markdown
    components={{
      code({
        inline,
        className,
        children,
      }: {
        inline?: boolean;
        className?: string;
        children: ReactNode;
      }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              borderRadius: "10px",
              padding: "16px",
              fontSize: "14px",
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-zinc-800 px-2 py-1 rounded text-sm">
            {children}
          </code>
        );
      },
    }}
  >
    {children}
  </Markdown>
);

/* -------------------- HOME -------------------- */
export default function Home() {
  const [language, setLanguage] = useState(options[0]);
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "response">("editor");

  async function runAICommand(cmd: string) {
    if (!code.trim()) {
      alert("Please enter code first");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${cmd.toUpperCase()} this ${language.value} code:\n\n${code}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResponse(data.text);
      setMobileView("response"); // auto switch on mobile
    } catch (err: any) {
      setResponse(`❌ ERROR: ${err.message}`);
      setMobileView("response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">

      {/* MOBILE TABS */}
      <div className="md:hidden flex border-b border-zinc-800 sticky top-0 bg-zinc-950 z-20">
        {["editor", "response"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileView(tab as any)}
            className={`flex-1 py-3 text-sm font-semibold ${
              mobileView === tab
                ? "border-b-2 border-purple-500 text-purple-400"
                : "text-zinc-400"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="p-4 flex flex-col gap-3 border-b border-zinc-800">
        <Select
          value={language}
          onChange={(val: { value: string; label: string } | null) =>
            val && setLanguage(val)
          }
          options={options}
          styles={customStyles}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2">
          {["review", "explain", "improve", "bugs", "fix"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runAICommand(cmd)}
              disabled={loading}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm disabled:opacity-50"
            >
              {cmd.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">

        {/* EDITOR */}
        <div
          className={`w-full md:w-1/2 border border-zinc-800 rounded overflow-hidden
          ${mobileView === "response" ? "hidden md:block" : "block"}`}
        >
          <Editor
            height="100%"
            theme="vs-dark"
            language={language.value}
            value={code}
            onChange={(val: string | undefined) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* RESPONSE */}
        <div
          className={`w-full md:w-1/2 border border-zinc-800 rounded flex flex-col overflow-hidden
          ${mobileView === "editor" ? "hidden md:flex" : "flex"}`}
        >
          <div className="px-4 py-3 border-b border-zinc-800 font-semibold">
            AI Response
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <RingLoader color="#a855f7" size={60} />
              </div>
            ) : (
              <MarkdownRenderer>{response}</MarkdownRenderer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
