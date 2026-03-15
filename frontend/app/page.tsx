"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

/* ─── SVG Icon Components ────────────────────── */
function CheckIcon({ color = "#818cf8" }: { color?: string }) {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function ArrowRight() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}
function StarIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}

/* ─── Feature Data ────────────────────── */
const features = [
    {
        title: "Intelligent Bug Detection",
        desc: "Catch bugs, null pointer errors, race conditions, and logical flaws before they make it to production.",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z" /><path d="M12 20v-9" /></svg>,
    },
    {
        title: "Security Vulnerability Scanning",
        desc: "Detect SQL injection, XSS, insecure deserialization, hardcoded secrets, and OWASP Top 10 issues.",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    },
    {
        title: "Performance Deep Analysis",
        desc: "Identify N+1 queries, memory leaks, unnecessary re-renders, and optimization opportunities.",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    },
    {
        title: "Code Quality Metrics",
        desc: "Cyclomatic complexity, function length, duplication ratio, comment coverage — all in one dashboard.",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    },
    {
        title: "GitHub & CI/CD Integration",
        desc: "Connect repositories, auto-review pull requests, and integrate into your existing CI/CD pipeline.",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
    },
    {
        title: "Detailed PDF Reports",
        desc: "Export professional code review reports as PDF documents for stakeholders and compliance audits.",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    },
];

const testimonials = [
    { name: "Alex Chen", role: "Staff Engineer, Stripe", text: "Replaced half our manual review workload. The security scanning alone has caught 3 critical vulnerabilities.", avatar: "AC" },
    { name: "Sarah Kim", role: "Tech Lead, Shopify", text: "CodeLens fits perfectly into our PR workflow. The team ships faster with higher confidence now.", avatar: "SK" },
    { name: "Marcus Rivera", role: "CTO, Startup", text: "We went from zero code review process to having AI review every commit. Game changer for our 8-person team.", avatar: "MR" },
];

const codeLines = [
    { num: 1, text: '<span style="color:#c678dd">function</span> <span style="color:#61afef">validateUser</span>(<span style="color:#e06c75">data</span>) {' },
    { num: 2, text: '  <span style="color:#c678dd">if</span> (<span style="color:#e06c75">data</span>.<span style="color:#61afef">email</span>) {' },
    { num: 3, text: '    <span style="color:#c678dd">return</span> <span style="color:#61afef">query</span>(<span style="color:#98c379">`SELECT * FROM users</span>' },
    { num: 4, text: '      <span style="color:#98c379">WHERE email = ${data.email}`</span>);', highlight: true, issue: "SQL Injection — critical" },
    { num: 5, text: '  }' },
    { num: 6, text: '  <span style="color:#c678dd">var</span> <span style="color:#e06c75">result</span> = <span style="color:#56b6c2">null</span>;', highlight: true, issue: "Use const instead of var" },
    { num: 7, text: '  <span style="color:#c678dd">return</span> <span style="color:#e06c75">result</span>;' },
    { num: 8, text: '}' },
];

/* ─── Animated Counter Hook ────────────────────── */
function useCounter(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                const start = Date.now();
                const tick = () => {
                    const progress = Math.min((Date.now() - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                tick();
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return { count, ref };
}

function AnimatedStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
    const { count, ref } = useCounter(value);
    return (
        <div ref={ref} style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>{count.toLocaleString()}{suffix}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, fontWeight: 500 }}>{label}</div>
        </div>
    );
}

