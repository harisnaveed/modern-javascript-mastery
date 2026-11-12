import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, RefreshCw, Layers } from "lucide-react";

export default function MutabilityImmutability() {
  const [user, setUser] = useState({
    name: "Haris Ali",
    age: 25,
    role: "Full-Stack Engineer",
    address: {
      city: "Wah Cantt",
      country: "Pakistan"
    }
  });

  const [renderCount, setRenderCount] = useState(1);
  const [logMessage, setLogMessage] = useState("Component mounted. Ready for interaction.");
  const [logType, setLogType] = useState("info");

  // ANTI-PATTERN: Mutating state directly
  const handleMutateDirectly = () => {
    // ⚠️ Mutating the existing object in-place:
    user.age = user.age + 1;
    
    // Passing the SAME reference to React:
    setUser(user);

    // React's Object.is(prev, next) evaluates to TRUE!
    setLogMessage("⚠️ MUTATION DETECTED: user.age was updated in memory, but setUser(user) passed the same pointer! Object.is(prev, next) === true. React SKIPPED re-rendering!");
    setLogType("danger");
  };

  // CORRECT: Immutable update via Spread Operator
  const handleImmutableUpdate = () => {
    setUser(prev => ({
      ...prev,
      age: prev.age + 1
    }));
    setRenderCount(c => c + 1);
    setLogMessage("✅ IMMUTABLE UPDATE: Created brand new object reference via { ...prev, age: prev.age + 1 }. React detected reference change and re-rendered successfully!");
    setLogType("success");
  };

  // Nested Immutable Update
  const handleUpdateNestedCity = () => {
    const cities = ["Islamabad", "Lahore", "Karachi", "Wah Cantt", "Rawalpindi"];
    const nextCity = cities[(cities.indexOf(user.address.city) + 1) % cities.length];

    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: nextCity
      }
    }));
    setRenderCount(c => c + 1);
    setLogMessage(`✅ NESTED IMMUTABLE UPDATE: Cloned parent and address object to update city to "${nextCity}".`);
    setLogType("success");
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-blue">Module 01</span>
          <span className="badge badge-emerald">Core Foundation</span>
        </div>
        <h3 className="content-title">Mutable vs Immutable in JavaScript & React</h3>
        <p className="content-subtitle">
          Why mutating state directly freezes your UI, and how React uses <code>Object.is()</code> reference equality to schedule re-renders.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><AlertTriangle size={16} /> The Direct Mutation Trap</h4>
            <p>
              In JavaScript, objects and arrays are stored on the heap and passed by pointer reference. If you write <code>user.age = 26; setUser(user);</code>, React compares the previous pointer with the next pointer. Since both point to the same memory address, React assumes nothing changed and skips the update.
            </p>
          </div>
          <div className="theory-box">
            <h4><CheckCircle2 size={16} /> The Immutable Solution</h4>
            <p>
              Always return a NEW object or array reference using the spread operator <code>{`{ ...prev, age: 26 }`}</code> or ES2023 non-mutating methods like <code>toSorted()</code>. This gives React a new memory address, triggering an immediate render.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <RefreshCw size={18} className="text-cyan-400" />
            Live State Mutation vs Immutable Reference Visualizer
          </div>
          <span className="badge badge-purple">Render Count: {renderCount}</span>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            <div className="state-inspector-card">
              <div className="inspector-title">Current React State (JSON Inspector)</div>
              <pre className="code-preview">
{JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="state-inspector-card">
              <div className="inspector-title">Interactive Action Controls</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button className="btn btn-danger" onClick={handleMutateDirectly}>
                  <AlertTriangle size={16} />
                  Mutate State Directly (user.age++)
                </button>
                <button className="btn btn-emerald" onClick={handleImmutableUpdate}>
                  <CheckCircle2 size={16} />
                  Immutable Update (Spread Operator)
                </button>
                <button className="btn btn-secondary" onClick={handleUpdateNestedCity}>
                  <Layers size={16} />
                  Update Nested City (Deep Path)
                </button>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div className="inspector-title">Live Action Log</div>
                <div style={{
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  background: logType === "danger" ? "rgba(244,63,94,0.15)" : logType === "success" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                  color: logType === "danger" ? "#fda4af" : logType === "success" ? "#6ee7b7" : "#94a3b8",
                  border: `1px solid ${logType === "danger" ? "rgba(244,63,94,0.3)" : logType === "success" ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`
                }}>
                  {logMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
