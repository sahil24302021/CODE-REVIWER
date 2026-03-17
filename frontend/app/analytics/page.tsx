"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/services/api";

interface OverviewData {
    totalReviews: number;
    avgScore: number;
    issuesFound: number;
    issuesFixed: number;
    reviewsThisMonth: number;
    scoreImprovement: number;
}

interface TrendsData {
    qualityTrend: { date: string; score: number }[];
    commonIssues: { name: string; count: number }[];
    languageStats: { name: string; value: number }[];
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { status } = useSession();
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [trends, setTrends] = useState<TrendsData | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status !== "authenticated") return;

        const fetchData = async () => {
            try {
                const [overviewRes, trendsRes] = await Promise.all([
                    api.get("/analytics/overview").catch(() => null),
                    api.get("/analytics/trends").catch(() => null),
                ]);
                if (overviewRes?.data) setOverview(overviewRes.data);
                if (trendsRes?.data) setTrends(trendsRes.data);
            } catch (error) {
                console.error("Analytics fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [status, router]);

    const scoreData = trends?.qualityTrend?.length
        ? trends.qualityTrend.map(t => t.score)
        : [65, 70, 72, 68, 79, 81, 85, 84, 88, 91, 89, 93, 95];

    const issueData = trends?.commonIssues?.length
        ? trends.commonIssues
        : [
            { name: "Code Style & Formatting", count: 145 },
            { name: "Performance Bottlenecks", count: 82 },
            { name: "Security Vulnerabilities", count: 34 },
            { name: "Logic Errors", count: 21 },
        ];

    const maxIssue = Math.max(...issueData.map(i => i.count), 1);
    const issueColors = ["#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#10b981"];

    const langData = trends?.languageStats?.length
        ? trends.languageStats
        : [{ name: "JavaScript", value: 45 }, { name: "TypeScript", value: 30 }, { name: "Python", value: 15 }, { name: "Go", value: 10 }];

    const langColors = ["#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6"];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
                        Project <span className="gradient-text">Analytics</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Deep dive into your code quality trends over time.</p>
                </div>

                {/* Quick Stats Row */}
                {overview && !loading && (
                    <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
                        {[
                            { label: "Total Reviews", value: overview.totalReviews, color: "#3b82f6" },
                            { label: "Avg Score", value: overview.avgScore, color: "#10b981" },
                            { label: "Issues Found", value: overview.issuesFound, color: "#ef4444" },
                            { label: "Issues Fixed", value: overview.issuesFixed, color: "#f59e0b" },
                            { label: "This Month", value: overview.reviewsThisMonth, color: "#8b5cf6" },
                        ].map((s, i) => (
                            <div key={i} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
                                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                    {loading ? (
                        [...Array(2)].map((_, i) => (
                            <div key={i} className="glass-card skeleton" style={{ height: 320 }} />
                        ))
                    ) : (
                        <>
                            {/* Quality Score Trend Chart */}
                            <div className="glass-card" style={{ padding: 32 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Quality Score Trend</h3>
                                        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Average score across all analyzed code.</p>
                                    </div>
                                </div>
                                <div style={{ height: 260, position: "relative", display: "flex", alignItems: "flex-end", gap: "2%", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16 }}>
                                    {scoreData.map((val, i) => (
                                        <div key={i} style={{
                                            flex: 1, height: `${val}%`,
                                            background: val > 80 ? "var(--gradient-success)" : val > 70 ? "var(--gradient-primary)" : "var(--gradient-warm)",
                                            borderRadius: "4px 4px 0 0", minWidth: 10, position: "relative", opacity: 0.85,
                                            transition: "opacity 0.2s",
                                        }}>
                                            <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "var(--text-secondary)" }}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                {/* Top Issues */}
                                <div className="glass-card" style={{ padding: 32 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Top Issues by Type</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {issueData.map((item, i) => (
                                            <div key={i}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
                                                    <span>{item.name}</span>
                                                    <span style={{ color: "var(--text-muted)" }}>{item.count}</span>
                                                </div>
                                                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${(item.count / maxIssue) * 100}%`, background: issueColors[i % issueColors.length], borderRadius: 3, transition: "width 0.5s" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Language Distribution */}
                                <div className="glass-card" style={{ padding: 32 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Languages Reviewed</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {langData.map((lang, i) => (
                                            <div key={i}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
                                                    <span>{lang.name}</span>
                                                    <span style={{ color: "var(--text-muted)" }}>{lang.value}%</span>
                                                </div>
                                                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${lang.value}%`, background: langColors[i % langColors.length], borderRadius: 3, transition: "width 0.5s" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Insight Card */}
                            <div className="glass-card" style={{ padding: 32, background: "var(--gradient-primary)", color: "white", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }} />
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Weekly Insight</h3>
                                <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>
                                    {overview && overview.totalReviews > 0
                                        ? `You've completed ${overview.totalReviews} reviews with an average score of ${overview.avgScore}/100. ${overview.issuesFixed} issues have been addressed. Keep improving!`
                                        : "Start reviewing code to see insights about your code quality trends, common issues, and improvement areas."
                                    }
                                </p>
                                <button onClick={() => router.push("/review")} style={{ background: "white", color: "#3b82f6", border: "none", padding: "10px 20px", borderRadius: "100px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                                    {overview && overview.totalReviews > 0 ? "View Details" : "Start First Review"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
