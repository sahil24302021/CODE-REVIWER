"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/services/api";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status, update } = useSession();
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Initialize state from session
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            setUser(session?.user);
            setName(session?.user?.name || "");
            setLoading(false);
        }
    }, [status, session, router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put("/auth/profile", { name });
            setUser(res.data.user);
            update({ name: res.data.user.name }); // Update NextAuth session
            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main className="main-content" style={{ flex: 1 }}>
                <div className="animate-fade-in" style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
                        Account <span className="gradient-text">Settings</span>
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Manage your profile, API keys, and subscription.</p>
                </div>

                <div className="stagger-children" style={{ maxWidth: 800 }}>
                    {loading ? (
                        <div className="glass-card skeleton" style={{ height: 300 }} />
                    ) : (
                        <>
                            {/* Profile Section */}
                            <div className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Personal Information</h3>
                                {message && (
                                    <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, color: "#34d399", fontSize: 13, marginBottom: 20 }}>
                                        {message}
                                    </div>
                                )}
                                <form onSubmit={handleSaveProfile}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Full Name</label>
                                            <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>Email Address</label>
                                            <input type="text" className="input-field" value={user?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: 20, marginTop: 10 }}>
                                        <button type="submit" className="btn-primary" disabled={saving}>
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Plan Section */}
                            <div className="glass-card" style={{ padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Subscription Plan</h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span className="badge badge-info" style={{ fontSize: 12, padding: "4px 12px" }}>{user?.plan || "Free"}</span>
                                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Current billing cycle ends on Apr 15, 2026</span>
                                    </div>
                                </div>
                                <button className="btn-secondary">Manage Billing</button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
