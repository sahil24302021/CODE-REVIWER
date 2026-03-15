"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function PRReviewPage() {
    const router = useRouter();
    const [prUrl, setPrUrl] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
        }
    }, [router]);

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prUrl) return;
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setShowResult(true);
        }, 2500);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
                        Pull Request <span className="gradient-text">Analysis</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                        Paste a GitHub Pull Request URL to get an instant AI review of all changed files.
                    </p>
                </div>

            <div className="glass-card" style={{ padding: 32, marginBottom: 40 }}>
                <form onSubmit={handleAnalyze} style={{ display: "flex", gap: 12 }}>
                    <input
                        type="url"
                        className="input-field"
                        placeholder="https://github.com/owner/repo/pull/123"
                        value={prUrl}
                        onChange={(e) => setPrUrl(e.target.value)}
                        style={{ flex: 1, padding: "14px 20px", fontSize: 16 }}
                        required
                    />
                    <button type="submit" className="btn-primary" disabled={analyzing || !prUrl} style={{ padding: "14px 32px", fontSize: 16, opacity: analyzing ? 0.7 : 1 }}>
                        {analyzing ? "Scanning PR..." : "Review PR"}
                    </button>
                </form>
            </div>

            {showResult && (
                <div className="animate-slide-in">
                    <div className="glass-card" style={{ padding: 0, overflow: "hidden", marginBottom: 32 }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)", background: "rgba(59,130,246,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700 }}>PR #142: Refactor authenticaton flow</h2>
                                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>sahilkumar/frontend-app · 12 files changed · +342 -124 lines</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>72/100</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Quality Score</div>
                            </div>
                        </div>

                        <div style={{ padding: 24 }}>
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>AI Summary</h3>
                                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                    This PR successfully refactors the authentication flow to use JWTs instead of session cookies. The implementation is generally solid, but there are a few security concerns regarding token storage and some missing error handlers in the auth service. I recommend fixing the XSS vulnerability before merging.
                                </p>
                            </div>

                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Review Comments (4)</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {[
                                    { file: "src/services/auth.ts", line: 45, type: "security", title: "Insecure JWT Storage", desc: "Storing the JWT in localStorage makes it vulnerable to XSS attacks. Consider using highly-secure HttpOnly cookies instead." },
                                    { file: "src/components/Login.tsx", line: 112, type: "bug", title: "Unhandled Promise Rejection", desc: "The API call lacks a catch block. If the network fails, the user will be stuck in a loading state." },
                                    { file: "src/utils/crypto.ts", line: 22, type: "best-practice", title: "Deprecated Algorithm", desc: "The hashing algorithm used here is outdated. Upgrade to Argon2 or at least bcrypt with a higher work factor." },
                                    { file: "src/types/index.ts", line: 15, type: "info", title: "Loose typings", desc: "Using 'any' for the decoded payload defeats the purpose of TypeScript. Define a proper interface for the JWT payload." },
                                ].map((item, i) => (
                                    <div key={i} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                            <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--accent-blue)" }}>{item.file} <span style={{ color: "var(--text-muted)" }}>#L{item.line}</span></div>
                                            <span className={`badge ${item.type === 'security' ? 'badge-critical' : item.type === 'bug' ? 'badge-warning' : 'badge-info'}`}>{item.type.toUpperCase()}</span>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                                        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </main>
        </div>
    );
}
