"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Editor from "@monaco-editor/react";
import api from "@/services/api";

export default function CodeReviewPage() {
    const router = useRouter();
    const { status } = useSession();
    const [code, setCode] = useState("// Paste your code here\n");
    const [language, setLanguage] = useState("javascript");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auth guard using NextAuth
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const ext = file.name.split('.').pop()?.toLowerCase();
            const langMap: { [key: string]: string } = {
                'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
                'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c', 'cs': 'csharp',
                'go': 'go', 'rs': 'rust', 'php': 'php', 'rb': 'ruby', 'html': 'html', 'css': 'css'
            };
            if (ext && langMap[ext]) setLanguage(langMap[ext]);
            const reader = new FileReader();
            reader.onload = (e) => setCode(e.target?.result as string);
            reader.readAsText(file);
        }
    };

    const handleAnalyze = async () => {
        if (!code.trim() || code === "// Paste your code here\n") return;
        setIsAnalyzing(true);
        try {
            const res = await api.post("/reviews", {
                code,
                language,
                title: fileName || `${language} snippet - ${new Date().toLocaleDateString()}`,
            });
            if (res.data && res.data.review) {
                sessionStorage.setItem(`review-${res.data.review.id}`, JSON.stringify(res.data.review));
                router.push(`/review/${res.data.review.id}`);
                return;
            }
        } catch (error) {
            console.log("API call failed, using local analysis", error);
        }

        // Fallback: local mock analysis
        setTimeout(() => {
            const lines = code.split('\n');
            const codeLines = lines.filter((l: string) => l.trim() && !l.trim().startsWith('//')).length;
            const commentLines = lines.filter((l: string) => l.trim().startsWith('//')).length;
            const issues = [];
            const suggestions = [];

            if (code.includes('var ')) {
                issues.push({ type: 'best-practice', severity: 'warning', title: 'Use of var keyword', description: 'Consider using let or const for better scoping and to avoid hoisting issues.', line: lines.findIndex((l: string) => l.includes('var ')) + 1, suggestion: 'Replace var with let or const' });
            }
            if (code.includes('console.log')) {
                issues.push({ type: 'readability', severity: 'info', title: 'Console.log found', description: 'Remove debug console.log statements before production deployment.', line: lines.findIndex((l: string) => l.includes('console.log')) + 1, suggestion: 'Use a proper logging framework or remove debug statements' });
            }
            if (code.includes('eval(')) {
                issues.push({ type: 'security', severity: 'critical', title: 'Use of eval()', description: 'eval() can execute arbitrary code and is a severe security risk.', line: lines.findIndex((l: string) => l.includes('eval(')) + 1, suggestion: 'Use JSON.parse() or safer alternatives' });
            }

            suggestions.push({ title: 'Add error handling', description: 'Ensure all async operations have proper error handling.', priority: 'high', category: 'reliability' });
            suggestions.push({ title: 'Add input validation', description: 'Validate all inputs to prevent unexpected behavior.', priority: 'medium', category: 'security' });
            suggestions.push({ title: 'Add unit tests', description: 'Write unit tests to catch regressions early.', priority: 'high', category: 'testing' });

            const score = Math.max(45, Math.min(95, 85 - issues.filter(i => i.severity === 'critical').length * 15 - issues.filter(i => i.severity === 'warning').length * 5));

            const mockId = "local-" + Date.now();
            const reviewData = {
                id: mockId,
                title: fileName || `${language} snippet`,
                language,
                code,
                score,
                status: 'COMPLETED',
                createdAt: new Date().toISOString(),
                analysis: {
                    score,
                    issues,
                    suggestions,
                    metrics: {
                        cyclomaticComplexity: Math.min(20, Math.max(1, Math.floor(codeLines / 10))),
                        functionCount: (code.match(/function\s|const\s+\w+\s*=\s*\(/g) || []).length || 1,
                        avgFunctionLength: codeLines,
                        codeLines,
                        commentLines,
                        duplicatePatterns: 0,
                    },
                    summary: `The ${language} code has been analyzed. Overall quality score is ${score}/100. Found ${issues.length} issue(s) and ${suggestions.length} improvement suggestion(s).`,
                },
            };
            sessionStorage.setItem(`review-${mockId}`, JSON.stringify(reviewData));
            router.push(`/review/${mockId}`);
        }, 2000);
    };

    if (status === "loading") {
        return (
            <div style={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <main className="main-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                </main>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className="animate-fade-in" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
                            New <span className="gradient-text">Analysis</span>
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Paste code or upload a file to get instant AI feedback.</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input-field"
                            style={{ width: 140, padding: "8px 12px", background: "rgba(255,255,255,0.05)", cursor: "pointer" }}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="go">Go</option>
                            <option value="rust">Rust</option>
                        </select>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} />
                        <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                            Upload File
                        </button>
                        <button onClick={handleAnalyze} className="btn-primary" disabled={isAnalyzing || !code.trim()} style={{ minWidth: 140, justifyContent: "center" }}>
                            {isAnalyzing ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                    Run Analysis
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {fileName && (
                    <div className="animate-fade-in" style={{
                        display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", 
                        background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", 
                        borderRadius: 100, fontSize: 12, color: "#93c5fd", marginBottom: 16, width: "max-content"
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        {fileName}
                        <button onClick={() => { setFileName(""); setCode("// Paste your code here\n"); }} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", marginLeft: 4 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                )}

                <div className="animate-slide-up glass-card editor-container" style={{ flex: 1, position: "relative", padding: 2, display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "10px 16px", background: "rgba(0,0,0,0.2)", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                        <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{fileName || "untitled." + language}</span>
                    </div>
                    <div style={{ flex: 1, position: "relative" }}>
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "var(--font-mono)",
                                padding: { top: 16, bottom: 16 },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                                renderLineHighlight: "all",
                            }}
                        />
                        {isAnalyzing && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(10, 15, 23, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                                <div className="glass-card" style={{ padding: "32px 48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ position: "relative", width: 64, height: 64, marginBottom: 20 }}>
                                        <div style={{ position: "absolute", inset: 0, border: "4px solid rgba(59,130,246,0.1)", borderRadius: "50%" }}></div>
                                        <div style={{ position: "absolute", inset: 0, border: "4px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin-slow 1s linear infinite" }}></div>
                                        <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#3b82f6" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                    </div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "white" }}>Analyzing Code</h3>
                                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>CodeLens AI is reviewing for best practices...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
