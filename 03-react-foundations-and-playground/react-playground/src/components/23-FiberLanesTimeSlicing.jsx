import React, { useState } from "react";
import { Cpu, Play, CheckCircle2, PauseCircle, Activity } from "lucide-react";

export default function FiberLanesTimeSlicing() {
  const [activeLanes, setActiveLanes] = useState({
    sync: true,        // 0b00001 (User click)
    continuous: false,  // 0b00010 (Drag)
    default: true,     // 0b00100 (setState)
    transition: false, // 0b01000 (startTransition)
    idle: false        // 0b10000 (Offscreen)
  });

  const [timeSliceLog, setTimeSliceLog] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Bitmask calculation
  const bitmask = (activeLanes.sync ? 1 : 0) |
                  (activeLanes.continuous ? 2 : 0) |
                  (activeLanes.default ? 4 : 0) |
                  (activeLanes.transition ? 8 : 0) |
                  (activeLanes.idle ? 16 : 0);

  const toggleLane = (laneKey) => {
    setActiveLanes(prev => ({ ...prev, [laneKey]: !prev[laneKey] }));
  };

  const runTimeSlicingSimulation = () => {
    setTimeSliceLog([]);
    setIsSimulating(true);

    const logs = [];
    logs.push("⏱️ [Frame 1 Start] Allocated 5ms time-slice to Fiber WorkLoop.");
    logs.push("  -> Processed Fiber #1 (<AppRoot />)");
    logs.push("  -> Processed Fiber #2 (<Header />)");
    logs.push("  -> Processed Fiber #3 (<Navigation />)");
    logs.push("🛑 [Frame 1 Expired] shouldYield() === true! Yielded 16ms frame to browser.");

    setTimeout(() => {
      logs.push("⏱️ [Frame 2 Start] Resumed Fiber WorkLoop from Fiber #4.");
      logs.push("  -> Processed Fiber #4 (<ProductGrid />)");
      logs.push("  -> Processed Fiber #5 (<CartWidget />)");
      logs.push("🛑 [Frame 2 Expired] shouldYield() === true! Yielded to handle user click.");

      setTimeout(() => {
        logs.push("⏱️ [Frame 3 Start] Resumed Fiber WorkLoop.");
        logs.push("  -> Processed Fiber #6 (<Footer />)");
        logs.push("🎉 [Commit Phase] WorkInProgress tree complete! Root pointer swapped.");
        setTimeSliceLog([...logs]);
        setIsSimulating(false);
      }, 500);

      setTimeSliceLog([...logs]);
    }, 500);

    setTimeSliceLog(logs);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 23</span>
          <span className="badge badge-cyan">Fiber Internals</span>
        </div>
        <h3 className="content-title">Fiber Internals, 32-Bit Lanes & Time-Slicing</h3>
        <p className="content-subtitle">
          How React uses bitwise integer operations for 1-CPU-cycle task prioritization and breaks rendering loops into 5ms cooperative time slices.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Cpu size={16} /> 32-Bit Lanes Bitmask</h4>
            <p>
              React packs 31 different priorities into a single 32-bit integer. Merging tasks is <code>lanes | nextLane</code>. Checking if urgent work exists is <code>(lanes & SyncLane) !== 0</code> — taking 1 single CPU cycle!
            </p>
          </div>
          <div className="theory-box">
            <h4><Activity size={16} /> Time-Slicing Work Loop</h4>
            <p>
              <code>workLoopConcurrent</code> checks <code>shouldYield()</code>. If 5ms have passed, it yields to the browser frame via <code>MessageChannel</code> so the UI never drops frames.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Cpu size={18} className="text-cyan-400" />
            Lanes Bitmask Calculator & Time-Slice Stepper
          </div>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            {/* Bitmask Toggles */}
            <div className="state-inspector-card">
              <div className="inspector-title">Active Priority Lanes (Bitmask):</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {[
                  { key: "sync", label: "SyncLane (1: User Click)", bit: "00001" },
                  { key: "continuous", label: "InputContinuous (2: Drag/Scroll)", bit: "00010" },
                  { key: "default", label: "DefaultLane (4: Regular setState)", bit: "00100" },
                  { key: "transition", label: "TransitionLane (8: useTransition)", bit: "01000" },
                  { key: "idle", label: "IdleLane (16: Background/Offscreen)", bit: "10000" }
                ].map(lane => (
                  <label key={lane.key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input 
                      type="checkbox" 
                      checked={activeLanes[lane.key]} 
                      onChange={() => toggleLane(lane.key)} 
                    />
                    <span style={{ flex: 1 }}>{lane.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-blue)" }}>{lane.bit}</span>
                  </label>
                ))}
              </div>

              <div style={{ padding: "12px", background: "var(--code-bg)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Calculated Bitwise Lanes Integer: </span>
                <strong style={{ fontSize: "1.2rem", color: "var(--accent-emerald)" }}>{bitmask}</strong>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-secondary)", marginLeft: "10px" }}>
                  (0b{bitmask.toString(2).padStart(5, "0")})
                </span>
              </div>
            </div>

            {/* Time Slicing Stepper */}
            <div className="state-inspector-card">
              <div className="inspector-title">Time-Sliced WorkLoop Simulation:</div>

              <button 
                className="btn btn-primary"
                onClick={runTimeSlicingSimulation}
                disabled={isSimulating}
                style={{ marginBottom: "16px", width: "100%" }}
              >
                <Play size={14} /> {isSimulating ? "Stepping through frames..." : "Simulate 5ms Time-Sliced Render"}
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
                {timeSliceLog.map((log, i) => (
                  <div 
                    key={i} 
                    style={{
                      padding: "6px 10px",
                      background: log.includes("🛑") ? "rgba(244,63,94,0.15)" : log.includes("🎉") ? "rgba(16,185,129,0.15)" : "var(--bg-secondary)",
                      color: log.includes("🛑") ? "#f87171" : log.includes("🎉") ? "#34d399" : "var(--text-secondary)",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
