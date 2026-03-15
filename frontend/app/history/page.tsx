"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function HistoryPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await api.get("/reviews");
                if (res.data && res.data.reviews) {
                    setReviews(res.data.reviews);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [router]);

    const filteredReviews = reviews.filter(r => 
        (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.language || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        setDeletingId(reviewId);
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review:", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
                <div className="animate-fade-in" style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
                            Review <span className="gradient-text">History</span>
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Access all your past code reviews and reports.</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ position: "relative" }}>
                            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search reviews..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: 40, width: 280 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-card animate-slide-up" style={{ padding: 0, animationDelay: "0.1s", opacity: 0 }}>
                    {loading ? (
                        <div style={{ padding: 24 }}>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12, borderRadius: 8 }} />
                            ))}
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div style={{ padding: "60px 24px", textAlign: "center" }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "50%", background: "var(--bg-secondary)",
                                display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid var(--border-color)"
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No reviews found</h3>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>We couldn&apos;t find any past reviews matching your criteria.</p>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-color)" }}>
                                <tr>
                                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Title</th>
                                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Language</th>
                                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Score</th>
                                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Date</th>
                                    <th style={{ padding: "16px 24px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map((review, i) => (
                                    <tr key={review.id} style={{ borderBottom: i < filteredReviews.length - 1 ? "1px solid var(--border-color)" : "none", transition: "background 0.2s" }} className="hover:bg-white/5">
                                        <td style={{ padding: "16px 24px" }}>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{review.title || 'Untitled Review'}</div>
                                            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{review.status === 'COMPLETED' ? 'Analyzed' : 'Pending'}</div>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            <span className="badge badge-info">{review.language || 'unknown'}</span>
                                        </td>
                                        <td style={{ padding: "16px 24px" }}>
                                            {review.score ? (
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                                                        <div style={{ height: "100%", width: `${review.score}%`, background: review.score > 80 ? "#34d399" : review.score > 60 ? "#fbbf24" : "#f87171" }} />
                                                    </div>
                                                    <span style={{ fontSize: 14, fontWeight: 600, color: review.score > 80 ? "#34d399" : review.score > 60 ? "#fbbf24" : "#f87171" }}>{review.score}</span>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>--</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--text-secondary)" }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Link href={`/review/${review.id}`} className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }}>
                                                    View Report
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(review.id)} 
                                                    disabled={deletingId === review.id}
                                                    style={{ 
                                                        padding: "6px 10px", fontSize: 12, background: "rgba(239,68,68,0.08)", 
                                                        border: "1px solid rgba(239,68,68,0.15)", borderRadius: "var(--radius-sm)",
                                                        color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center",
                                                        transition: "all 0.2s", opacity: deletingId === review.id ? 0.5 : 1,
                                                    }}
                                                    title="Delete review"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
