import React, { useState, useMemo, useCallback } from "react";
import { Cpu, Zap, Activity, Clock } from "lucide-react";

// Expensive prime calculation
function computePrimes(limit) {
  const start = performance.now();
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) { isPrime = false; break; }
    }
    if (isPrime) count++;
  }
  const duration = performance.now() - start;
  return { count, duration };
}

export default function UseCallbackAndUseMemo() {
  const [limit, setLimit] = useState(30000);
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const [enableMemo, setEnableMemo] = useState(true);

  // Computed with or without useMemo
  const primeResult = useMemo(() => {
    if (!enableMemo) return null;
    return computePrimes(limit);
  }, [enableMemo ? limit : Math.random()]); // Intentionally bust cache if memo disabled

  const finalResult = enableMemo ? primeResult : computePrimes(limit);

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-cyan">Module 11</span>
          <span className="badge badge-purple">Benchmarking</span>
        </div>
        <h3 className="content-title">useCallback vs useMemo — Deep Dive & Performance Lab</h3>
        <p className="content-subtitle">
          Benchmarking the real-world CPU savings of caching expensive computations with <code>useMemo</code> versus premature optimization.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Cpu size={16} /> useMemo(fn, deps)</h4>
            <p>
              Caches a <strong>CALCULATED VALUE</strong>. Use when filtering, mapping, or computing large datasets where re-calculating on every unrelated render causes UI lag.
            </p>
          </div>
          <div className="theory-box">
            <h4><Zap size={16} /> useCallback(fn, deps)</h4>
            <p>
              Caches a <strong>FUNCTION DEFINITION</strong>. Conceptually identical to <code>useMemo(() =&gt; fn, deps)</code>. Use when passing callback props to memoized children.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Activity size={18} className="text-cyan-400" />
            Live Expensive Calculation Benchmark
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
              <input 
                type="checkbox" 
                checked={enableMemo} 
                onChange={e => setEnableMemo(e.target.checked)} 
              />
              Enable useMemo Cache
            </label>
          </div>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  Prime Calculation Search Limit: {limit.toLocaleString()}
                </label>
                <input 
                  type="range" 
                  min="5000" 
                  max="60000" 
                  step="5000" 
                  value={limit} 
                  onChange={e => setLimit(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "16px" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>CALCULATION OUTPUT:</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-blue)", marginBottom: "4px" }}>
                  Found {finalResult.count.toLocaleString()} Primes
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: finalResult.duration > 15 ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                  <Clock size={14} /> Execution Time: {finalResult.duration.toFixed(2)}ms
                </div>
              </div>
            </div>

            <div className="state-inspector-card">
              <div className="inspector-title">Trigger Unrelated Re-render:</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                Click this button to update an unrelated state variable.
              </p>

              <button 
                className="btn btn-primary" 
                onClick={() => setUnrelatedCount(c => c + 1)}
                style={{ marginBottom: "16px", width: "100%" }}
              >
                Increment Unrelated Counter: {unrelatedCount}
              </button>

              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {enableMemo ? (
                  <span style={{ color: "var(--accent-emerald)" }}>
                    ✅ <strong>useMemo is Active</strong>: Clicking the button re-renders the component, but the heavy prime calculation is <strong>SKIPPED</strong> completely!
                  </span>
                ) : (
                  <span style={{ color: "var(--accent-rose)" }}>
                    ⚠️ <strong>useMemo is Disabled</strong>: Clicking the button forces the heavy prime search to re-execute from scratch on every single click, burning CPU!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
