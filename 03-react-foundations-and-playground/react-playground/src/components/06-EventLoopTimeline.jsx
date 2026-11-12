import React, { useState } from "react";
import { Play, RotateCcw, Cpu, ListOrdered, CheckCircle2 } from "lucide-react";

export default function EventLoopTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runRace = () => {
    setTimeline([]);
    setIsRunning(true);

    const steps = [];

    // Step 1: Synchronous code starts
    steps.push({
      time: "T0",
      type: "SYNC",
      queue: "Call Stack",
      msg: "1: Synchronous console.log('Start')",
      color: "var(--accent-blue)"
    });

    // Step 2: setTimeout registers Web API
    setTimeout(() => {
      setTimeline(prev => [
        ...prev,
        {
          time: "T3",
          type: "TASK",
          queue: "Task Queue (Macrotask)",
          msg: "4: Macrotask timer fired (Ran last, after all microtasks!)",
          color: "var(--accent-rose)"
        }
      ]);
      setIsRunning(false);
    }, 100);

    // Step 3: Promise registers Microtask
    Promise.resolve().then(() => {
      setTimeline(prev => [
        ...prev,
        {
          time: "T2",
          type: "MICRO",
          queue: "Microtask Queue",
          msg: "3: Promise .then() microtask executed (Immediately after Call Stack emptied!)",
          color: "var(--accent-emerald)"
        }
      ]);
    });

    // Step 4: Synchronous code ends
    steps.push({
      time: "T1",
      type: "SYNC",
      queue: "Call Stack",
      msg: "2: Synchronous console.log('End')",
      color: "var(--accent-blue)"
    });

    setTimeline(steps);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-blue">Module 06</span>
          <span className="badge badge-purple">Engine Internals</span>
        </div>
        <h3 className="content-title">The Event Loop, Call Stack & Microtask Priority</h3>
        <p className="content-subtitle">
          How JavaScript's single-threaded runtime prioritizes Promise microtasks over <code>setTimeout</code> timers.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Cpu size={16} /> The Execution Hierarchy</h4>
            <p>
              1. <strong>Synchronous Stack</strong>: Executes immediately to completion.<br />
              2. <strong>Microtask Queue</strong>: Promises, <code>queueMicrotask</code>, and <code>await</code> continuations. Must be 100% drained before any timer runs!<br />
              3. <strong>Task Queue</strong>: Timers (<code>setTimeout</code>), I/O, UI paints.
            </p>
          </div>
          <div className="theory-box">
            <h4><ListOrdered size={16} /> Restaurant Analogy</h4>
            <p>
              The single waiter (Call Stack) takes orders synchronously, gives tickets to the kitchen (Web APIs), quickly handles customer questions (Microtasks), and only then picks up ready plates from the counter (Task Queue).
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Cpu size={18} className="text-blue-400" />
            Live Event Loop Execution Race
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={runRace} disabled={isRunning}>
              <Play size={16} />
              {isRunning ? "Racing Queues..." : "Run Event Loop Race"}
            </button>
            <button className="btn btn-secondary" onClick={() => setTimeline([])}>
              <RotateCcw size={16} /> Clear
            </button>
          </div>
        </div>

        <div className="playground-body">
          <div style={{ marginBottom: "20px" }}>
            <div className="inspector-title">Target Code Snippet:</div>
            <pre className="code-preview">
{`console.log("1: Start");
setTimeout(() => console.log("4: setTimeout 0ms"), 0);
Promise.resolve().then(() => console.log("3: Promise .then"));
console.log("2: End");`}
            </pre>
          </div>

          <div className="inspector-title">Live Execution Timeline (Ordered by Event Loop Priority):</div>

          {timeline.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", background: "var(--code-bg)", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
              Click <strong>"Run Event Loop Race"</strong> to observe the Event Loop schedule microtasks ahead of timers in real time!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {timeline.map((step, idx) => (
                <div 
                  key={idx} 
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${step.color}`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>{step.time}</span>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: step.color }}>{step.queue}</span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{step.msg}</span>
                  </div>
                  <CheckCircle2 size={16} style={{ color: step.color }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
