import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, ShieldCheck, Radio, Loader2 } from "lucide-react";

export default function AsyncInReactAndRaceConditions() {
  const [activeTab, setActiveTab] = useState("electronics");
  const [mode, setMode] = useState("safe"); // 'buggy' | 'safe'
  const [displayedData, setDisplayedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState(["Select a category tab to test race conditions."]);

  // Keep active abort controller reference
  const abortControllerRef = useRef(null);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    // ⚠️ CRITICAL REACT RULE:
    // Do NOT write `useEffect(async () => {})`!
    // Instead, define an async function inside and invoke it synchronously:

    let isIgnoreActive = false;
    setIsLoading(true);

    const categoryLatencies = {
      electronics: 1600, // Very slow network response
      fashion: 400,      // Fast response
      books: 800         // Medium response
    };

    const latency = categoryLatencies[activeTab];
    addLog(`[Fetch Dispatched] Loading "${activeTab.toUpperCase()}" with simulated latency of ${latency}ms...`);

    // Clean up previous controller if safe mode
    if (mode === "safe" && abortControllerRef.current) {
      addLog(`[AbortController] 🛑 Cancelled previous pending request for earlier tab!`);
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function loadCategoryData() {
      try {
        const response = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            resolve({
              category: activeTab,
              items: activeTab === "electronics" 
                ? ["MacBook Pro", "Sony WH-1000XM5", "iPad Air"]
                : activeTab === "fashion"
                ? ["Italian Leather Jacket", "Chelsea Boots", "Cashmere Scarf"]
                : ["Clean Code", "Design Patterns", "You Don't Know JS"]
            });
          }, latency);

          if (mode === "safe") {
            controller.signal.addEventListener("abort", () => {
              clearTimeout(timer);
              reject(new Error("Request aborted by AbortController"));
            });
          }
        });

        // In buggy mode without check, slow previous tab will overwrite active tab!
        if (mode === "safe" && isIgnoreActive) return;

        setDisplayedData(response);
        setIsLoading(false);
        addLog(`[Response Arrived] Successfully populated state for category: "${response.category.toUpperCase()}"`);
      } catch (err) {
        if (err.message.includes("aborted")) {
          // Graceful handling of aborted inflight requests
        } else {
          setIsLoading(false);
        }
      }
    }

    loadCategoryData();

    // Effect cleanup
    return () => {
      isIgnoreActive = true;
      if (mode === "safe" && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeTab, mode]);

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-rose">Module 09</span>
          <span className="badge badge-emerald">Production Safety</span>
        </div>
        <h3 className="content-title">Async in React, useEffect Rules & Network Race Conditions</h3>
        <p className="content-subtitle">
          Why <code>useEffect(async () =&gt; {})</code> is illegal, and how <code>AbortController</code> prevents slow responses from overwriting newer user requests.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><AlertTriangle size={16} /> The Network Race Condition Bug</h4>
            <p>
              If a user switches rapidly from <strong>Electronics (1600ms)</strong> to <strong>Fashion (400ms)</strong>, the Fashion response arrives first. 1.2 seconds later, the slow Electronics response arrives and overwrites state! The user sees the Fashion tab selected, but Electronics products displayed!
            </p>
          </div>
          <div className="theory-box">
            <h4><ShieldCheck size={16} /> The AbortController Remedy</h4>
            <p>
              In the <code>useEffect</code> cleanup function, call <code>abortController.abort()</code>. This cancels the pending HTTP request at the browser network layer, guaranteeing that stale responses are safely dropped.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Radio size={18} className="text-emerald-400" />
            Race Condition Simulator
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className={`btn ${mode === "buggy" ? "btn-danger" : "btn-secondary"}`}
              onClick={() => setMode("buggy")}
            >
              <AlertTriangle size={14} /> Unprotected (Buggy)
            </button>
            <button 
              className={`btn ${mode === "safe" ? "btn-emerald" : "btn-secondary"}`}
              onClick={() => setMode("safe")}
            >
              <ShieldCheck size={14} /> Safe (AbortController)
            </button>
          </div>
        </div>

        <div className="playground-body">
          {/* Tab Selector */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button 
              className={`btn ${activeTab === "electronics" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("electronics")}
            >
              Electronics (Slow: 1600ms)
            </button>

            <button 
              className={`btn ${activeTab === "fashion" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("fashion")}
            >
              Fashion (Fast: 400ms)
            </button>

            <button 
              className={`btn ${activeTab === "books" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("books")}
            >
              Books (Medium: 800ms)
            </button>
          </div>

          <div className="grid-2">
            {/* Display State */}
            <div className="state-inspector-card">
              <div className="inspector-title">Active Render Output</div>

              <div style={{ padding: "16px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", minHeight: "140px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span>Active Selected Tab: <strong style={{ color: "var(--accent-blue)" }}>{activeTab.toUpperCase()}</strong></span>
                  {isLoading && (
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--accent-amber)" }}>
                      <Loader2 size={14} className="animate-spin" /> Inflight Request...
                    </span>
                  )}
                </div>

                {displayedData && (
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Products in State (Category: <strong style={{ color: displayedData.category === activeTab ? "var(--accent-emerald)" : "var(--accent-rose)" }}>{displayedData.category.toUpperCase()}</strong>):
                    </div>
                    {displayedData.category !== activeTab && (
                      <div style={{ padding: "6px 10px", background: "rgba(244,63,94,0.15)", color: "#f87171", borderRadius: "6px", fontSize: "0.8rem", marginBottom: "8px" }}>
                        ⚠️ RACE CONDITION BUG OCCURRED: Displayed items do NOT match active tab!
                      </div>
                    )}
                    <ul style={{ paddingLeft: "20px", fontSize: "0.88rem", color: "var(--text-primary)" }}>
                      {displayedData.items.map((it, idx) => <li key={idx}>{it}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Guide */}
            <div className="state-inspector-card">
              <div className="inspector-title">How to Trigger the Race Condition:</div>
              <ol style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <li>Select <strong>"Unprotected (Buggy)"</strong> mode above.</li>
                <li>Click <strong>"Electronics (Slow: 1600ms)"</strong>.</li>
                <li>Immediately (within 0.5s) click <strong>"Fashion (Fast: 400ms)"</strong>.</li>
                <li>Watch Fashion load first, and then 1 second later Electronics overwrites it!</li>
                <li>Now switch to <strong>"Safe (AbortController)"</strong> and repeat — the slow request is safely cancelled!</li>
              </ol>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="terminal-box" style={{ marginTop: "20px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>NETWORK LIFECYCLE AUDIT:</div>
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
