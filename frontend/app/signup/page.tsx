"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { met: password.length >= 8, label: "8+ characters" },
        { met: /[A-Z]/.test(password), label: "Uppercase" },
        { met: /[0-9]/.test(password), label: "Number" },
    ];
    const score = checks.filter(c => c.met).length;
    const colors = ["#ef4444", "#f59e0b", "#10b981"];
    if (!password) return null;
    return (
        <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < score ? colors[Math.min(score - 1, 2)] : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />
                ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                {checks.map((c, i) => (
                    <span key={i} style={{ fontSize: 10, color: c.met ? "#34d399" : "var(--text-muted)", fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
                        {c.met ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : null}
                        {c.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.name || !form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Signup failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubSignup = () => {
        signIn("github", { callbackUrl: "/dashboard" });
    };

    const handleGoogleSignup = () => {
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
                        Start shipping<br />
                        <span style={{ color: "var(--text-secondary)" }}>better code.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40 }}>
                        Join thousands of developers using CodeLens to catch bugs and vulnerabilities automatically.
                    </p>

                    {/* Feature pills */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>, text: "Free for open-source projects" },
                            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: "Comprehensive security scanning" },
                            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>, text: "Actionable performance insights" },
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

                    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>Create your account</h1>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>Free to start. No credit card required.</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                        {/* GitHub */}
                        <button onClick={handleGitHubSignup} className="btn-secondary" style={{ width: "100%", padding: 13, justifyContent: "center", fontWeight: 600 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                            Sign up with GitHub
                        </button>

                        {/* Google */}
                        <button onClick={handleGoogleSignup} className="btn-secondary" style={{ width: "100%", padding: 13, justifyContent: "center", fontWeight: 600 }}>
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
                                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                                <path d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z" fill="#34A853" />
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

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
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Full name</label>
                            <input type="text" className="input-field" placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Email address</label>
                            <div style={{ position: "relative" }}>
                                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                </div>
                                <input type="email" className="input-field" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" style={{ paddingLeft: 44 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 28 }}>
                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-field"
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    autoComplete="new-password"
                                    style={{ paddingRight: 44 }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 2,
                                }}>
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                            <PasswordStrength password={form.password} />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{
                            width: "100%", justifyContent: "center", padding: 14, fontSize: 15, fontWeight: 700,
                            opacity: loading ? 0.7 : 1,
                        }}>
                            {loading ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                            ) : "Create Account"}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "var(--text-muted)" }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 600 }}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
