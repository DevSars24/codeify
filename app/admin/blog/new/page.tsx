"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Loader2, Upload, Save, X, Eye, FileText, Settings, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

type ViewMode = "meta" | "edit" | "preview";

export default function NewBlogPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("meta");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("# Start writing your DSA guide...");
    const [imageUrl, setImageUrl] = useState("");
    const [source, setSource] = useState("");
    const [pattern, setPattern] = useState("");
    const [domainInput, setDomainInput] = useState("");
    const [domains, setDomains] = useState<string[]>([]);

    useEffect(() => {
        if (isLoaded) {
            if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
                router.push("/");
            }
        }
    }, [isLoaded, user, router]);

    const handleAddDomain = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && domainInput.trim()) {
            e.preventDefault();
            if (!domains.includes(domainInput.trim())) {
                setDomains([...domains, domainInput.trim()]);
            }
            setDomainInput("");
        }
    };

    const removeDomain = (tag: string) => {
        setDomains(domains.filter(d => d !== tag));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upload failed");
            }

            if (data.secure_url) setImageUrl(data.secure_url);
        } catch (err: any) {
            console.error("Upload failed", err);
            alert(`Upload Error: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            alert("Please enter a Mission Title.");
            setViewMode("meta");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, imageUrl, domains, source, pattern }),
            });

            if (res.ok) router.push("/blogs");
            else alert("Failed to publish");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded || (user?.emailAddresses[0].emailAddress !== ADMIN_EMAIL)) {
        return <div className="h-screen bg-black flex items-center justify-center text-zinc-500">Authenticating...</div>;
    }

    return (
        // Using h-[100dvh] for mobile browser compatibility
        <div className="h-[100dvh] bg-black text-white flex flex-col overflow-hidden">

            {/* Header: Simplified for Mobile */}
            <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-950 shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="md:hidden">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="font-mono font-bold text-zinc-400 uppercase tracking-tighter text-xs md:text-sm">
                        Admin // <span className="text-purple-500">New_Entry</span>
                    </div>
                </div>

                <Button
                    onClick={handlePublish}
                    disabled={loading}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 h-9 px-4"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
                    <span>Publish</span>
                </Button>
            </header>

            {/* Mobile Tab Switcher */}
            <nav className="flex md:hidden border-b border-zinc-800 bg-zinc-950 shrink-0">
                {[
                    { id: 'meta', icon: Settings, label: 'Meta' },
                    { id: 'edit', icon: FileText, label: 'Editor' },
                    { id: 'preview', icon: Eye, label: 'Preview' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as ViewMode)}
                        className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${viewMode === tab.id ? 'text-purple-500 border-b-2 border-purple-500' : 'text-zinc-500'
                            }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-[10px] uppercase font-bold">{tab.label}</span>
                    </button>
                ))}
            </nav>

            <main className="flex-1 flex overflow-hidden">
                {/* Left Column: Meta + Editor */}
                <div className={`flex-1 flex flex-col border-r border-zinc-800 
                    ${viewMode === 'preview' ? 'hidden md:flex' : 'flex'}`}>

                    {/* Meta Inputs: Independent scroll on mobile */}
                    <section className={`p-4 md:p-6 space-y-6 overflow-y-auto bg-zinc-900/10 
                        ${viewMode === 'meta' ? 'flex-1' : 'hidden md:block md:h-1/3 md:shrink-0 border-b border-zinc-800'}`}>

                        <input
                            className="w-full bg-transparent text-2xl md:text-3xl font-bold placeholder:text-zinc-800 focus:outline-none"
                            placeholder="Mission Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase">Source</label>
                                <input className="w-full bg-zinc-900/50 border border-zinc-800 p-2.5 rounded text-sm focus:ring-1 ring-purple-500 outline-none"
                                    placeholder="LeetCode" value={source} onChange={e => setSource(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase">Pattern</label>
                                <input className="w-full bg-zinc-900/50 border border-zinc-800 p-2.5 rounded text-sm focus:ring-1 ring-purple-500 outline-none"
                                    placeholder="Sliding Window" value={pattern} onChange={e => setPattern(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase">Media</label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-zinc-200 transition-colors flex items-center gap-2">
                                    {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                                    UPLOAD COVER
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                                {imageUrl && <div className="text-[10px] text-emerald-500 font-mono truncate max-w-[150px]">FILE_READY.JPG</div>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {domains.map(tag => (
                                    <span key={tag} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded flex items-center gap-2 border border-zinc-700">
                                        {tag} <X className="w-3 h-3 cursor-pointer text-zinc-500 hover:text-white" onClick={() => removeDomain(tag)} />
                                    </span>
                                ))}
                            </div>
                            <input
                                className="w-full bg-zinc-900/50 border border-zinc-800 p-2.5 rounded text-sm focus:ring-1 ring-purple-500 outline-none"
                                placeholder="Add tag + Enter..."
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                onKeyDown={handleAddDomain}
                            />
                        </div>
                    </section>

                    {/* Monaco Editor: Fills remaining space */}
                    <div className={`flex-1 bg-[#1e1e1e] ${viewMode === 'edit' ? 'block' : 'hidden md:block'}`}>
                        <Editor
                            height="100%"
                            defaultLanguage="markdown"
                            theme="vs-dark"
                            value={content}
                            onChange={(v: string | undefined) => setContent(v || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16, // Larger for mobile readability
                                wordWrap: "on",
                                padding: { top: 20 },
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className={`flex-1 overflow-y-auto bg-black p-5 md:p-10 
                    ${viewMode === 'preview' ? 'block' : 'hidden md:block'}`}>
                    <header className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] flex-1 bg-zinc-800"></div>
                        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Live Preview</h2>
                        <div className="h-[1px] flex-1 bg-zinc-800"></div>
                    </header>

                    <article className="prose prose-invert prose-purple max-w-none">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                            {title || "Untitled Mission"}
                        </h1>
                        {imageUrl && (
                            <img src={imageUrl} alt="Cover" className="rounded-lg border border-zinc-800 mb-8 w-full object-cover aspect-video shadow-2xl" />
                        )}
                        <div className="leading-relaxed">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}