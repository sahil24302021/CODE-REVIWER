"use client";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
    const [annual, setAnnual] = useState(true);

    return (
        <div style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Upgrade Your Development</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 600, margin: "0 auto", marginBottom: 32 }}>
                    Choose a plan that fits your team&apos;s needs. Scale your code reviews with AI.
                </p>

                {/* Toggle */}
                <div style={{ display: "inline-flex", background: "var(--bg-card)", padding: 4, borderRadius: 100, border: "1px solid var(--border-color)" }}>
                    <button onClick={() => setAnnual(false)} style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: !annual ? "rgba(59,130,246,0.15)" : "transparent", color: !annual ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>Monthly</button>
                    <button onClick={() => setAnnual(true)} style={{ padding: "10px 24px", borderRadius: 100, border: "none", background: annual ? "rgba(59,130,246,0.15)" : "transparent", color: annual ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
                        Annually <span style={{ color: "var(--accent-green)", fontSize: 12, marginLeft: 4 }}>Save 20%</span>
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
                {/* Free Tier */}
                <div className="glass-card" style={{ padding: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Hobby</h2>
                    <div style={{ fontSize: 14, color: "var(--text-secondary)", minHeight: 48 }}>For individual developers trying out AI code reviews.</div>
                    <div style={{ margin: "24px 0 32px" }}>
                        <span style={{ fontSize: 48, fontWeight: 800 }}>$0</span>
                        <span style={{ color: "var(--text-muted)" }}>/forever</span>
                    </div>
                    <Link href="/signup" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, marginBottom: 32 }}>Current Plan</Link>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                        {["5 code reviews per month", "Basic bug detection", "Score & metrics", "Web upload only", "Community support"].map(f => (
                            <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "var(--text-secondary)" }}><span style={{ color: "var(--text-muted)" }}>✓</span> {f}</li>
                        ))}
                    </ul>
                </div>

                {/* Pro Tier */}
                <div className="glass-card" style={{ padding: 40, border: "2px solid var(--accent-blue)", position: "relative", transform: "scale(1.05)", background: "rgba(17,24,39,0.9)" }}>
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--gradient-primary)", padding: "6px 20px", borderRadius: 100, color: "white", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>Most Popular</div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Pro</h2>
                    <div style={{ fontSize: 14, color: "var(--text-secondary)", minHeight: 48 }}>For professional developers who want to ship faster.</div>
                    <div style={{ margin: "24px 0 32px" }}>
                        <span style={{ fontSize: 48, fontWeight: 800 }}>${annual ? "19" : "24"}</span>
                        <span style={{ color: "var(--text-muted)" }}>/month</span>
                    </div>
                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, marginBottom: 32, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}>Upgrade to Pro</button>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            "Unlimited code reviews", "GitHub repository integration", "Automated PR reviews", "Advanced security scanning",
                            "PDF report exports", "Performance suggestions", "Priority email support"
                        ].map(f => (
                            <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}><span style={{ color: "var(--accent-blue)" }}>✓</span> {f}</li>
                        ))}
                    </ul>
                </div>

                {/* Team Tier */}
                <div className="glass-card" style={{ padding: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Team</h2>
                    <div style={{ fontSize: 14, color: "var(--text-secondary)", minHeight: 48 }}>For engineering teams and organizations.</div>
                    <div style={{ margin: "24px 0 32px" }}>
                        <span style={{ fontSize: 48, fontWeight: 800 }}>${annual ? "49" : "59"}</span>
                        <span style={{ color: "var(--text-muted)" }}>/user/mo</span>
                    </div>
                    <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, marginBottom: 32 }}>Contact Sales</button>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                        {["Everything in Pro", "Team collaboration workflows", "Custom AI instructions", "CI/CD pipeline integrations", "SSO & SAML authentication", "SLA guarantee", "Dedicated account manager"].map(f => (
                            <li key={f} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "var(--text-secondary)" }}><span style={{ color: "var(--accent-purple)" }}>✓</span> {f}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
