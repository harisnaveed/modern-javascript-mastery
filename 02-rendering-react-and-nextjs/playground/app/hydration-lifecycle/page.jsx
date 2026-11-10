"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HydrationLifecyclePage() {
  const [hydrationPhase, setHydrationPhase] = useState("html-only"); // "html-only", "downloading", "hydrated"
  const [clickAttempts, setClickAttempts] = useState(0);
  const [successfulClicks, setSuccessfulClicks] = useState(0);

  function simulateTimeline() {
    setHydrationPhase("html-only");
    setClickAttempts(0);
    setSuccessfulClicks(0);

    setTimeout(() => {
      setHydrationPhase("downloading");
      setTimeout(() => {
        setHydrationPhase("hydrated");
      }, 1500);
    }, 1500);
  }

  function handleButtonClick() {
    setClickAttempts((c) => c + 1);
    if (hydrationPhase === "hydrated") {
      setSuccessfulClicks((s) => s + 1);
    }
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 12: Hydration Lifecycle & The Uncanny Valley</h1>
        <span className="badge badge-amber">SSR Overhead</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Server-Side Rendering produces plain, dead HTML text. <strong>Hydration</strong> is the process where the browser
        downloads JavaScript, executes your React components in memory, matches the VDOM to existing HTML DOM nodes,
        and finally attaches interactive event listeners.
      </p>

      {/* Interactive Uncanny Valley Simulation */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">The "Uncanny Valley" Simulator</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          The Uncanny Valley is the awkward delay where a page looks fully loaded, but user clicks do nothing because JavaScript hasn't attached event listeners yet!
        </p>

        <button
          onClick={simulateTimeline}
          className="button"
          style={{ background: "var(--accent-blue)", color: "#fff", marginBottom: "20px" }}
        >
          &rarr; Replay Server Load & Hydration Timeline
        </button>

        {/* Phase Indicators */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <div
            style={{
              padding: "14px",
              borderRadius: "8px",
              background: hydrationPhase === "html-only" ? "rgba(245, 158, 11, 0.2)" : "var(--bg-page)",
              border: hydrationPhase === "html-only" ? "2px solid var(--accent-amber)" : "1px solid var(--border)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Phase 1: Server HTML</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              0ms - 200ms: Static HTML painted. Zero listeners attached.
            </div>
          </div>

          <div
            style={{
              padding: "14px",
              borderRadius: "8px",
              background: hydrationPhase === "downloading" ? "rgba(59, 130, 246, 0.2)" : "var(--bg-page)",
              border: hydrationPhase === "downloading" ? "2px solid var(--accent-blue)" : "1px solid var(--border)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Phase 2: JS Downloading</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              200ms - 800ms: Browser downloads and parses React bundles.
            </div>
          </div>

          <div
            style={{
              padding: "14px",
              borderRadius: "8px",
              background: hydrationPhase === "hydrated" ? "rgba(16, 185, 129, 0.2)" : "var(--bg-page)",
              border: hydrationPhase === "hydrated" ? "2px solid var(--accent-green)" : "1px solid var(--border)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Phase 3: Hydrated!</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Event listeners attached. Page is fully interactive!
            </div>
          </div>
        </div>

        {/* Live Interaction Target */}
        <div
          style={{
            padding: "24px",
            background: "var(--bg-page)",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid var(--border)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
            Current Status:{" "}
            <strong style={{ color: hydrationPhase === "hydrated" ? "var(--accent-green)" : "var(--accent-amber)" }}>
              {hydrationPhase === "hydrated" ? "INTERACTIVE (Listeners Attached)" : "UNHYDRATED (Clicks Lost)"}
            </strong>
          </p>

          <button
            onClick={handleButtonClick}
            className="button"
            style={{
              background: hydrationPhase === "hydrated" ? "var(--accent-green)" : "#475569",
              color: "#fff",
              padding: "12px 24px",
              fontSize: "1rem",
              cursor: hydrationPhase === "hydrated" ? "pointer" : "not-allowed",
            }}
          >
            {hydrationPhase === "hydrated" ? "Click to Add to Cart" : "Attempting Click (Dead HTML)..."}
          </button>

          <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "24px" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Click Attempts:</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{clickAttempts}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Registered Cart Additions:</span>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-green)" }}>{successfulClicks}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Insights */}
      <div className="card">
        <h2 className="card-title">How React Server Components (RSC) Solve This</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
          In traditional SSR, <strong>every single component</strong> on the page had to be hydrated in JavaScript,
          even if it was a completely static footer or article body. Next.js 15 App Router uses <strong>React Server Components (RSC)</strong>
          which render on the server with <strong>0 KB of JavaScript shipped to the client</strong>. Only components marked with
          <code>&ldquo;use client&rdquo;</code> undergo hydration, drastically shrinking the Uncanny Valley!
        </p>
      </div>
    </div>
  );
}

