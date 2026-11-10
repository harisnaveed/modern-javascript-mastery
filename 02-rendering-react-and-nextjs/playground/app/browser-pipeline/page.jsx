"use client";

import { useState } from "react";
import Link from "next/link";

export default function BrowserPipelinePage() {
  const [activeStage, setActiveStage] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState("transform");
  const [metrics, setMetrics] = useState({ duration: 0.8, fps: 60, cost: "Low" });

  const pipelineStages = [
    { id: "html", name: "1. DOM Tree", desc: "HTML parsed into C++ DOM nodes in memory." },
    { id: "cssom", name: "2. CSSOM Tree", desc: "CSS rules parsed and mapped to selectors." },
    { id: "renderTree", name: "3. Render Tree", desc: "Visible nodes combined (excludes display: none)." },
    { id: "layout", name: "4. Layout (Reflow)", desc: "Calculates geometry: x, y, width, height for each node." },
    { id: "paint", name: "5. Paint & Composite", desc: "Converts vector boxes into pixels and GPU layers." },
  ];

  function handleTrigger(op) {
    setSelectedOperation(op);
    if (op === "dom") {
      setActiveStage("layout");
      setMetrics({ duration: 42.5, fps: 28, cost: "Extreme (Full Reflow + Repaint)" });
    } else if (op === "color") {
      setActiveStage("paint");
      setMetrics({ duration: 8.2, fps: 55, cost: "Moderate (Repaint only, Skips Layout)" });
    } else {
      setActiveStage("composite");
      setMetrics({ duration: 0.8, fps: 60, cost: "Minimal (GPU Composite only, 60fps)" });
    }
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 01: Browser Critical Rendering Path</h1>
        <span className="badge badge-blue">Browser Engine V8 / Blink</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Before React even loads, the browser engine executes 5 sequential stages to transform raw HTML text into visible pixels. 
        Understanding which operations trigger <strong>Layout (Reflow)</strong> vs <strong>Paint</strong> vs <strong>Composite</strong> 
        is the foundation of web performance.
      </p>

      {/* Interactive Trigger Panel */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Interactive Operation Simulator</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Click an operation below to see which pipeline stages the browser is forced to re-execute:
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button
            onClick={() => handleTrigger("dom")}
            className="button"
            style={{
              background: selectedOperation === "dom" ? "var(--accent-red)" : "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            Insert DOM Node (Triggers Layout & Reflow)
          </button>
          <button
            onClick={() => handleTrigger("color")}
            className="button"
            style={{
              background: selectedOperation === "color" ? "var(--accent-amber)" : "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            Change Background Color (Repaint only)
          </button>
          <button
            onClick={() => handleTrigger("transform")}
            className="button"
            style={{
              background: selectedOperation === "transform" ? "var(--accent-green)" : "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            CSS Transform / Opacity (GPU Composite)
          </button>
        </div>

        {/* Pipeline Stage Visualizer */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px" }}>
          {pipelineStages.map((stage) => {
            const isHit =
              selectedOperation === "dom" ||
              (selectedOperation === "color" && (stage.id === "paint" || stage.id === "renderTree")) ||
              (selectedOperation === "transform" && stage.id === "paint");

            return (
              <div
                key={stage.id}
                style={{
                  background: isHit ? "rgba(59, 130, 246, 0.15)" : "var(--bg-card)",
                  border: isHit ? "2px solid var(--accent-blue)" : "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "4px" }}>
                  {stage.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {stage.desc}
                </div>
                <div style={{ marginTop: "10px" }}>
                  <span
                    className="badge"
                    style={{
                      background: isHit ? "var(--accent-blue)" : "var(--border)",
                      color: "#fff",
                      fontSize: "0.7rem",
                    }}
                  >
                    {isHit ? "EXECUTED" : "SKIPPED"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Metrics */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "var(--bg-page)",
            borderRadius: "8px",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Frame Duration:</span>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--accent-blue)" }}>
              {metrics.duration} ms
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Frame Rate:</span>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: metrics.fps >= 55 ? "var(--accent-green)" : "var(--accent-red)" }}>
              {metrics.fps} FPS
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Pipeline Cost:</span>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>
              {metrics.cost}
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <div className="card">
        <h2 className="card-title">Key Engineering Principles</h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "#fff" }}>Reflow (Layout) is the slowest operation:</strong> Calculating geometries forces the browser to recalculate surrounding elements in the tree.
          </li>
          <li>
            <strong style={{ color: "#fff" }}>Repaint without Reflow:</strong> Changing colors, shadows, or background images bypasses the Layout stage entirely.
          </li>
          <li>
            <strong style={{ color: "#fff" }}>GPU Compositing:</strong> CSS properties like <code>transform</code> and <code>opacity</code> are handled directly on the compositor thread on the GPU without blocking the JavaScript main thread.
          </li>
        </ul>
      </div>
    </div>
  );
}
