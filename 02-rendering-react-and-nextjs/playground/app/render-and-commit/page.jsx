"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function RenderAndCommitPage() {
  const [val, setVal] = useState(10);
  const [renderCount, setRenderCount] = useState(1);
  const [domMutationCount, setDomMutationCount] = useState(1);
  const [currentStage, setCurrentStage] = useState("idle");

  const lastCommittedVal = useRef(10);

  function handleTrigger(newVal) {
    setCurrentStage("trigger");

    setTimeout(() => {
      setCurrentStage("render");
      setRenderCount((c) => c + 1);

      setTimeout(() => {
        if (newVal !== lastCommittedVal.current) {
          // Commit phase runs because diff is non-empty!
          setCurrentStage("commit");
          lastCommittedVal.current = newVal;
          setVal(newVal);
          setDomMutationCount((m) => m + 1);
        } else {
          // Render executed, but Commit skipped DOM mutation because VDOM diff was identical!
          setCurrentStage("render-bypassed");
        }

        setTimeout(() => {
          setCurrentStage("idle");
        }, 1200);
      }, 400);
    }, 300);
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 04: Render Phase vs Commit Phase</h1>
        <span className="badge badge-green">React Lifecycle</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        One of the biggest misconceptions in React: <em>&ldquo;Rendering means updating the DOM.&rdquo;</em><br />
        In reality, <strong>Rendering</strong> is simply React executing your component function to create a new Virtual DOM tree. 
        Only the <strong>Commit Phase</strong> modifies the real DOM, and ONLY if the diff is non-empty!
      </p>

      {/* Interactive Lifecycle Stepper */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Live 3-Phase Lifecycle Simulator</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Test what happens when state is triggered with a new value vs the same value:
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
          <button
            onClick={() => handleTrigger(val + 5)}
            className="button"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            Trigger New Value ({val + 5}) &rarr; Mutates DOM
          </button>
          <button
            onClick={() => handleTrigger(val)}
            className="button"
            style={{ background: "var(--accent-amber)", color: "#fff" }}
          >
            Trigger Same Value ({val}) &rarr; Skips DOM Mutation!
          </button>
        </div>

        {/* Phase Pipeline Visualization */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              background: currentStage === "trigger" ? "rgba(59, 130, 246, 0.2)" : "var(--bg-page)",
              border: currentStage === "trigger" ? "2px solid var(--accent-blue)" : "1px solid var(--border)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "6px" }}>1. Trigger Phase</strong>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              User event or setState schedules a re-render.
            </span>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              background:
                currentStage === "render" || currentStage === "render-bypassed"
                  ? "rgba(168, 85, 247, 0.2)"
                  : "var(--bg-page)",
              border:
                currentStage === "render" || currentStage === "render-bypassed"
                  ? "2px solid var(--accent-purple)"
                  : "1px solid var(--border)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "6px" }}>2. Render Phase (Pure)</strong>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              React executes component function. Computes VDOM diff. Zero DOM writes!
            </span>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              background: currentStage === "commit" ? "rgba(16, 185, 129, 0.2)" : "var(--bg-page)",
              border: currentStage === "commit" ? "2px solid var(--accent-green)" : "1px solid var(--border)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "6px" }}>3. Commit Phase (DOM)</strong>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {currentStage === "render-bypassed"
                ? "SKIPPED: Diff is 0, DOM was NOT touched!"
                : "React applies minimal patches to Real DOM nodes."}
            </span>
          </div>
        </div>

        {/* Counter Stats */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "24px",
            padding: "16px",
            background: "var(--bg-page)",
            borderRadius: "8px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Component Render Count:</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent-purple)" }}>
              {renderCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Real DOM Mutations:</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent-green)" }}>
              {domMutationCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Current Value:</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
              {val}
            </div>
          </div>
        </div>
      </div>

      {/* Rules for React 19 */}
      <div className="card">
        <h2 className="card-title">Golden Rules of Render vs Commit</h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "#fff" }}>Render Phase must be pure:</strong> Never mutate variables, make API calls, or touch the DOM during render. React may call it multiple times or discard unfinished work.
          </li>
          <li>
            <strong style={{ color: "#fff" }}>Side effects belong in useEffect or Event Handlers:</strong> Effects run exclusively during or after the Commit phase.
          </li>
        </ul>
      </div>
    </div>
  );
}

