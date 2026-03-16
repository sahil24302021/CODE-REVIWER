"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const userName = session?.user?.name || "Developer";
    const userEmail = session?.user?.email || "";

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
        { name: "Code Review", path: "/review", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> },
        { name: "History", path: "/history", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
        { name: "Repositories", path: "/repositories", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> },
        { name: "PR Review", path: "/pr-review", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></svg> },
        { name: "Analytics", path: "/analytics", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
        { name: "Settings", path: "/settings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> },
    ];

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "var(--gradient-primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "white",
                }}>C</div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>CodeLens <span style={{ color: "#818cf8" }}>AI</span></div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 16px", marginBottom: 8 }}>
                    Main Menu
                </div>
                {navItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                    return (
                        <Link key={item.path} href={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                            <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}

                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 16px", marginTop: 24, marginBottom: 8 }}>
                    Account
                </div>
                {navItems.slice(5).map((item) => {
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                    return (
                        <Link key={item.path} href={item.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                            <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Pro Upgrade & User Profile */}
            <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="glass-card" style={{ padding: 16, marginBottom: 16, background: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.15)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Upgrade to Pro</div>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 12 }}>Unlimited reviews, GitHub scanning & more</p>
                    <Link href="/pricing" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "8px 0", fontSize: 12 }}>
                        Upgrade Now
                    </Link>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {session?.user?.image ? (
                            <img 
                                src={session.user.image} 
                                alt={userName}
                                style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                }}
                            />
                        ) : (
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, fontWeight: 700, color: "white",
                            }}>
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontSize: 13, fontWeight: 600, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", maxWidth: 120 }}>
                                {userName}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Free Plan</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        title="Sign Out"
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--text-muted)", padding: 6, borderRadius: 6,
                            transition: "background 0.2s"
                        }}
                        className="hover:bg-white/10 hover:text-white"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
