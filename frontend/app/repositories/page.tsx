"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RepositoriesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { status } = useSession();
    const [linked, setLinked] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated") {
            setTimeout(() => setLoading(false), 600);
        }
    }, [status, router]);

    const handleConnect = () => {
        setLinked(true);
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
                <div className="animate-fade-in" style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
                            Git <span className="gradient-text">Repositories</span>
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Connect your GitHub to enable automated pull request scanning.</p>
                    </div>
                </div>

                <div className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
                    {loading ? (
                        <div className="glass-card skeleton" style={{ height: 200, borderRadius: "var(--radius)" }} />
                    ) : !linked ? (
                        <div className="glass-card" style={{ padding: "60px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                            }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Connect to GitHub</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 460, lineHeight: 1.6, marginBottom: 32 }}>
                                Authorize CodeLens AI to scan your repositories. We require read-only access to your code to perform AI analysis and detect issues.
                            </p>
                            <button onClick={handleConnect} className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
                                Authorize GitHub App
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                            <div style={{ padding: "16px 24px", background: "rgba(16,185,129,0.05)", borderBottom: "1px solid rgba(16,185,129,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                <span style={{ fontSize: 14, color: "#34d399", fontWeight: 600 }}>GitHub connected successfully</span>
                            </div>
                            <div style={{ padding: "24px 24px" }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Available Repositories</h3>
                                <div style={{ display: "grid", gap: 12 }}>
                                    {["backend-api", "frontend-web", "infrastructure-as-code", "auth-service"].map((repo) => (
                                        <div key={repo} style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, background: "rgba(255,255,255,0.01)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                                <span style={{ fontSize: 14, fontWeight: 600 }}>company-org / {repo}</span>
                                            </div>
                                            <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }}>Setup Auto-Scan</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
