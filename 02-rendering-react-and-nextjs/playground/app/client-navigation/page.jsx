"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClientNavigationPage() {
  const [draftMemo, setDraftMemo] = useState("Important notes about project deadline...");
  const [navigationType, setNavigationType] = useState("soft");

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 20: Client Navigation & Viewport Prefetching</h1>
        <span className="badge badge-blue">Next.js Router</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        In Next.js App Router, page transitions do not execute traditional hard browser reloads.
        Next.js uses <strong>Soft Client-Side Navigation</strong>: only the route segment that changed is swapped,
        and layouts retain their client state!
      </p>

      {/* State Preservation Lab */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Live State Preservation Lab</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Type some text in the memo below, then navigate to test if state is preserved:
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
            In-Memory Client Draft (Managed by useState):
          </label>
          <input
            type="text"
            value={draftMemo}
            onChange={(e) => setDraftMemo(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "10px 14px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "#fff",
            }}
          />
        </div>

        {/* Navigation Triggers */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <Link
              href="/csr"
              className="button"
              style={{ background: "var(--accent-green)", color: "#fff", textDecoration: "none", display: "inline-block" }}
            >
              Test Soft Navigation: &lt;Link href=&quot;/csr&quot;&gt;
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-green)", marginTop: "4px" }}>
              ⚡ Prefetches in viewport &bull; Instant diff transition
            </div>
          </div>

          <div>
            <a
              href="/csr"
              className="button"
              style={{ background: "var(--accent-red)", color: "#fff", textDecoration: "none", display: "inline-block" }}
            >
              Test Hard Reload: &lt;a href=&quot;/csr&quot;&gt;
            </a>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-red)", marginTop: "4px" }}>
              ⚠️ Full page reload &bull; Flashes white &bull; Resets state
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive on Prefetching */}
      <div className="card">
        <h2 className="card-title">How Next.js Viewport Prefetching Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ padding: "14px", background: "var(--bg-page)", borderRadius: "8px" }}>
            <h4 style={{ color: "var(--accent-blue)", margin: "0 0 6px 0" }}>1. Static Routes (Full Prefetch)</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Whenever a <code>&lt;Link&gt;</code> enters the user&apos;s viewport, Next.js preloads the entire RSC payload and HTML into browser memory ahead of time.
              When the user clicks, latency is literally <strong>0ms</strong>!
            </p>
          </div>

          <div style={{ padding: "14px", background: "var(--bg-page)", borderRadius: "8px" }}>
            <h4 style={{ color: "var(--accent-purple)", margin: "0 0 6px 0" }}>2. Dynamic Routes (Shell Prefetch)</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              For dynamic routes, Next.js prefetches the shared layout and loading skeleton up to the nearest <code>loading.js</code> boundary, ensuring immediate visual feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

