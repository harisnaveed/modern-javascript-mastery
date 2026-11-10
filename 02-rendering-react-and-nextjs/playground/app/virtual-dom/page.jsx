"use client";

import { useState } from "react";
import Link from "next/link";

export default function VirtualDomPage() {
  const [badgeText, setBadgeText] = useState("Active");
  const [count, setCount] = useState(1);
  const [isUrgent, setIsUrgent] = useState(false);

  // Simulated VDOM Representation
  const currentVdom = {
    type: "div",
    props: { className: "user-card" },
    children: [
      { type: "h3", props: { id: "user-name" }, children: ["Engineering Team Alpha"] },
      {
        type: "span",
        props: { className: isUrgent ? "badge badge-red" : "badge badge-green" },
        children: [badgeText],
      },
      {
        type: "p",
        props: { className: "metric" },
        children: [`Sprint Iteration: ${count}`],
      },
    ],
  };

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 03: Virtual DOM & Declarative UI</h1>
        <span className="badge badge-purple">In-Memory Tree</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        The Virtual DOM is not magical C++ code—it is simply a plain JavaScript object representing what the UI should look like.
        When state changes, React creates a new VDOM object tree, compares it against the previous one, and calculates the minimal real DOM mutations.
      </p>

      {/* Interactive Controls */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Live State Controls</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="button"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            Increment Iteration (+1)
          </button>
          <button
            onClick={() => setBadgeText((t) => (t === "Active" ? "Paused" : "Active"))}
            className="button"
            style={{ background: "var(--accent-purple)", color: "#fff" }}
          >
            Toggle Status ({badgeText})
          </button>
          <button
            onClick={() => setIsUrgent((u) => !u)}
            className="button"
            style={{ background: isUrgent ? "var(--accent-red)" : "var(--accent-amber)", color: "#fff" }}
          >
            Toggle Urgency ({isUrgent ? "URGENT" : "NORMAL"})
          </button>
        </div>

        {/* Live UI vs VDOM Tree Side-by-Side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Rendered Component */}
          <div>
            <h3 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              1. Rendered Real DOM View:
            </h3>
            <div
              style={{
                padding: "20px",
                background: "var(--bg-page)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>Engineering Team Alpha</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span className={`badge ${isUrgent ? "badge-red" : "badge-green"}`}>
                  {badgeText}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Priority: {isUrgent ? "High" : "Standard"}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--accent-blue)", fontWeight: 600 }}>
                Sprint Iteration: {count}
              </p>
            </div>

            <div style={{ marginTop: "16px", padding: "12px", background: "var(--bg-page)", borderRadius: "6px" }}>
              <strong style={{ fontSize: "0.85rem", color: "var(--accent-green)" }}>Diff Engine Result:</strong>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Only the changed child nodes (iteration count & badge class) were patched.
                The <code>&lt;h3&gt;</code> element was untouched in the Real DOM!
              </p>
            </div>
          </div>

          {/* Raw VDOM Object Inspector */}
          <div>
            <h3 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              2. In-Memory VDOM Object Representation:
            </h3>
            <pre
              style={{
                background: "var(--bg-page)",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                overflowX: "auto",
                border: "1px solid var(--border)",
                maxHeight: "260px",
              }}
            >
              {JSON.stringify(currentVdom, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Concept Architecture */}
      <div className="card">
        <h2 className="card-title">Virtual DOM vs Real DOM Properties</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ padding: "12px", background: "var(--bg-page)", borderRadius: "6px" }}>
            <h4 style={{ color: "var(--accent-red)", margin: "0 0 6px 0" }}>Real DOM Node (HTMLDivElement)</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Has <strong>290+ properties</strong> (clientLeft, scrollTop, style, dispatchEvent, getBoundingClientRect, etc.).
              Very heavy to instantiate and mutate repeatedly.
            </p>
          </div>
          <div style={{ padding: "12px", background: "var(--bg-page)", borderRadius: "6px" }}>
            <h4 style={{ color: "var(--accent-green)", margin: "0 0 6px 0" }}>Virtual DOM Node (ReactElement)</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Plain JavaScript object with only 4 fields: <code>$$typeof</code>, <code>type</code>, <code>props</code>, and <code>key</code>.
              Garbage collected efficiently with zero layout cost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

