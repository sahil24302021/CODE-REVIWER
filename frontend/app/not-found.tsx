"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-primary)",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background effects */}
            <div className="orb orb-blue" style={{ width: 400, height: 400, top: "20%", left: "20%" }} />
            <div className="orb orb-purple" style={{ width: 300, height: 300, bottom: "20%", right: "20%" }} />

            <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "24px" }}>
                {/* 404 Number */}
                <div style={{
                    fontSize: "clamp(80px, 15vw, 160px)",
                    fontWeight: 900,
                    letterSpacing: "-0.06em",
                    lineHeight: 1,
                    marginBottom: 16,
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: 0.6,
                }}>
                    404
                </div>

                <h1 style={{
                    fontSize: "clamp(20px, 3vw, 32px)",
                    fontWeight: 800,
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                }}>
                    Page not found
                </h1>
                <p style={{
                    fontSize: 16,
                    color: "var(--text-secondary)",
                    maxWidth: 420,
                    margin: "0 auto 36px",
                    lineHeight: 1.6,
                }}>
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/" className="btn-primary" style={{ padding: "12px 28px" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Back to Home
                    </Link>
                    <Link href="/dashboard" className="btn-secondary" style={{ padding: "12px 28px" }}>
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
