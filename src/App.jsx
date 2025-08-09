import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import RingLoader from "react-spinners/RingLoader";

const options = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "typescript", label: "TypeScript" },
  { value: "rust", label: "Rust" },
  { value: "dart", label: "Dart" },
  { value: "scala", label: "Scala" },
  { value: "perl", label: "Perl" },
  { value: "haskell", label: "Haskell" },
  { value: "elixir", label: "Elixir" },
  { value: "r", label: "R" },
  { value: "matlab", label: "MATLAB" },
  { value: "bash", label: "Bash" },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#18181b",
    borderColor: "#3f3f46",
    color: "#fff",
    width: "100%",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#18181b",
    color: "#fff",
    width: "100%",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff",
    width: "100%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#27272a" : "#18181b",
    color: "#fff",
    cursor: "pointer",
  }),
  input: (provided) => ({
    ...provided,
    color: "#fff",
    width: "100%",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#a1a1aa",
    width: "100%",
  }),
};

const MarkdownRenderer = ({ children }) => (
  <Markdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {children}
  </Markdown>
);

const App = () => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [command, setCommand] = useState("review");
  const [darkMode, setDarkMode] = useState(true);

  const ai = new GoogleGenAI({ apiKey: "your gemini-api-key" });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  async function runAICommand() {
    if (!code.trim()) {
      alert("Please enter code first");
      return;
    }
    setResponse("");
    setLoading(true);

    let prompt = "";

    switch (command) {
      case "review":
        prompt = `You are an expert-level developer reviewing this ${selectedOption.value} code in detail. Provide quality rating, suggestions, explanation, bugs, errors, and fixes.\nCode:\n${code}`;
        break;
      case "explain":
        prompt = `Explain this ${selectedOption.value} code clearly, step by step:\n${code}`;
        break;
      case "improve":
        prompt = `Suggest improvements & best practices for this ${selectedOption.value} code:\n${code}`;
        break;
      case "bugs":
        prompt = `List bugs or errors in this ${selectedOption.value} code and how to fix them:\n${code}`;
        break;
      case "fix":
        prompt = `Fix the following ${selectedOption.value} code, correcting all errors and improving style:\n${code}`;
        break;
      default:
        prompt = `Review this ${selectedOption.value} code:\n${code}`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      setResponse(response.text);
    } catch (error) {
      setResponse("Error: Unable to get AI response. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div
        className="main flex flex-col md:flex-row justify-between px-4 md:px-12"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left h-[87.5%] w-full md:w-1/2 flex flex-col">
          <div className="tabs mt-5 px-5 mb-3 w-full flex flex-wrap items-center gap-3">
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              options={options}
              styles={customStyles}
              className="flex-grow min-w-[200px]"
            />
            {["review", "explain", "improve", "bugs", "fix"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setCommand(cmd);
                  runAICommand();
                }}
                disabled={loading}
                className="btnNormal bg-zinc-900 min-w-[100px] transition-all hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cmd === "fix" ? "Fix Code" : cmd.charAt(0).toUpperCase() + cmd.slice(1)}
              </button>
            ))}
          </div>
          <Editor
            height="100%"
            theme={darkMode ? "vs-dark" : "light"}
            language={selectedOption.value}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
            }}
          />
        </div>

        <div className="right overflow-auto p-3 bg-zinc-900 w-full md:w-1/2 h-[101%]">
          <div className="topTab border-b border-t border-gray-700 flex items-center justify-between h-16 px-4">
            <p className="font-bold text-lg text-white">Response</p>
          </div>
          <div className="p-3 min-h-[300px] text-white">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <RingLoader color="#9333ea" size={60} />
              </div>
            ) : (
              <MarkdownRenderer>{response}</MarkdownRenderer>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
