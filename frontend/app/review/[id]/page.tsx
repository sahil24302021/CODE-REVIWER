"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface Issue {
    type: string;
    severity: string;
    title: string;
    description: string;
    line: number | null;
    suggestion: string;
}

interface Suggestion {
    title: string;
    description: string;
    priority: string;
    category: string;
}

interface ReviewData {
    id: string;
    title: string;
    language: string;
    code: string;
    score: number;
    status: string;
    createdAt: string;
    analysis: {
        score: number;
        issues: Issue[];
        suggestions: Suggestion[];
        metrics: {
            cyclomaticComplexity: number;
            functionCount: number;
            avgFunctionLength: number;
            codeLines: number;
            commentLines: number;
            duplicatePatterns: number;
        };
        summary: string;
    };
}

function ScoreGauge({ score }: { score: number }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
    const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";

    return (
        <div style={{ textAlign: "center" }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="8" />
                <circle cx="65" cy="65" r={radius} fill="none" stroke={color} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                    transform="rotate(-90 65 65)" className="score-ring" />
                <text x="65" y="60" textAnchor="middle" fill="var(--text-primary)" fontSize="30" fontWeight="800">{score}</text>
                <text x="65" y="80" textAnchor="middle" fill="var(--text-muted)" fontSize="11">{label}</text>
            </svg>
        </div>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const cls = severity === "critical" ? "badge-critical" : severity === "warning" ? "badge-warning" : "badge-info";
    return <span className={`badge ${cls}`}>{severity.toUpperCase()}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
    const colors: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#3b82f6" };
    return (
        <span style={{
            padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
            background: `${colors[priority]}15`, color: colors[priority],
            border: `1px solid ${colors[priority]}30`,
        }}>
            {priority.toUpperCase()}
        </span>
    );
}

function TypeIcon({ type }: { type: string }) {
    const icons: Record<string, React.ReactElement> = {
        bug: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1" />
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z" />
                <path d="M12 20v-9" />
            </svg>
        ),
        security: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        performance: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        readability: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
        ),
        "best-practice": (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
    };
    return icons[type] || (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

function MetricIcon({ type }: { type: string }) {
    const icons: Record<string, React.ReactElement> = {
        complexity: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
        ),
        functions: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
        ),
        length: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
        ),
        codelines: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        comments: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
        ),
        duplicates: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
        ),
    };
    return icons[type] || null;
}

