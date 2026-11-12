import React, { useState } from "react";
import { Layers, Play, CheckCircle, XCircle, Clock, Zap } from "lucide-react";

export default function PromisesLab() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Products API", latency: 800, shouldFail: false, status: "idle", result: null },
    { id: 2, name: "Categories API", latency: 400, shouldFail: false, status: "idle", result: null },
    { id: 3, name: "User Auth API", latency: 1200, shouldFail: true, status: "idle", result: null }
  ]);

  const [combinatorResult, setCombinatorResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const updateTask = (id, field, value) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const createPromise = (task) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (task.shouldFail) {
          reject(new Error(`${task.name} failed with 500 error`));
        } else {
          resolve(`${task.name} returned 200 OK`);
        }
      }, task.latency);
    });
  };

  const executeCombinator = async (type) => {
    setIsRunning(true);
    setCombinatorResult(null);

    // Reset statuses to running
    setTasks(prev => prev.map(t => ({ ...t, status: "pending", result: null })));

    // Create promises and attach individual status listeners
    const taskPromises = tasks.map(task => {
      const p = createPromise(task);
      p.then(val => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "fulfilled", result: val } : t));
      }).catch(err => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "rejected", result: err.message } : t));
      });
      return p;
    });

    try {
      let outcome;
      if (type === "all") {
        outcome = await Promise.all(taskPromises);
      } else if (type === "allSettled") {
        outcome = await Promise.allSettled(taskPromises);
      } else if (type === "race") {
        outcome = await Promise.race(taskPromises);
      } else if (type === "any") {
        outcome = await Promise.any(taskPromises);
      }

      setCombinatorResult({
        success: true,
        type: `Promise.${type}()`,
        data: outcome
      });
    } catch (error) {
      setCombinatorResult({
        success: false,
        type: `Promise.${type}()`,
        error: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-emerald">Module 07</span>
          <span className="badge badge-blue">Concurrency</span>
        </div>
        <h3 className="content-title">Promises, Chaining & The 4 Combinators</h3>
        <p className="content-subtitle">
          Interactive laboratory comparing <code>Promise.all</code>, <code>Promise.allSettled</code>, <code>Promise.race</code>, and <code>Promise.any</code>.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Layers size={16} /> Promise Combinators</h4>
            <p>
              - <strong>all</strong>: Waits for all to succeed; aborts on first failure.<br />
              - <strong>allSettled</strong>: Waits for all, returning complete audit. Never rejects.<br />
              - <strong>race</strong>: Resolves or rejects with the fastest promise.<br />
              - <strong>any</strong>: Fulfills with first SUCCESS, ignoring failures unless all fail.
            </p>
          </div>
          <div className="theory-box">
            <h4><Clock size={16} /> Concurrency in React</h4>
            <p>
              Instead of awaiting 3 API calls sequentially (800ms + 400ms + 1200ms = 2400ms), <code>Promise.all</code> fires all three in parallel, completing in max(800, 400, 1200) = 1200ms!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Zap size={18} className="text-emerald-400" />
            Parallel Network Simulator
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => executeCombinator("all")} disabled={isRunning}>
              Promise.all()
            </button>
            <button className="btn btn-secondary" onClick={() => executeCombinator("allSettled")} disabled={isRunning}>
              Promise.allSettled()
            </button>
            <button className="btn btn-secondary" onClick={() => executeCombinator("race")} disabled={isRunning}>
              Promise.race()
            </button>
            <button className="btn btn-secondary" onClick={() => executeCombinator("any")} disabled={isRunning}>
              Promise.any()
            </button>
          </div>
        </div>

        <div className="playground-body">
          {/* Task Sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            {tasks.map(t => (
              <div key={t.id} className="state-inspector-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong>{t.name}</strong>
                  <span className={`badge ${t.status === "fulfilled" ? "badge-emerald" : t.status === "rejected" ? "badge-rose" : t.status === "pending" ? "badge-amber" : "badge-blue"}`}>
                    {t.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Latency: {t.latency}ms</label>
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="100" 
                    value={t.latency} 
                    onChange={e => updateTask(t.id, "latency", Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input 
                    type="checkbox" 
                    id={`fail-${t.id}`}
                    checked={t.shouldFail} 
                    onChange={e => updateTask(t.id, "shouldFail", e.target.checked)} 
                  />
                  <label htmlFor={`fail-${t.id}`} style={{ fontSize: "0.85rem", color: t.shouldFail ? "var(--accent-rose)" : "var(--text-secondary)" }}>
                    Simulate Server Failure
                  </label>
                </div>

                {t.result && (
                  <div style={{ marginTop: "12px", fontSize: "0.8rem", color: t.status === "fulfilled" ? "#34d399" : "#f87171" }}>
                    Result: {t.result}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Combinator Output Box */}
          {combinatorResult && (
            <div style={{
              padding: "16px",
              borderRadius: "8px",
              background: combinatorResult.success ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
              border: `1px solid ${combinatorResult.success ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: combinatorResult.success ? "var(--accent-emerald)" : "var(--accent-rose)", marginBottom: "8px" }}>
                {combinatorResult.success ? <CheckCircle size={18} /> : <XCircle size={18} />}
                {combinatorResult.type} Settled: {combinatorResult.success ? "RESOLVED" : "REJECTED"}
              </div>
              <pre className="code-preview" style={{ color: combinatorResult.success ? "#a7f3d0" : "#fca5a5" }}>
{JSON.stringify(combinatorResult.success ? combinatorResult.data : combinatorResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
