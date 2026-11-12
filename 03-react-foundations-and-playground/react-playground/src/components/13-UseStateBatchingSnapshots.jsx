import React, { useState } from "react";
import { Layers, CheckCircle2, AlertTriangle, RefreshCw, Zap } from "lucide-react";

export default function UseStateBatchingSnapshots() {
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [logs, setLogs] = useState(["Component mounted with count = 0."]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  // Direct Value Snapshots
  const handleDirectTripleIncrement = () => {
    setCount(count + 1); // setCount(0 + 1)
    setCount(count + 1); // setCount(0 + 1)
    setCount(count + 1); // setCount(0 + 1)
    setRenderCount(r => r + 1);
    addLog(`[Direct Updates] Called setCount(count + 1) 3x. But in this render snapshot, count was ALWAYS ${count}! Result: count advanced by only 1!`);
  };

  // Functional Updaters
  const handleFunctionalTripleIncrement = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setRenderCount(r => r + 1);
    addLog(`[Functional Updates] Enqueued [prev => prev + 1] 3x into React's update queue. Result: count advanced by 3!`);
  };

  // Automatic Batching in Async/Timeout
  const handleAsyncBatching = () => {
    setTimeout(() => {
      // In React 18 & 19, updates inside setTimeout are automatically batched into 1 render!
      setCount(c => c + 10);
      setRenderCount(r => r + 1);
      addLog(`[Automatic Batching] Triggered state updates inside setTimeout. React 19 batched both updates into a SINGLE render pass!`);
    }, 500);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-blue">Module 13</span>
          <span className="badge badge-emerald">State Mechanics</span>
        </div>
        <h3 className="content-title">useState Mechanics, State Snapshots & Automatic Batching</h3>
        <p className="content-subtitle">
          Why state behaves like a constant snapshot during a render pass, and how functional updaters and React 19 automatic batching work.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Layers size={16} /> State as a Snapshot</h4>
            <p>
              When a component renders, React provides a fixed snapshot of state for that specific execution frame. Calling <code>setCount(count + 1)</code> three times does not change <code>count</code> in the running code — each call simply requests the same next value!
            </p>
          </div>
          <div className="theory-box">
            <h4><Zap size={16} /> Automatic Batching</h4>
            <p>
              React 18 & 19 automatically batches all state updates — whether in event handlers, Promises, or <code>setTimeout</code> — into a single atomic render, avoiding wasted intermediate DOM paints.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <RefreshCw size={18} className="text-cyan-400" />
            Interactive Snapshot & Batching Lab
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="badge badge-emerald">Count: {count}</span>
            <span className="badge badge-purple">Render Count: {renderCount}</span>
          </div>
        </div>

        <div className="playground-body">
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <button className="btn btn-danger" onClick={handleDirectTripleIncrement}>
              <AlertTriangle size={16} />
              setCount(count + 1) x 3 (Adds 1 only!)
            </button>

            <button className="btn btn-emerald" onClick={handleFunctionalTripleIncrement}>
              <CheckCircle2 size={16} />
              setCount(prev =&gt; prev + 1) x 3 (Adds 3!)
            </button>

            <button className="btn btn-primary" onClick={handleAsyncBatching}>
              <Zap size={16} />
              Test React 19 Async Batching (setTimeout)
            </button>

            <button className="btn btn-secondary" onClick={() => { setCount(0); setRenderCount(1); }}>
              Reset
            </button>
          </div>

          <div className="terminal-box">
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>BATCHING & SNAPSHOT AUDIT:</div>
            {logs.map((log, i) => (
              <div key={i} className="terminal-line">
                <span className="terminal-prompt">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