export default function ReviewResultPage() {
    const params = useParams();
    const [review, setReview] = useState<ReviewData | null>(null);
    const [activeTab, setActiveTab] = useState("issues");
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const id = params.id as string;
        // Try sessionStorage first (for local/mock reviews)
        const stored = sessionStorage.getItem(`review-${id}`);
        if (stored) {
            try {
                setReview(JSON.parse(stored));
            } catch { /* ignore parse error */ }
            return;
        }

        // Try API
        const token = localStorage.getItem("token");
        if (token && token !== "demo-token") {
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            fetch(`${API}/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(r => r.ok ? r.json() : null)
                .then(data => { if (data?.review) setReview(data.review); })
                .catch(() => {});
        }
    }, [params.id]);

    if (!review) {
        return (
            <div style={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <main className="main-content" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" style={{ animation: "spin-slow 2s linear infinite", marginBottom: 12 }}>
                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        <p style={{ color: "var(--text-secondary)" }}>Loading analysis results...</p>
                    </div>
                </main>
            </div>
        );
    }

    const { analysis } = review;
    const criticalCount = analysis.issues.filter((i: Issue) => i.severity === "critical").length;
    const warningCount = analysis.issues.filter((i: Issue) => i.severity === "warning").length;
    const infoCount = analysis.issues.filter((i: Issue) => i.severity === "info").length;

    const handleExportPDF = async () => {
        const token = localStorage.getItem("token");
        if (!token || token === "demo-token" || review.id.startsWith("local-")) {
            // For local/demo reviews, create a simple text download
            const text = [
                `CodeLens AI - Code Review Report`,
                `================================`,
                `Title: ${review.title}`,
                `Language: ${review.language}`,
                `Score: ${review.score}/100`,
                `Date: ${new Date(review.createdAt).toLocaleString()}`,
                ``,
                `Summary: ${analysis.summary}`,
                ``,
                `Issues (${analysis.issues.length}):`,
                ...analysis.issues.map((i: Issue, idx: number) => `  ${idx + 1}. [${i.severity.toUpperCase()}] ${i.title} - ${i.description}`),
                ``,
                `Suggestions (${analysis.suggestions.length}):`,
                ...analysis.suggestions.map((s: Suggestion, idx: number) => `  ${idx + 1}. ${s.title} (${s.priority}) - ${s.description}`),
            ].join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `codelens-review-${review.id.slice(0, 8)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            return;
        }

        setExporting(true);
        try {
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const response = await fetch(`${API}/reviews/${review.id}/export`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `codelens-review-${review.id.slice(0, 8)}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error("PDF export failed:", err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                    <Link href="/review" style={{ fontSize: 13, color: "var(--accent-blue)", textDecoration: "none", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                        Back to Code Review
                    </Link>
                    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
                        Analysis Results
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                        <span style={{ fontFamily: "var(--font-mono)" }}>{review.title}</span> | {review.language} | {new Date(review.createdAt).toLocaleString()}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleExportPDF} disabled={exporting} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                        {exporting ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite" }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        )}
                        {exporting ? "Exporting..." : "Export PDF"}
                    </button>
                    <Link href="/review" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New Review
                    </Link>
                </div>
            </div>

            {/* Top Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 240px) 1fr", gap: 20, marginBottom: 24 }}>
                <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <ScoreGauge score={analysis.score} />
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>Code Quality Score</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                    <div className="glass-card" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#ef4444" }}>{criticalCount}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Critical Issues</div>
                    </div>
                    <div className="glass-card" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{warningCount}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Warnings</div>
                    </div>
                    <div className="glass-card" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#3b82f6" }}>{infoCount}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Info</div>
                    </div>
                    <div className="glass-card" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#10b981" }}>{analysis.suggestions.length}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Suggestions</div>
                    </div>
                    <div className="glass-card" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#8b5cf6" }}>{analysis.metrics.cyclomaticComplexity}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Complexity</div>
                    </div>
                    <div className="glass-card" style={{ padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: "#06b6d4" }}>{analysis.metrics.codeLines}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Lines of Code</div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="glass-card" style={{ padding: 20, marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--text-primary)" }}>Summary:</strong> {analysis.summary}
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: "flex", gap: 4, marginBottom: 20,
                borderBottom: "1px solid var(--border-color)", paddingBottom: 0,
            }}>
                {[
                    { key: "issues", label: `Issues (${analysis.issues.length})` },
                    { key: "suggestions", label: `Suggestions (${analysis.suggestions.length})` },
                    { key: "metrics", label: "Metrics" },
                    { key: "code", label: "Source Code" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: "10px 20px", fontSize: 13, fontWeight: 600,
                            background: "none", border: "none", cursor: "pointer",
                            color: activeTab === tab.key ? "var(--accent-blue)" : "var(--text-muted)",
                            borderBottom: activeTab === tab.key ? "2px solid var(--accent-blue)" : "2px solid transparent",
                            transition: "all 0.2s",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "issues" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {analysis.issues.length === 0 ? (
                        <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ marginBottom: 12 }}>
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <p style={{ fontSize: 16, fontWeight: 600 }}>No issues found!</p>
                            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Your code looks clean.</p>
                        </div>
                    ) : (
                        analysis.issues.map((issue, idx) => (
                            <div key={idx} className="glass-card" style={{ padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
                                <TypeIcon type={issue.type} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 15, fontWeight: 700 }}>{issue.title}</span>
                                        <SeverityBadge severity={issue.severity} />
                                        {issue.line && (
                                            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                                                Line {issue.line}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
                                        {issue.description}
                                    </p>
                                    <div style={{
                                        padding: "10px 14px", borderRadius: "var(--radius-sm)",
                                        background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)",
                                        fontSize: 13, color: "var(--accent-green)", lineHeight: 1.5,
                                        display: "flex", alignItems: "flex-start", gap: 8,
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: 2, flexShrink: 0 }}>
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                        </svg>
                                        <span><strong>Suggestion:</strong> {issue.suggestion}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "suggestions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {analysis.suggestions.map((sug, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 15, fontWeight: 700 }}>{sug.title}</span>
                                <PriorityBadge priority={sug.priority} />
                                <span className="badge badge-info" style={{ marginLeft: 4 }}>{sug.category}</span>
                            </div>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{sug.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "metrics" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                    {[
                        { label: "Cyclomatic Complexity", value: analysis.metrics.cyclomaticComplexity, iconType: "complexity", desc: analysis.metrics.cyclomaticComplexity > 10 ? "High complexity" : "Manageable" },
                        { label: "Function Count", value: analysis.metrics.functionCount, iconType: "functions", desc: `${analysis.metrics.functionCount} functions detected` },
                        { label: "Avg Function Length", value: `${analysis.metrics.avgFunctionLength} lines`, iconType: "length", desc: analysis.metrics.avgFunctionLength > 30 ? "Consider splitting" : "Good length" },
                        { label: "Code Lines", value: analysis.metrics.codeLines, iconType: "codelines", desc: "Total lines of code" },
                        { label: "Comment Lines", value: analysis.metrics.commentLines, iconType: "comments", desc: `${Math.round((analysis.metrics.commentLines / Math.max(1, analysis.metrics.codeLines)) * 100)}% comment ratio` },
                        { label: "Duplicate Patterns", value: analysis.metrics.duplicatePatterns, iconType: "duplicates", desc: analysis.metrics.duplicatePatterns > 0 ? "Possible duplication" : "No duplication detected" },
                    ].map((metric) => (
                        <div key={metric.label} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><MetricIcon type={metric.iconType} /></div>
                            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{metric.value}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{metric.label}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{metric.desc}</div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "code" && (
                <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
                        <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted)" }}>{review.title}</span>
                    </div>
                    <pre style={{
                        padding: 16, margin: 0, fontFamily: "var(--font-mono)", fontSize: 13,
                        lineHeight: 1.8, overflow: "auto", maxHeight: 500,
                        background: "var(--bg-primary)",
                    }}>
                        {review.code.split("\n").map((line, i) => (
                            <div key={i} style={{ display: "flex" }}>
                                <span style={{ color: "var(--text-muted)", minWidth: 40, userSelect: "none", textAlign: "right", paddingRight: 16 }}>{i + 1}</span>
                                <span>{line}</span>
                            </div>
                        ))}
                    </pre>
                </div>
            )}
            </main>
        </div>
    );
}
