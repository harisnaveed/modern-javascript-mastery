"use client";

import { useState } from "react";
import Link from "next/link";

export default function PartialPrerenderingPage() {
  const [strategy, setStrategy] = useState("ppr"); // "ppr" or "legacy-ssr"
  const [streamProgress, setStreamProgress] = useState("complete"); // "idle", "shell", "streaming", "complete"

  function simulateLoad(mode) {
    setStrategy(mode);
    setStreamProgress("idle");

    if (mode === "ppr") {
      // 1. Instant static shell in 50ms
      setTimeout(() => {
        setStreamProgress("shell");
        // 2. Dynamic holes stream in 1000ms later
        setTimeout(() => {
          setStreamProgress("complete");
        }, 1200);
      }, 50);
    } else {
      // Legacy SSR: Entire page blocked until slowest query finishes
      setTimeout(() => {
        setStreamProgress("complete");
      }, 1250);
    }
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 18: Partial Prerendering (PPR)</h1>
        <span className="badge badge-green">Next.js 15 / React 19</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Partial Prerendering (PPR) combines the speed of static sites with the flexibility of dynamic server rendering.
        The static shell is pre-rendered at build time and served instantly from edge CDNs, while dynamic components 
        stream into <code>&lt;Suspense&gt;</code> holes in parallel!
      </p>

      {/* Simulation Controls */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Live Delivery Comparison Simulator</h2>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => simulateLoad("ppr")}
            className="button"
            style={{
              background: strategy === "ppr" ? "var(--accent-green)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            Run Partial Prerendering (Instant Shell + Streamed Holes)
          </button>
          <button
            onClick={() => simulateLoad("legacy-ssr")}
            className="button"
            style={{
              background: strategy === "legacy-ssr" ? "var(--accent-red)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            Run Legacy SSR (Entire Page Blocked for 1.2s)
          </button>
        </div>

        {/* Live Rendering Canvas */}
        <div
          style={{
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            minHeight: "260px",
          }}
        >
          {strategy === "legacy-ssr" && streamProgress !== "complete" ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
              <p style={{ color: "var(--accent-red)", fontWeight: 600 }}>
                Browser Waiting for Server Response (TTFB: 1,250ms)...
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                User stares at blank screen because database query for user cart is blocking the whole page.
              </p>
            </div>
          ) : (
            <div>
              {/* Static Shell (Delivered in 15ms) */}
              <div
                style={{
                  border: "2px dashed var(--accent-green)",
                  borderRadius: "6px",
                  padding: "12px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "var(--accent-green)" }}>⚡ STATIC SHELL (0ms TTFB from Edge CDN)</strong>
                  <span className="badge badge-green">Pre-rendered at Build Time</span>
                </div>
                <div style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                  Store Navbar &bull; Brand Logo &bull; Product Hero: <strong>Next.js 15 Mechanical Keyboard</strong>
                </div>
              </div>

              {/* Dynamic Streaming Hole 1: Inventory */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    border: "2px dashed var(--accent-amber)",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "var(--accent-amber)", fontWeight: 600 }}>
                    DYNAMIC HOLE 1: Real-Time Stock Status
                  </div>
                  {streamProgress === "complete" ? (
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "var(--accent-green)" }}>
                      ✅ 14 Units in Stock (Warehouse A)
                    </div>
                  ) : (
                    <div style={{ marginTop: "6px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      🌀 Streaming live stock from DB...
                    </div>
                  )}
                </div>

                {/* Dynamic Streaming Hole 2: Personalized Recommendations */}
                <div
                  style={{
                    border: "2px dashed var(--accent-blue)",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "var(--accent-blue)", fontWeight: 600 }}>
                    DYNAMIC HOLE 2: Personalized Discounts
                  </div>
                  {streamProgress === "complete" ? (
                    <div style={{ marginTop: "6px", fontWeight: 700, color: "var(--accent-blue)" }}>
                      🎉 VIP Member 15% Off Applied!
                    </div>
                  ) : (
                    <div style={{ marginTop: "6px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      🌀 Resolving user cookie & recommendations...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Snippet */}
      <div className="card">
        <h2 className="card-title">How to Enable PPR in Next.js 15</h2>
        <pre
          style={{
            background: "var(--bg-page)",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            border: "1px solid var(--border)",
            overflowX: "auto",
          }}
        >
{`// app/products/[id]/page.jsx
import { Suspense } from "react";
import { StaticProductHero } from "./StaticHero";
import { DynamicStock, StockSkeleton } from "./DynamicStock";

export default function ProductPage({ params }) {
  return (
    <div>
      {/* 1. Static shell - bundled into static HTML at build time */}
      <StaticProductHero id={params.id} />

      {/* 2. Dynamic hole - streamed from server on request */}
      <Suspense fallback={<StockSkeleton />}>
        <DynamicStock id={params.id} />
      </Suspense>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

