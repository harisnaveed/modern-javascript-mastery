"use client";

import { useState } from "react";
import Link from "next/link";

export default function RealDomPage() {
  const [items, setItems] = useState([]);
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  function runImperativeThrashing() {
    setIsRunning(true);
    setBenchmarkResult(null);

    setTimeout(() => {
      const container = document.getElementById("dom-sandbox");
      if (!container) return;
      container.innerHTML = "";

      const start = performance.now();
      // DOM Layout Thrashing: writing then immediately reading forces synchronous layout
      for (let i = 0; i < 300; i++) {
        const div = document.createElement("div");
        div.textContent = `Thrashing Node #${i + 1}`;
        div.style.padding = "4px";
        div.style.borderBottom = "1px solid #334155";
        container.appendChild(div);
        // FORCING SYNCHRONOUS REFLOW (The Layout Thrash):
        const dummy = div.offsetHeight;
      }
      const duration = performance.now() - start;

      setBenchmarkResult({
        type: "Imperative DOM Thrashing (300 Synchronous Reflows)",
        duration: duration.toFixed(2),
        nodes: 300,
        verdict: "High CPU Overhead (Forces main thread recalculation per node)",
        color: "var(--accent-red)",
      });
      setIsRunning(false);
    }, 50);
  }

  function runBatchedFragment() {
    setIsRunning(true);
    setBenchmarkResult(null);

    setTimeout(() => {
      const container = document.getElementById("dom-sandbox");
      if (!container) return;
      container.innerHTML = "";

      const start = performance.now();
      // Batched via DocumentFragment (single reflow at the end)
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 300; i++) {
        const div = document.createElement("div");
        div.textContent = `Batched Node #${i + 1}`;
        div.style.padding = "4px";
        div.style.borderBottom = "1px solid #334155";
        fragment.appendChild(div);
      }
      container.appendChild(fragment);
      const duration = performance.now() - start;

      setBenchmarkResult({
        type: "Batched DocumentFragment (1 Single Reflow)",
        duration: duration.toFixed(2),
        nodes: 300,
        verdict: "Extremely Fast (Browser calculates geometry once)",
        color: "var(--accent-green)",
      });
      setIsRunning(false);
    }, 50);
  }

  function runReactDeclarative() {
    setIsRunning(true);
    setBenchmarkResult(null);

    const start = performance.now();
    const newItems = Array.from({ length: 300 }, (_, i) => `React Declarative State Item #${i + 1}`);
    setItems(newItems);

    setTimeout(() => {
      const duration = performance.now() - start;
      setBenchmarkResult({
        type: "React 19 Declarative State Update (VDOM Reconciliation)",
        duration: duration.toFixed(2),
        nodes: 300,
        verdict: "Optimized & Predictable (React batches DOM updates automatically)",
        color: "var(--accent-blue)",
      });
      setIsRunning(false);
    }, 50);
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 02: Real DOM & Mutation Cost</h1>
        <span className="badge badge-amber">DOM Engine</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Direct Real DOM manipulation is not slow because JavaScript is slow—it is slow because modifying the Real DOM
        triggers expensive browser layout calculations (reflows) and repaints across the C++ DOM tree.
      </p>

      {/* Benchmark Control Panel */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Live DOM Mutation Benchmark Lab</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Compare the performance of unbatched imperative DOM mutations with reading geometries vs batched operations:
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button
            onClick={runImperativeThrashing}
            disabled={isRunning}
            className="button"
            style={{ background: "var(--accent-red)", color: "#fff" }}
          >
            1. Run DOM Thrashing (Query offsetHeight)
          </button>
          <button
            onClick={runBatchedFragment}
            disabled={isRunning}
            className="button"
            style={{ background: "var(--accent-green)", color: "#fff" }}
          >
            2. Run Batched DocumentFragment
          </button>
          <button
            onClick={runReactDeclarative}
            disabled={isRunning}
            className="button"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            3. Run React Declarative State Update
          </button>
        </div>

        {/* Benchmark Result Card */}
        {benchmarkResult && (
          <div
            style={{
              padding: "16px",
              background: "var(--bg-page)",
              border: `1px solid ${benchmarkResult.color}`,
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ color: "#fff", fontSize: "1.05rem" }}>{benchmarkResult.type}</strong>
              <span className="badge" style={{ background: benchmarkResult.color, color: "#fff" }}>
                {benchmarkResult.duration} ms
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
              {benchmarkResult.verdict} &bull; Processed {benchmarkResult.nodes} nodes.
            </p>
          </div>
        )}

        {/* Render Sandbox Container */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Raw DOM Mutation Sandbox (Imperative):
            </h3>
            <div
              id="dom-sandbox"
              style={{
                height: "180px",
                overflowY: "auto",
                background: "var(--bg-page)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "0.8rem",
              }}
            >
              <em>Click button 1 or 2 to populate direct DOM nodes...</em>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
              React State Sandbox (Declarative):
            </h3>
            <div
              style={{
                height: "180px",
                overflowY: "auto",
                background: "var(--bg-page)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "0.8rem",
              }}
            >
              {items.length === 0 ? (
                <em>Click button 3 to populate React declarative state...</em>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} style={{ padding: "4px", borderBottom: "1px solid #334155" }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Senior Architectural Summary */}
      <div className="card">
        <h2 className="card-title">Architectural Rule of Thumb</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}>
          In traditional jQuery/PHP applications, developers repeatedly queried DOM layout properties (like <code>element.offsetWidth</code>)
          immediately after writing style changes, triggering <strong>Forced Synchronous Layout</strong>. React eliminates this class of performance bug
          by computing changes in a lightweight in-memory Virtual DOM and applying all mutations in a single, batched Commit phase.
        </p>
      </div>
    </div>
  );
}
