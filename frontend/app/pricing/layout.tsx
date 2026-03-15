import Link from "next/link";

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            {/* Navigation */}
            <nav className="glass" style={{ padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)" }}>
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white" }}>C</div>
                    <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>CodeLens<span style={{ color: "var(--accent-blue)" }}> AI</span></span>
                </Link>
                <Link href="/dashboard" className="btn-secondary" style={{ padding: "8px 20px", fontSize: 13 }}>Go to Dashboard</Link>
            </nav>
            {children}
        </div>
    );
}
