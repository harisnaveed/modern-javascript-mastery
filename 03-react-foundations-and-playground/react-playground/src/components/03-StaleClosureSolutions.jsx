import React, { useState, useRef } from "react";
import { Clock, AlertOctagon, CheckCircle2, RefreshCw, Zap } from "lucide-react";

export default function StaleClosureSolutions() {
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState("buggy"); // 'buggy' | 'functional' | 'ref'
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [logs, setLogs] = useState(["Select a mode and test delayed increments."]);

  // For the useRef solution
  const latestCountRef = useRef(count);
  latestCountRef.current = count; // Always mirrors freshest state

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  const handleTriggerDelayed = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);
    setSecondsLeft(3);

    const snapshotCountAtClick = count;
    addLog(`[Timer Started] Mode: [${mode.toUpperCase()}]. Snapshot of count captured in closure: ${snapshotCountAtClick}. Now rapidly click "+1 Instant Increment"!`);

    // Ticker for UI
    let remaining = 3;
    const interval = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setIsTimerRunning(false);

        // EXECUTE BASED ON SELECTED MODE:
        if (mode === "buggy") {
          // ⚠️ BUG: Uses the old captured snapshot variable!
          setCount(snapshotCountAtClick + 1);
          addLog(`💥 BUG FIRED: Used stale closure snapshot (${snapshotCountAtClick} + 1). Reset count to 1, discarding your manual clicks!`);
        } else if (mode === "functional") {
          // ✅ FIX 1: Functional updater guarantees freshest state!
          setCount(prev => {
            const next = prev + 1;
            addLog(`✅ FUNCTIONAL UPDATE FIRED: Received freshest state (${prev}). Incremented cleanly to ${next}!`);
            return next;
          });
        } else if (mode === "ref") {
          // ✅ FIX 2: useRef escape hatch
          const fresh = latestCountRef.current + 1;
          setCount(fresh);
          addLog(`✅ useRef PATTERN FIRED: Read latestCountRef.current (${latestCountRef.current}). Incremented cleanly to ${fresh}!`);
        }
      }
    }, 1000);
  };

  const handleInstantIncrement = () => {
    setCount(c => c + 1);
    addLog(`[Instant Click] Count incremented directly to ${count + 1}`);
  };

  const handleReset = () => {
    setCount(0);
    setIsTimerRunning(false);
    setSecondsLeft(0);
    addLog("[Reset] Count reset back to 0.");
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-rose">Module 03</span>
          <span className="badge badge-amber">Classic React Bug</span>
        </div>
        <h3 className="content-title">The Stale Closure Bug & The 3 React Solutions</h3>
        <p className="content-subtitle">
          Why asynchronous callbacks in <code>setTimeout</code> or <code>useEffect</code> capture outdated state snapshots, and how to fix them.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><AlertOctagon size={16} /> Why It Happens</h4>
            <p>
              In React, every render is an immutable snapshot. When you schedule a <code>setTimeout(() =&gt; setCount(count + 1), 3000)</code>, the closure captures whatever <code>count</code> was at that exact instant. If the user clicks 5 more times in the meantime, the delayed timer still executes with the old snapshot!
            </p>
          </div>
          <div className="theory-box">
            <h4><CheckCircle2 size={16} /> The Canonical Fix</h4>
            <p>
              Use functional updates: <code>setCount(prev =&gt; prev + 1)</code>. React passes the live committed state to your updater function, completely bypassing the stale closure snapshot. Alternatively, use a mutable <code>useRef</code> container.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Clock size={18} className="text-amber-400" />
            Interactive Stale Closure Testing Lab
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span className="badge badge-blue">Live Count: {count}</span>
            {isTimerRunning && (
              <span className="badge badge-rose">Timer: {secondsLeft}s left</span>
            )}
          </div>
        </div>

        <div className="playground-body">
          {/* Mode Selector */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
              SELECT CLOSURE STRATEGY:
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                className={`btn ${mode === "buggy" ? "btn-danger" : "btn-secondary"}`}
                onClick={() => setMode("buggy")}
              >
                <AlertOctagon size={16} /> Buggy (setCount(count + 1))
              </button>
              <button 
                className={`btn ${mode === "functional" ? "btn-emerald" : "btn-secondary"}`}
                onClick={() => setMode("functional")}
              >
                <CheckCircle2 size={16} /> Functional (setCount(prev =&gt; prev + 1))
              </button>
              <button 
                className={`btn ${mode === "ref" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setMode("ref")}
              >
                <Zap size={16} /> useRef Container (latestRef.current)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "24px" }}>
            <button 
              className="btn btn-primary" 
              onClick={handleTriggerDelayed}
              disabled={isTimerRunning}
            >
              <Clock size={16} />
              {isTimerRunning ? `Timer Running (${secondsLeft}s)...` : "1. Schedule +1 in 3 Seconds"}
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={handleInstantIncrement}
            >
              2. Instant Increment (+1)
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={handleReset}
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>

          {/* Visual Step Guide */}
          <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--accent-blue)", marginBottom: "6px" }}>
              🧪 HOW TO TEST THIS EXPERIMENT:
            </div>
            <ol style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <li>Ensure <strong>Live Count</strong> is 0.</li>
              <li>Click <strong>"1. Schedule +1 in 3 Seconds"</strong>.</li>
              <li>While the timer is counting down, immediately click <strong>"2. Instant Increment"</strong> 4 or 5 times!</li>
              <li>
                Watch what happens at 0 seconds:
                <br />
                - In <strong>Buggy Mode</strong>: Count drops back to <strong>1</strong> (stale closure overwrite)!
                <br />
                - In <strong>Functional Mode</strong>: Count advances smoothly to <strong>6</strong> (bug solved)!
              </li>
            </ol>
          </div>

          {/* Terminal Box */}
          <div className="terminal-box" style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>STALE CLOSURE AUDIT TRAIL:</div>
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