/* ─── Page Component ────────────────────── */
export default function LandingPage() {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setVisibleLines((prev) => (prev < codeLines.length ? prev + 1 : prev));
        }, 350);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>

            {/* ═══ Navigation ═══ */}
            <nav className="glass" style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid var(--border-color)", background: "rgba(0,0,0,0.8)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "var(--text-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 800, color: "#000",
                    }}>C</div>
                    <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>CodeLens</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <Link href="#features" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Features</Link>
                    <Link href="#pricing" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Pricing</Link>
                    <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />
                    <Link href="/login" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Sign In</Link>
                    <Link href="/signup" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* ═══ Hero Section ═══ */}
            <section style={{ position: "relative", paddingTop: 180, paddingBottom: 60 }}>
                <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.2 }} />

                <div style={{ maxWidth: 850, margin: "0 auto", padding: "0 24px", position: "relative", textAlign: "center" }}>
                    {/* Badge */}
                    <div className="animate-fade-in" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "6px 16px 6px 8px", borderRadius: 100,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.03)",
                        fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 32,
                    }}>
                        <span style={{ padding: "2px 8px", borderRadius: 100, background: "rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: 10, fontWeight: 700 }}>NEW</span>
                        Engineered for modern teams
                    </div>

                    {/* Headline */}
                    <h1 className="animate-fade-in" style={{
                        fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 800, lineHeight: 1.05,
                        marginBottom: 24, letterSpacing: "-0.04em", color: "var(--text-primary)"
                    }}>
                        Code reviews that<br />
                        <span style={{ color: "var(--text-secondary)" }}>actually make sense.</span>
                    </h1>

                    {/* Subhead */}
                    <p className="animate-fade-in" style={{
                        fontSize: 18, color: "var(--text-secondary)", maxWidth: 520,
                        margin: "0 auto 40px", lineHeight: 1.65, fontWeight: 400,
                    }}>
                        Get AI-powered code analysis in seconds. Find bugs, vulnerabilities, and performance issues — with actionable fixes, not vague suggestions.
                    </p>

                    {/* CTA */}
                    <div className="animate-fade-in" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/signup" className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
                            Start Free
                            <ArrowRight />
                        </Link>
                        <Link href="/review" className="btn-secondary" style={{ padding: "14px 32px", fontSize: 15 }}>
                            Try Live Demo
                        </Link>
                    </div>
                </div>

                {/* ═══ Code Demo ═══ */}
                <div className="animate-slide-up" style={{ maxWidth: 760, margin: "70px auto 0", padding: "0 24px", animationDelay: "0.3s", opacity: 0 }}>
                    <div className="glass-card" style={{ overflow: "hidden", textAlign: "left", boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)" }}>
                        {/* Window Chrome */}
                        <div style={{
                            padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                            <span style={{ marginLeft: 12, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>validate-user.js</span>
                        </div>
                        {/* Code */}
                        <div style={{ padding: "14px 0", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.9 }}>
                            {codeLines.slice(0, visibleLines).map((line) => (
                                <div key={line.num} style={{
                                    display: "flex", alignItems: "flex-start",
                                    background: line.highlight ? "rgba(239,68,68,0.04)" : "transparent",
                                    borderLeft: line.highlight ? "3px solid rgba(239,68,68,0.6)" : "3px solid transparent",
                                    padding: "0 16px",
                                }}>
                                    <span style={{ color: "var(--text-muted)", minWidth: 36, userSelect: "none", fontSize: 11, opacity: 0.5 }}>{line.num}</span>
                                    <span dangerouslySetInnerHTML={{ __html: line.text }} />
                                    {line.issue && (
                                        <span style={{
                                            marginLeft: "auto", paddingLeft: 16, fontSize: 10,
                                            color: "#f87171", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4,
                                            fontFamily: "var(--font-sans)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
                                        }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                            {line.issue}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {visibleLines === codeLines.length && (
                            <div style={{
                                padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.04)",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                background: "rgba(16,185,129,0.03)",
                            }}>
                                <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                    <CheckIcon color="#34d399" />
                                    Analysis complete — Score: 72/100
                                </span>
                                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>2 issues  |  3 suggestions</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══ Trusted By ═══ */}
            <section style={{ maxWidth: 800, margin: "60px auto 0", padding: "0 24px", textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>
                    Trusted by developers at
                </p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 48, flexWrap: "wrap", opacity: 0.3 }}>
                    {["GitHub", "GitLab", "Vercel", "Stripe", "Shopify"].map(name => (
                        <span key={name} style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{name}</span>
                    ))}
                </div>
            </section>

            {/* ═══ Stats ═══ */}
            <section style={{ maxWidth: 900, margin: "60px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
                <AnimatedStat value={52000} suffix="+" label="Reviews Completed" />
                <AnimatedStat value={2500000} suffix="" label="Lines Analyzed" />
                <AnimatedStat value={12400} suffix="+" label="Bugs Caught" />
                <AnimatedStat value={98} suffix="%" label="User Satisfaction" />
            </section>

            {/* ═══ Features ═══ */}
            <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
                        Built for <span style={{ color: "var(--text-secondary)" }}>serious engineering teams.</span>
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                        Everything you need to ship better code, faster. No setup required.
                    </p>
                </div>
                <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                    {features.map((feature) => (
                        <div key={feature.title} className="glass-card card-glow" style={{ padding: 28, cursor: "default", background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 10,
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: 20, color: "var(--text-primary)",
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>{feature.title}</h3>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ Testimonials ═══ */}
            <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>
                        Loved by <span style={{ color: "var(--text-secondary)" }}>developers worldwide.</span>
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                    {testimonials.map((t) => (
                        <div key={t.name} className="glass-card" style={{ padding: 28, cursor: "default" }}>
                            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                            </div>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "rgba(255,255,255,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 12, fontWeight: 700, color: "var(--text-primary)",
                                }}>{t.avatar}</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ Pricing ═══ */}
            <section id="pricing" style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>
                        Simple, honest <span style={{ color: "var(--text-secondary)" }}>pricing.</span>
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>No hidden fees. Cancel anytime.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 920, margin: "0 auto" }}>
                    {/* Free */}
                    <div className="glass-card" style={{ padding: 36, cursor: "default" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Hobby</p>
                        <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em" }}>$0</span>
                            <span style={{ color: "var(--text-muted)", fontSize: 14 }}> / forever</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28 }}>For individual developers getting started.</p>
                        <Link href="/signup" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: 14, marginBottom: 28 }}>Get Started</Link>
                        <ul style={{ listStyle: "none" }}>
                            {["5 reviews / month", "Basic bug detection", "Quality scores", "Single file upload"].map(f => (
                                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-secondary)", padding: "7px 0" }}>
                                    <CheckIcon color="var(--text-muted)" /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Pro */}
                    <div className="glass-card" style={{
                        padding: 36, cursor: "default", position: "relative",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(255,255,255,0.03)",
                    }}>
                        <div style={{
                            position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                            padding: "4px 14px", borderRadius: 100,
                            background: "var(--text-primary)", color: "#000",
                            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                        }}>Recommended</div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Pro</p>
                        <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em" }}>$19</span>
                            <span style={{ color: "var(--text-muted)", fontSize: 14 }}> / month</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28 }}>For professional devs who ship daily.</p>
                        <Link href="/signup" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, marginBottom: 28 }}>Start Free Trial</Link>
                        <ul style={{ listStyle: "none" }}>
                            {["Unlimited reviews", "GitHub integration", "Auto PR reviews", "Security scanning", "PDF reports", "Priority support"].map(f => (
                                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-secondary)", padding: "7px 0" }}>
                                    <CheckIcon /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Enterprise */}
                    <div className="glass-card" style={{ padding: 36, cursor: "default" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Team</p>
                        <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em" }}>$49</span>
                            <span style={{ color: "var(--text-muted)", fontSize: 14 }}> / user / mo</span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28 }}>For engineering teams and orgs.</p>
                        <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: 14, marginBottom: 28 }}>Contact Sales</button>
                        <ul style={{ listStyle: "none" }}>
                            {["Everything in Pro", "Team dashboards", "Custom AI rules", "SSO & SAML", "SLA guarantee", "Dedicated support"].map(f => (
                                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-secondary)", padding: "7px 0" }}>
                                    <CheckIcon color="var(--accent-purple)" /> {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ═══ Final CTA ═══ */}
            <section style={{ padding: "120px 24px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "relative" }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
                        Ship better code,<br /><span style={{ color: "var(--text-secondary)" }}>starting today.</span>
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 36, maxWidth: 420, margin: "0 auto 36px" }}>
                        Join 12,000+ developers using CodeLens to write cleaner, safer code.
                    </p>
                    <Link href="/signup" className="btn-primary" style={{ padding: "16px 40px", fontSize: 16 }}>
                        Get Started Free <ArrowRight />
                    </Link>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer style={{
                borderTop: "1px solid var(--border-color)", padding: "28px 40px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontSize: 13, color: "var(--text-secondary)", background: "var(--bg-primary)"
            }}>
                <span>&copy; 2026 CodeLens</span>
                <div style={{ display: "flex", gap: 24 }}>
                    <Link href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Privacy</Link>
                    <Link href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Terms</Link>
                    <Link href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Support</Link>
                </div>
            </footer>
        </div>
    );
}
