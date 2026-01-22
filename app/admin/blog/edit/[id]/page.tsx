"use client";

import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Loader2, Upload, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export default function EditBlogPage() {
    const params = useParams();
    const id = params.id as string;
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [source, setSource] = useState("");
    const [pattern, setPattern] = useState("");
    const [domainInput, setDomainInput] = useState("");
    const [domains, setDomains] = useState<string[]>([]);

    // Fetch Existing Data
    useEffect(() => {
        if (isLoaded) {
            if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
                router.push("/");
                return;
            }

            fetch(`/api/blogs/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        alert("Blog not found");
                        router.push("/blogs");
                    } else {
                        setTitle(data.title);
                        setContent(data.content);
                        setImageUrl(data.imageUrl);
                        setDomains(data.domains);
                        setSource(data.source);
                        setPattern(data.pattern);
                        setLoading(false);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [isLoaded, user, router, id]);

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
            if (data.secure_url) {
                setImageUrl(data.secure_url);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setPublishing(true);
            const res = await fetch(`/api/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    imageUrl,
                    domains,
                    source,
                    pattern
                }),
            });

            if (res.ok) {
                router.push(`/blogs/${id}`);
            } else {
                alert("Failed to update");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPublishing(false);
        }
    };

    if (loading || !isLoaded) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">
            <Loader2 className="animate-spin" />
        </div>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950">
                <div className="font-bold text-zinc-400 uppercase tracking-widest">Admin // Edit_Protocol</div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={publishing} className="bg-purple-600 hover:bg-purple-700">
                        {publishing ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Metadata & Editor */}
                <div className="w-1/2 flex flex-col border-r border-zinc-800">
                    {/* Metadata Form */}
                    <div className="p-6 border-b border-zinc-800 space-y-4 bg-zinc-900/20 overflow-y-auto max-h-[40vh]">
                        <input
                            className="w-full bg-transparent text-3xl font-bold placeholder:text-zinc-600 focus:outline-none"
                            placeholder="Enter Mission Title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Source Platform</label>
                                <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm focus:border-purple-500 outline-none"
                                    placeholder="e.g. LeetCode" value={source} onChange={e => setSource(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Pattern</label>
                                <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm focus:border-purple-500 outline-none"
                                    placeholder="e.g. Sliding Window" value={pattern} onChange={e => setPattern(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Cover Image</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors">
                                    {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                                    Change Image
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                                {imageUrl && <span className="text-xs text-emerald-500 truncate max-w-[200px]">{imageUrl}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase block mb-1">Domains / Tags (Press Enter)</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {domains.map(tag => (
                                    <span key={tag} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                                        {tag} <X className="w-3 h-3 cursor-pointer" onClick={() => removeDomain(tag)} />
                                    </span>
                                ))}
                            </div>
                            <input
                                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm focus:border-purple-500 outline-none"
                                placeholder="Add domain..."
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                onKeyDown={handleAddDomain}
                            />
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 min-h-[50vh]">
                        <Editor
                            height="100%"
                            defaultLanguage="markdown"
                            theme="vs-dark"
                            value={content}
                            onChange={(value: string | undefined) => setContent(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: "on",
                                padding: { top: 20 }
                            }}
                        />
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-1/2 p-8 overflow-y-auto bg-[#0a0a0a]">
                    <h2 className="text-xs font-bold text-zinc-600 uppercase mb-8 tracking-widest">Live Preview</h2>
                    <article className="prose prose-invert prose-purple max-w-none">
                        <h1 className="text-4xl font-bold mb-4">{title || "Untitled Mission"}</h1>
                        {imageUrl && <img src={imageUrl} alt="Cover" className="rounded-xl border border-zinc-800 mb-8 w-full object-cover max-h-[300px]" />}
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    );
}
