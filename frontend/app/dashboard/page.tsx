"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import api from "@/services/api";

interface DashboardStats {
    totalReviews: number;
    avgScore: number;
    issuesFound: number;
    issuesFixed: number;
    reviewsThisMonth: number;
    scoreImprovement: number;
}

interface RecentReview {
    id: string;
    title: string;
    language: string;
    status: string;
    score: number | null;
    createdAt: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
    const [loading, setLoading] = useState(true);

    const userName = session?.user?.name || "Developer";

    // Auth guard — redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;

        const fetchDashboardData = async () => {
            try {
                const [statsRes, reviewsRes] = await Promise.all([
                    api.get("/analytics/overview").catch(() => null),
                    api.get("/reviews").catch(() => null)
                ]);

                if (statsRes?.data) {
                    setStats(statsRes.data);
                } else {
                    setStats({ totalReviews: 0, avgScore: 0, issuesFound: 0, issuesFixed: 0, reviewsThisMonth: 0, scoreImprovement: 0 });
                }

                if (reviewsRes?.data?.reviews) {
                    setRecentReviews(reviewsRes.data.reviews.slice(0, 5));
                } else {
                    setRecentReviews([]);
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
                setStats({ totalReviews: 0, avgScore: 0, issuesFound: 0, issuesFixed: 0, reviewsThisMonth: 0, scoreImprovement: 0 });
                setRecentReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [status]);

    const statCards = [
        { title: "Total Reviews", value: stats?.totalReviews || 0, color: "blue", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
        { title: "Avg. Quality Score", value: stats?.avgScore || 0, color: "green", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
        { title: "Issues Found", value: stats?.issuesFound || 0, color: "red", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z" /><path d="M12 20v-9" /></svg> },
        { title: "Issues Resolved", value: stats?.issuesFixed || 0, color: "yellow", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
    ];

    // Show loading while checking auth
    if (status === "loading") {
        return (
            <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
                <Sidebar />
                <main className="main-content" style={{ flex: 1, padding: "48px 56px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ animation: "spin-slow 1s linear infinite", marginBottom: 16 }}><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Loading dashboard...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
            <Sidebar />
            
            <main className="main-content" style={{ flex: 1, padding: "48px 56px", position: "relative", zIndex: 1 }}>
                {/* Premium Background Ambient Glow */}
                <div style={{ position: "absolute", top: -100, left: '20%', width: 600, height: 600, background: "radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)", zIndex: -1, pointerEvents: 'none' }} />

                {/* Header Sequence */}
                <div className="animate-fade-in" style={{ marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8, color: "var(--text-primary)" }}>
                            Overview
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 15, fontWeight: 400 }}>
                            Welcome back, <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{userName}</span>. Here is your code intelligence summary.
                        </p>
                    </div>
                    
                    <div style={{ display: "flex", gap: 12 }}>
                        <Link href="/repositories" className="btn-secondary" style={{ padding: "10px 18px", fontSize: 13, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                           Manage Repositories
                        </Link>
                        <Link href="/review" className="btn-primary" style={{ padding: "10px 20px", fontSize: 13, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}>
                            + New Code Review
                        </Link>
                    </div>
                </div>

                {/* Stats Grid - Ultra Premium */}
                <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40 }}>
                    {loading ? (
                        [...Array(4)].map((_, i) => <div key={i} className="glass-card skeleton" style={{ height: 130 }} />)
                    ) : (
                        statCards.map((stat, i) => (
                            <div key={i} className="glass-card stat-card" style={{ 
                                padding: 24, 
                                background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                {/* Subtle Top Highlight */}
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
                                
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.title}</h3>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: stat.color === "blue" ? "#60a5fa" : stat.color === "green" ? "#34d399" : stat.color === "red" ? "#f87171" : "#fbbf24",
                                    }}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                                    <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", lineHeight: 1 }}>{stat.value}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "flex-start" }}>
                    
                    {/* Main Feed: Recent Reviews */}
                    <div className="glass-card animate-slide-up" style={{ 
                        padding: 0, animationDelay: "0.2s", opacity: 0, 
                        background: "var(--bg-secondary)", 
                        border: "1px solid rgba(255,255,255,0.04)",
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)"
                    }}>
                        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Intelligence Feed</h2>
                            <Link href="/history" style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }} className="hover:text-white">View All History →</Link>
                        </div>
                        
                        <div style={{ padding: "8px 0" }}>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} style={{ padding: "20px 24px", display: "flex", gap: 16 }}>
                                        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
                                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                                            <div className="skeleton" style={{ width: "40%", height: 16 }} />
                                            <div className="skeleton" style={{ width: "25%", height: 12 }} />
                                        </div>
                                    </div>
                                ))
                            ) : recentReviews.length === 0 ? (
                                <div style={{ padding: "60px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.02)",
                                        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px dashed rgba(255,255,255,0.1)"
                                    }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    </div>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>No intelligence gathered yet.</h3>
                                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, maxWidth: 300 }}>Run your first AI-powered code review to start seeing security and quality insights.</p>
                                    <Link href="/review" className="btn-primary" style={{ padding: "10px 24px" }}>Start Review</Link>
                                </div>
                            ) : (
                                recentReviews.map((review, i) => (
                                    <Link href={`/review/${review.id}`} key={i} style={{
                                        padding: "20px 24px", borderBottom: i < recentReviews.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                                        display: "flex", alignItems: "center", gap: 16,
                                        transition: "all 0.2s", textDecoration: "none"
                                    }} className="hover:bg-[rgba(255,255,255,0.02)] block group">
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", transition: "all 0.2s"
                                        }} className="group-hover:text-blue-400 group-hover:border-blue-500/20 group-hover:bg-blue-500/10">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                                                {review.title || "Untitled Intelligence Review"}
                                                {review.status === "COMPLETED" ? (
                                                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 12, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.15)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Analyzed</span>
                                                ) : (
                                                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 12, background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.15)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Processing</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 12 }}>
                                                <span>Language: <strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{review.language || "unknown"}</strong></span>
                                                <span style={{ opacity: 0.5 }}>•</span>
                                                <span>{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                            </div>
                                        </div>
                                        {review.score !== null && (
                                           <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                <span style={{ fontSize: 18, fontWeight: 700, color: review.score >= 80 ? "#34d399" : review.score >= 60 ? "#fbbf24" : "#f87171" }}>{review.score}</span>
                                                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Score</span>
                                           </div>
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column Metrics */}
                    <div className="animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: 24, animationDelay: "0.3s", opacity: 0 }}>
                        
                        {/* Overall Quality Ring Widget */}
                        <div className="glass-card" style={{ padding: 32, textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 32 }}>Global Quality Index</h3>
                            
                            <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px" }}>
                                <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
                                    {/* Background Track */}
                                    <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                                    {/* Inner Subtle Ring */}
                                    <circle cx="90" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="1" />
                                    
                                    {!loading && (
                                        <circle 
                                            cx="90" cy="90" r="80" fill="none" 
                                            stroke="url(#score-gradient)" strokeWidth="12" 
                                            strokeDasharray="502" 
                                            strokeDashoffset={502 - (502 * (stats?.avgScore || 0)) / 100}
                                            strokeLinecap="round" 
                                            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                                        />
                                    )}
                                    <defs>
                                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#60a5fa" />
                                            <stop offset="50%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#1d4ed8" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{
                                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center"
                                }}>
                                    {loading ? (
                                        <div className="skeleton" style={{ width: 60, height: 48, borderRadius: 8 }} />
                                    ) : (
                                        <>
                                            <span style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--text-primary)", textShadow: "0 0 40px rgba(59,130,246,0.3)" }}>{stats?.avgScore || 0}</span>
                                            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginTop: 4, letterSpacing: "0.1em" }}>OUT OF 100</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {!loading && (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.1)" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>Top 5% Architectural Quality</span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
