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
};

/* -------------------- MARKDOWN -------------------- */
const MarkdownRenderer = ({ children }: { children: string }) => (
  <Markdown
    components={{
      code({ inline, className, children }: any) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{ borderRadius: 10, padding: 16 }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className="bg-zinc-800 px-2 py-1 rounded">
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
  const [mobileView, setMobileView] =
    useState<"editor" | "response">("editor");

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
      if (!res.ok) throw new Error(data.error);

      setResponse(data.text);
      setMobileView("response");
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
      <div className="md:hidden flex border-b border-zinc-800 bg-zinc-950">
        {["editor", "response"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileView(tab as any)}
            className={`flex-1 py-3 font-semibold ${
              mobileView === tab
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-zinc-400"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="p-4 border-b border-zinc-800">
        <Select
          value={language}
          onChange={(v: { value: string; label: string } | null) =>
            v && setLanguage(v)
          }
          options={options}
          styles={customStyles}
        />

        <div className="grid grid-cols-2 gap-2 mt-3">
          {["review", "explain", "improve", "bugs", "fix"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => runAICommand(cmd)}
              className="bg-zinc-800 rounded py-2 text-sm"
            >
              {cmd.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 overflow-hidden">

        {/* MOBILE TEXTAREA */}
        {mobileView === "editor" && (
          <textarea
            className="md:hidden w-full h-full bg-zinc-900 text-white p-4 rounded outline-none"
            placeholder="Write your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        )}

        {/* DESKTOP MONACO */}
        <div className="hidden md:block h-full border border-zinc-800 rounded">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language.value}
            value={code}
            onChange={(v: string | undefined) => setCode(v || "")}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>

        {/* RESPONSE */}
        {mobileView === "response" && (
          <div className="h-full overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <RingLoader color="#a855f7" />
              </div>
            ) : (
              <MarkdownRenderer>{response}</MarkdownRenderer>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
