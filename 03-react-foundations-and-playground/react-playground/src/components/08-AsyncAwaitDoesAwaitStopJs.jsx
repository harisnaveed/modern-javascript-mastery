import React, { useState } from "react";
import { Play, PauseCircle, MousePointerClick, RefreshCw, CheckCircle2, Flame } from "lucide-react";

export default function AsyncAwaitDoesAwaitStopJs() {
  const [isAsyncRunning, setIsAsyncRunning] = useState(false);
  const [asyncStatus, setAsyncStatus] = useState("Idle");
  const [mainThreadClicks, setMainThreadClicks] = useState(0);
  const [asyncData, setAsyncData] = useState(null);
  const [logs, setLogs] = useState(["Click 'Start 4-Second Async Fetch' to begin the experiment."]);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  const handleStartAsyncOperation = async () => {
    setIsAsyncRunning(true);
    setAsyncData(null);
    setAsyncStatus("Running: Encountered 'await fetch()'... FUNCTION SUSPENDED!");
    addLog("[Line 12] async function called. Encountered 'await'. Function yielded control back to browser!");

    try {
      // Simulate 4-second asynchronous network call
      const result = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ orderId: "ORD-94821", status: "VERIFIED", latency: "4000ms" });
        }, 4000);
      });

      setAsyncData(result);
      setAsyncStatus("Completed: Promise settled. Async function RESUMED!");
      addLog(`[Line 16] Promise fulfilled! Async function resumed. Order data: ${result.orderId}`);
    } catch (err) {
      setAsyncStatus("Error encountered");
    } finally {
      setIsAsyncRunning(false);
    }
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-rose">Module 08</span>
          <span className="badge badge-amber">Core Insight</span>
        </div>
        <h3 className="content-title">"Does Await Stop JavaScript?" — The Live Non-Blocking Test</h3>
        <p className="content-subtitle">
          Proving empirically that <code>await</code> suspends ONLY the current async function while leaving the main thread 100% responsive for user interactions and animations.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><PauseCircle size={16} /> What Await Actually Does</h4>
            <p>
              When JavaScript hits <code>await fetch()</code>, it saves the local execution context of that function and IMMEDIATELY pops it off the Call Stack. The main thread is totally free!
            </p>
          </div>
          <div className="theory-box">
            <h4><Flame size={16} /> Why Your UI Stays Fluid</h4>
            <p>
              Because the Call Stack is empty while the HTTP request flies over the internet, the Event Loop continues handling your mouse clicks, keyboard typing, and 60fps CSS animations without dropping a single frame!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <MousePointerClick size={18} className="text-cyan-400" />
            Live Main-Thread Fluidity Benchmark
          </div>
          <span className={`badge ${isAsyncRunning ? "badge-amber" : "badge-emerald"}`}>
            Status: {asyncStatus}
          </span>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            {/* Column 1: The Suspended Async Function */}
            <div className="state-inspector-card">
              <div className="inspector-title">1. Asynchronous Operation Controller</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Trigger an asynchronous <code>await</code> that takes 4 seconds to resolve.
              </p>

              <button 
                className={`btn ${isAsyncRunning ? "btn-secondary" : "btn-primary"}`}
                onClick={handleStartAsyncOperation}
                disabled={isAsyncRunning}
                style={{ width: "100%", marginBottom: "16px" }}
              >
                <Play size={16} />
                {isAsyncRunning ? "Async Function is Suspended (4s)..." : "Start 4-Second Async Fetch"}
              </button>

              <div style={{ padding: "12px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>FUNCTION STATE:</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: isAsyncRunning ? "var(--accent-amber)" : "var(--accent-emerald)" }}>
                  {asyncStatus}
                </div>
                {asyncData && (
                  <pre className="code-preview" style={{ marginTop: "10px" }}>
{JSON.stringify(asyncData, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Column 2: The Main Thread Fluidity Proof */}
            <div className="state-inspector-card">
              <div className="inspector-title">2. Main Thread Fluidity Test (Click While Suspended!)</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Click this button repeatedly WHILE the 4-second await is running to prove the main thread is NOT frozen!
              </p>

              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                <button 
                  className="btn btn-emerald"
                  onClick={() => setMainThreadClicks(c => c + 1)}
                  style={{ flex: 1 }}
                >
                  <MousePointerClick size={16} />
                  Main Thread Click Counter: {mainThreadClicks}
                </button>
                
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setMainThreadClicks(0)}
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* 60 FPS CSS Spin Animation */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div 
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "3px solid rgba(56,189,248,0.2)",
                    borderTopColor: "var(--accent-blue)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} 
                />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  60 FPS Animation: Spins seamlessly even during <code>await</code>!
                </span>
              </div>
            </div>
          </div>

          {/* Audit Terminal */}
          <div className="terminal-box" style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>ASYNC SUSPENSION AUDIT:</div>
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
