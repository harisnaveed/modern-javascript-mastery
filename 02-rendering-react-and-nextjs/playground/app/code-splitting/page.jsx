"use client";

import { useState } from "react";
import Link from "next/link";

export default function CodeSplittingPage() {
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  function loadHeavyComponent() {
    setLoading(true);
    setTimeout(() => {
      setIsChartLoaded(true);
      setLoading(false);
    }, 800);
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 21: Code Splitting & Selective Hydration</h1>
        <span className="badge badge-green">Bundle Optimization</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Shipping large third-party libraries (e.g. Chart.js, Monaco Editor, Three.js) in the primary JavaScript bundle ruins Core Web Vitals.
        Using <strong>next/dynamic</strong> and React <strong>Selective Hydration</strong>, we defer downloading and hydrating non-critical code until the user actually interacts with it!
      </p>

      {/* Interactive Code Splitting Demo */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Dynamic Import & On-Demand Chunk Loading</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Notice how the initial page bundle remains tiny. The heavy analytical chunk is only requested when triggered:
        </p>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
          <button
            onClick={loadHeavyComponent}
            disabled={loading || isChartLoaded}
            className="button"
            style={{
              background: isChartLoaded ? "var(--accent-green)" : "var(--accent-blue)",
              color: "#fff",
            }}
          >
            {loading ? "Downloading Heavy Chunk (420 KB)..." : isChartLoaded ? "Chunk Loaded & Hydrated!" : "Load Heavy Analytics Engine"}
          </button>

          {isChartLoaded && (
            <button
              onClick={() => setIsChartLoaded(false)}
              className="button"
              style={{ background: "var(--bg-page)", border: "1px solid var(--border)", color: "#fff" }}
            >
              Unload
            </button>
          )}
        </div>

        {/* Dynamic Chunk Area */}
        <div
          style={{
            padding: "24px",
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            minHeight: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🌀</div>
              <p style={{ color: "var(--accent-blue)", fontSize: "0.9rem", margin: 0 }}>
                Loading chunk: <code>analytics-dashboard.chunk.js</code> via dynamic import...
              </p>
            </div>
          ) : isChartLoaded ? (
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <strong style={{ color: "var(--accent-green)" }}>📊 Real-Time Server Load Telemetry</strong>
                <span className="badge badge-green">420 KB Saved on Initial Load</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "6px" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Throughput</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>14,280 req/s</div>
                </div>
                <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "6px" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Avg Latency</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-green)" }}>12ms</div>
                </div>
                <div style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "6px" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Cache Hit Ratio</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-blue)" }}>99.2%</div>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
              Heavy analytical engine is dormant. Initial bundle is only <strong>32 KB</strong>!
            </p>
          )}
        </div>
      </div>

      {/* Code Pattern */}
      <div className="card">
        <h2 className="card-title">Production Pattern with next/dynamic</h2>
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
{`import dynamic from "next/dynamic";

// 1. Splitting heavy client components into independent chunks:
const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  ssr: false, // Disables server rendering if module requires window/WebGL
  loading: () => <p>Loading chart chunk...</p>,
});

export default function AnalyticsPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <HeavyChart />}
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}
