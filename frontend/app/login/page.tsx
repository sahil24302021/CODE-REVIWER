"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // NextAuth hook

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            // Use NextAuth credential login pattern
            const res = await signIn("credentials", {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = () => {
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("user", JSON.stringify({ name: "Demo User", email: "demo@codelens.ai", plan: "PRO" }));
        router.push("/dashboard");
    };

    const handleGitHubLogin = () => {
        signIn("github", { callbackUrl: "/dashboard" });
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>



            {/* ═══ Left Brand Panel ═══ */}
            <div style={{
                flex: 1, position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "60px 48px",
                background: "var(--bg-primary)",
            }}>
                <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.8 }} />

                <div style={{ position: "relative", maxWidth: 420 }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48, textDecoration: "none" }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: "var(--text-primary)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 17, fontWeight: 800, color: "#000",
                        }}>C</div>
                        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>CodeLens</span>
                    </Link>

                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 18, color: "var(--text-primary)" }}>
                        Your code, reviewed<br />
                        <span style={{ color: "var(--text-secondary)" }}>in seconds.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40 }}>
                        AI-powered analysis catches the bugs, vulnerabilities, and performance issues that humans miss.
                    </p>

                    {/* Feature pills */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, text: "Instant code analysis powered by GPT-4o" },
                            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: "OWASP Top 10 security scanning" },
                            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>, text: "Direct GitHub & CI/CD integration" },
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13.5, color: "var(--text-secondary)" }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8,
                                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>{item.icon}</div>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ Right Form Panel ═══ */}
            <div style={{
                width: 480, display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "60px 42px",
                background: "var(--bg-secondary)",
                borderLeft: "1px solid var(--border-color)",
            }}>
                <div style={{ maxWidth: 360, width: "100%" }}>
                    {/* Prominent Back Button */}
                    <Link
                        href="/"
                        className="btn-secondary"
                        style={{
                            marginBottom: 32, display: "inline-flex", padding: "8px 16px",
                            fontSize: 13, border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.03)"
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Home
                    </Link>

                    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>Welcome back</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>Sign in to your account to continue</p>

                    {/* GitHub Button */}
                    <button onClick={handleDemo} className="btn-secondary" style={{
                        width: "100%", padding: 13, justifyContent: "center", marginBottom: 28,
                        fontWeight: 600,
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                        Continue with GitHub
                    </button>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>OR</span>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                    </div>

                    {error && (
                        <div style={{
                            padding: "10px 14px", borderRadius: "var(--radius-sm)", marginBottom: 20,
                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                            fontSize: 13, color: "#f87171", display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Email address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@company.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                autoComplete="email"
                            />
                        </div>
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
                                <button type="button" style={{
                                    fontSize: 12, color: "var(--text-primary)", background: "none", border: "none",
                                    cursor: "pointer", fontWeight: 500,
                                }}>Forgot password?</button>
                            </div>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-field"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    autoComplete="current-password"
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)",
                                        display: "flex", padding: 2,
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: "100%", justifyContent: "center", padding: 14,
                                fontSize: 15, fontWeight: 700,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 600 }}>Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
