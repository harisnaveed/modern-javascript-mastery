"use client";

import { useState } from "react";
import Link from "next/link";

export default function CachingLayersPage() {
  const [activeLayer, setActiveLayer] = useState("all");
  const [invalidationLog, setInvalidationLog] = useState([]);

  function logInvalidation(action, target) {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      action,
      target,
    };
    setInvalidationLog((prev) => [entry, ...prev.slice(0, 4)]);
  }

  const layers = [
    {
      id: "layer1",
      name: "1. Request Memoization",
      where: "Server (React per-render)",
      purpose: "Dedupes identical fetch() calls within the same render pass.",
      duration: "Lifecycle of a single server request",
      invalidation: "Automatic (reset when request completes)",
    },
    {
      id: "layer2",
      name: "2. Data Cache",
      where: "Server (Persistent Next.js cache)",
      purpose: "Persists HTTP fetch responses across multiple incoming requests.",
      duration: "Persistent across requests and deployments",
      invalidation: "revalidateTag('tag') or time-based revalidate: 60",
    },
    {
      id: "layer3",
      name: "3. Full Route Cache",
      where: "Server (HTML & RSC Payload)",
      purpose: "Caches the entire static route output on the server/CDN.",
      duration: "Persistent until data cache is invalidated",
      invalidation: "revalidatePath('/route') or new deployment",
    },
    {
      id: "layer4",
      name: "4. Router Cache",
      where: "Client Browser (In-Memory)",
      purpose: "Stores RSC payloads in the browser during the user session.",
      duration: "Session memory (30s dynamic, 5m static)",
      invalidation: "router.refresh() or cookies.set() in Server Action",
    },
  ];

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 19: Next.js 4 Caching Layers</h1>
        <span className="badge badge-amber">Cache Architecture</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Next.js features four distinct, coordinated caching mechanisms operating across the server and browser.
        Mastering where each cache lives and how to selectively invalidate them is critical for preventing stale data bugs.
      </p>

      {/* Interactive Invalidation Lab */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Cache Invalidation Simulator</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Trigger server actions to observe which caching layers are purged:
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button
            onClick={() => logInvalidation("Deduplicated identical fetch() calls", "Layer 1: Request Memoization")}
            className="button"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            Run Duplicate fetch() (Layer 1 Dedupe)
          </button>
          <button
            onClick={() => logInvalidation("Executed revalidateTag('products')", "Layer 2 (Data Cache) & Layer 3 (Full Route)")}
            className="button"
            style={{ background: "var(--accent-amber)", color: "#fff" }}
          >
            revalidateTag(&#39;products&#39;)
          </button>
          <button
            onClick={() => logInvalidation("Triggered router.refresh()", "Layer 4: Browser Router Cache")}
            className="button"
            style={{ background: "var(--accent-purple)", color: "#fff" }}
          >
            router.refresh() (Client Cache Purge)
          </button>
        </div>

        {/* Invalidation Event Log */}
        {invalidationLog.length > 0 && (
          <div
            style={{
              background: "var(--bg-page)",
              padding: "12px 16px",
              borderRadius: "6px",
              marginBottom: "20px",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--accent-green)", fontWeight: 600, marginBottom: "6px" }}>
              LIVE CACHE PURGE ACTIVITY:
            </div>
            {invalidationLog.map((log) => (
              <div key={log.id} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                <span style={{ color: "#94a3b8" }}>[{log.time}]</span>{" "}
                <strong style={{ color: "#fff" }}>{log.action}</strong> &rarr; Purged:{" "}
                <span style={{ color: "var(--accent-amber)" }}>{log.target}</span>
              </div>
            ))}
          </div>
        )}

        {/* 4 Layers Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {layers.map((layer) => (
            <div
              key={layer.id}
              style={{
                padding: "16px",
                background: "var(--bg-page)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ fontSize: "1rem", color: "var(--accent-blue)", margin: "0 0 4px 0" }}>
                {layer.name}
              </h3>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Location: <strong>{layer.where}</strong>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 10px 0" }}>
                {layer.purpose}
              </p>
              <div style={{ fontSize: "0.75rem", borderTop: "1px solid #1e293b", paddingTop: "8px" }}>
                <span style={{ color: "var(--accent-amber)" }}>Purged via:</span> {layer.invalidation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
