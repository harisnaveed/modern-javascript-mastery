import React, { useState } from "react";
import { 
  GitBranch, Layers, AlertTriangle, CheckCircle, Plus, Trash2, 
  Cpu, ArrowRight, Play, RotateCcw, Shuffle, Sparkles, Database, Check, Eye
} from "lucide-react";

export default function ReactArchitectureFiberReconciliation() {
  const [activeTab, setActiveTab] = useState("architecture"); // 'architecture' | 'fiber' | 'reconciliation'

  // --- TAB 1: ARCHITECTURE PIPELINE STATE ---
  const [pipelineStep, setPipelineStep] = useState(0);
  const pipelineSteps = [
    {
      title: "1. JSX Compilation (React Core)",
      pkg: "react",
      desc: "Babel/SWC transforms JSX into React.createElement() calls returning immutable VDOM object descriptors.",
      code: `const element = {\n  $$typeof: Symbol.for('react.element'),\n  type: 'div',\n  props: { className: 'card', children: 'Hello' }\n};`
    },
    {
      title: "2. Priority Scheduling (Scheduler)",
      pkg: "scheduler",
      desc: "Assigns 32-bit Lanes priority (SyncLane vs DefaultLane vs TransitionLane) and schedules 5ms time slices.",
      code: `// Allocates 5ms execution window\nconst channel = new MessageChannel();\nchannel.port2.postMessage(null); // yields if frame budget exceeded`
    },
    {
      title: "3. Reconciler (Fiber WorkLoop)",
      pkg: "react-reconciler",
      desc: "Builds workInProgress Fiber linked list. Traverses via child, sibling, return. Calculates diffs (O(n)).",
      code: `while (workInProgress !== null && !shouldYield()) {\n  workInProgress = performUnitOfWork(workInProgress);\n}`
    },
    {
      title: "4. Host Commit (React DOM)",
      pkg: "react-dom",
      desc: "Synchronously mutates physical browser DOM (appendChild, removeChild), then swaps root.current pointer.",
      code: `// Commit Phase (Synchronous)\nparentDOM.insertBefore(childDOM, beforeNode);\nroot.current = workInProgress; // Instant Double-Buffering Swap!`
    }
  ];

  // --- TAB 2: FIBER LINKED LIST & DOUBLE BUFFERING STATE ---
  const fiberTree = [
    { id: "root", name: "HostRoot", tag: "FiberRoot", child: "app", sibling: null, return: null, depth: 0 },
    { id: "app", name: "<App />", tag: "FunctionComponent", child: "nav", sibling: null, return: "root", depth: 1 },
    { id: "nav", name: "<Navbar />", tag: "HostComponent", child: null, sibling: "main", return: "app", depth: 2 },
    { id: "main", name: "<Main />", tag: "HostComponent", child: "list", sibling: null, return: "app", depth: 2 },
    { id: "list", name: "<RepairQueue />", tag: "FunctionComponent", child: "item1", sibling: null, return: "main", depth: 3 },
    { id: "item1", name: "<Item #1 />", tag: "HostComponent", child: null, sibling: "item2", return: "list", depth: 4 },
    { id: "item2", name: "<Item #2 />", tag: "HostComponent", child: null, sibling: null, return: "list", depth: 4 },
  ];

  const [activeFiberIndex, setActiveFiberIndex] = useState(0);
  const [isWorkInProgress, setIsWorkInProgress] = useState(false);
  const [doubleBufferRoot, setDoubleBufferRoot] = useState("current"); // "current" | "workInProgress"

  const handleStepFiber = () => {
    setIsWorkInProgress(true);
    if (activeFiberIndex < fiberTree.length - 1) {
      setActiveFiberIndex(prev => prev + 1);
    } else {
      // Reached the end, trigger commit swap!
      setDoubleBufferRoot(prev => prev === "current" ? "workInProgress" : "current");
      setActiveFiberIndex(0);
      setIsWorkInProgress(false);
    }
  };

  const handleResetFiber = () => {
    setActiveFiberIndex(0);
    setIsWorkInProgress(false);
    setDoubleBufferRoot("current");
  };

  // --- TAB 3: RECONCILIATION & KEY BUG STATE ---
  const [useIndexAsKey, setUseIndexAsKey] = useState(false);
  const [items, setItems] = useState([
    { id: "task_1", name: "Replace iPhone 14 Battery", note: "Customer waiting" },
    { id: "task_2", name: "Diagnose MacBook Pro Screen", note: "Backlight issue" },
    { id: "task_3", name: "Solder Dell USB-C Port", note: "Pin 4 loose" }
  ]);

  const [simulatedDiff, setSimulatedDiff] = useState(null);

  const handlePrepend = () => {
    const newItem = {
      id: `task_${Date.now().toString().slice(-4)}`,
      name: `Emergency Repair #${Math.floor(Math.random() * 900 + 100)}`,
      note: ""
    };
    setItems(prev => [newItem, ...prev]);

    // Simulate diff output
    setSimulatedDiff({
      action: "PREPEND",
      newKey: newItem.id,
      indexUsed: useIndexAsKey,
      explanation: useIndexAsKey 
        ? "⚠️ Index as key caused all items to shift indices: React reuses existing DOM nodes at index 0..n and updates their props, but preserves uncontrolled input values in their original positions, causing state corruption!" 
        : "✅ Stable ID key allowed React's 2-Pass Diffing to match existing keys instantly in O(1) via Map lookup. Only 1 DOM 'Placement' insertion operation was executed!"
    });
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
    setSimulatedDiff({
      action: "DELETE",
      newKey: id,
      indexUsed: useIndexAsKey,
      explanation: useIndexAsKey
        ? "⚠️ With index as key, deleting an item changes the index of all subsequent items, forcing React to re-render every following row."
        : "✅ With unique ID, React immediately flags the matching Fiber with 'ChildDeletion' and removes exactly one DOM node."
    });
  };

  return (
    <div>
      {/* Header Theory Card */}
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 12</span>
          <span className="badge badge-cyan">Architecture Internals</span>
          <span className="badge badge-emerald">Fiber & Reconciliation</span>
        </div>
        <h3 className="content-title">React Structure, Fiber Architecture & Reconciliation</h3>
        <p className="content-subtitle">
          How React is structured under the hood: from 4 core packages to singly linked-list Fiber trees, O(n) diffing heuristics, and double-buffering.
        </p>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button 
            className={`btn ${activeTab === "architecture" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("architecture")}
          >
            <Cpu size={16} /> 1. React 4-Layer Architecture
          </button>
          <button 
            className={`btn ${activeTab === "fiber" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("fiber")}
          >
            <GitBranch size={16} /> 2. Fiber Linked List & Double Buffering
          </button>
          <button 
            className={`btn ${activeTab === "reconciliation" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab("reconciliation")}
          >
            <Layers size={16} /> 3. Reconciliation & Key Heuristics
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REACT 4-LAYER STRUCTURE & RUNTIME PIPELINE */}
      {/* ========================================================================= */}
      {activeTab === "architecture" && (
        <div className="playground-card">
          <div className="playground-header">
            <div className="playground-title">
              <Cpu size={18} className="text-cyan-400" />
              The 4 Internal Packages of React
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                className="btn btn-secondary"
                disabled={pipelineStep === 0}
                onClick={() => setPipelineStep(prev => prev - 1)}
              >
                Previous Step
              </button>
              <button 
                className="btn btn-primary"
                disabled={pipelineStep === pipelineSteps.length - 1}
                onClick={() => setPipelineStep(prev => prev + 1)}
              >
                Next Pipeline Stage <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="playground-body">
            {/* Visual 4-Box Pipeline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
              {pipelineSteps.map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => setPipelineStep(idx)}
                  style={{
                    padding: "14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: pipelineStep === idx ? "2px solid var(--accent-blue)" : "1px solid var(--border-color)",
                    background: pipelineStep === idx ? "rgba(56, 189, 248, 0.12)" : "var(--bg-secondary)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-blue)" }}>STEP {idx + 1}</span>
                    <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>{step.pkg}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "white" }}>{step.title.split("(")[0]}</div>
                </div>
              ))}
            </div>

            {/* Active Stage Inspector */}
            <div className="state-inspector-card" style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="inspector-title" style={{ fontSize: "1rem", color: "var(--accent-blue)" }}>
                  {pipelineSteps[pipelineStep].title}
                </div>
                <span className="badge badge-emerald">Internal Package: npm/{pipelineSteps[pipelineStep].pkg}</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "10px 0 16px 0", lineHeight: 1.6 }}>
                {pipelineSteps[pipelineStep].desc}
              </p>
              <pre style={{ 
                background: "var(--code-bg)", 
                padding: "14px", 
                borderRadius: "6px", 
                color: "#7dd3fc", 
                fontSize: "0.82rem",
                overflowX: "auto",
                border: "1px solid var(--border-color)"
              }}>
                {pipelineSteps[pipelineStep].code}
              </pre>
            </div>

            {/* Architecture Overview Comparison */}
            <div className="theory-grid">
              <div className="theory-box">
                <h4><Database size={15} /> Stack Reconciler (Pre-React 16)</h4>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                  Relied on synchronous JavaScript recursion. If a component tree was deep, rendering blocked the browser call stack for 30-100ms, causing dropped frames and unclickable buttons.
                </p>
              </div>
              <div className="theory-box">
                <h4><Sparkles size={15} /> Fiber Reconciler (React 16 to 19+)</h4>
                <p style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                  Transforms the tree into a linked list where every unit of work can be paused, aborted, or reprioritized based on 32-bit Lanes priority bitmasks. High-priority user input is never blocked!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FIBER LINKED LIST & DOUBLE BUFFERING */}
      {/* ========================================================================= */}
      {activeTab === "fiber" && (
        <div className="playground-card">
          <div className="playground-header">
            <div className="playground-title">
              <GitBranch size={18} className="text-cyan-400" />
              Fiber Linked List Traversal & Double-Buffering Visualizer
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary" onClick={handleResetFiber}>
                <RotateCcw size={14} /> Reset
              </button>
              <button className="btn btn-primary" onClick={handleStepFiber}>
                <Play size={14} /> {activeFiberIndex === fiberTree.length - 1 ? "Commit & Swap Root!" : "Step Fiber WorkLoop"}
              </button>
            </div>
          </div>

          <div className="playground-body">
            {/* Double Buffering Status Indicator */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "12px 18px", 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Active Root Pointer: </span>
                <strong style={{ color: doubleBufferRoot === "current" ? "var(--accent-emerald)" : "var(--accent-amber)" }}>
                  root.{doubleBufferRoot}
                </strong>
                <span style={{ marginLeft: "12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  ({doubleBufferRoot === "current" ? "Visible on screen" : "Background work tree"})
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span className={`badge ${doubleBufferRoot === "current" ? "badge-emerald" : "badge-blue"}`}>
                  current tree
                </span>
                <span className={`badge ${doubleBufferRoot === "workInProgress" ? "badge-amber" : "badge-purple"}`}>
                  workInProgress tree
                </span>
              </div>
            </div>

            {/* Interactive Fiber Linked List Nodes */}
            <div className="inspector-title" style={{ marginBottom: "12px" }}>
              Traversing Fiber Pointers (child ➔, sibling ⬇, return ⬆):
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {fiberTree.map((node, index) => {
                const isActive = isWorkInProgress && activeFiberIndex === index;
                const isVisited = isWorkInProgress && activeFiberIndex > index;

                return (
                  <div 
                    key={node.id}
                    style={{
                      marginLeft: `${node.depth * 28}px`,
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: isActive 
                        ? "2px solid var(--accent-amber)" 
                        : isVisited 
                        ? "1px solid rgba(16, 185, 129, 0.4)" 
                        : "1px solid var(--border-color)",
                      background: isActive 
                        ? "rgba(245, 158, 11, 0.15)" 
                        : isVisited 
                        ? "rgba(16, 185, 129, 0.08)" 
                        : "var(--bg-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className={`badge ${isActive ? "badge-amber" : isVisited ? "badge-emerald" : "badge-blue"}`}>
                        {isActive ? "ACTIVE FIBER" : isVisited ? "COMPLETED" : "PENDING"}
                      </span>
                      <strong style={{ fontSize: "0.95rem", color: "white" }}>{node.name}</strong>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>tag: {node.tag}</span>
                    </div>

                    <div style={{ display: "flex", gap: "16px", fontSize: "0.78rem", fontFamily: "monospace" }}>
                      <span style={{ color: node.child ? "#38bdf8" : "var(--text-muted)" }}>
                        child: {node.child ? `➔ ${node.child}` : "null"}
                      </span>
                      <span style={{ color: node.sibling ? "#a855f7" : "var(--text-muted)" }}>
                        sibling: {node.sibling ? `⬇ ${node.sibling}` : "null"}
                      </span>
                      <span style={{ color: node.return ? "#10b981" : "var(--text-muted)" }}>
                        return: {node.return ? `⬆ ${node.return}` : "null"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation box */}
            <div className="state-inspector-card">
              <div className="inspector-title">💡 Why Fiber's Singly Linked List is Revolutionary:</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Because each fiber node stores explicit pointers (<code>child</code>, <code>sibling</code>, <code>return</code>), React does <strong>not</strong> need to keep execution frames on JavaScript's native Call Stack. At any point inside <code>workLoopConcurrent</code>, if <code>shouldYield()</code> returns true (5ms slice elapsed), React saves the current fiber pointer in memory, relinquishes the thread to the browser, and resumes later at the exact same fiber node without restarting from the root!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RECONCILIATION & KEY HEURISTICS */}
      {/* ========================================================================= */}
      {activeTab === "reconciliation" && (
        <div className="playground-card">
          <div className="playground-header">
            <div className="playground-title">
              <Layers size={18} className="text-cyan-400" />
              Reconciliation & Key Heuristics Lab
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                className={`btn ${useIndexAsKey ? "btn-danger" : "btn-secondary"}`}
                onClick={() => setUseIndexAsKey(true)}
              >
                <AlertTriangle size={14} /> Index as Key (Buggy)
              </button>
              <button 
                className={`btn ${!useIndexAsKey ? "btn-emerald" : "btn-secondary"}`}
                onClick={() => setUseIndexAsKey(false)}
              >
                <CheckCircle size={14} /> Unique ID as Key (Correct)
              </button>
            </div>
          </div>

          <div className="playground-body">
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
              <button className="btn btn-primary" onClick={handlePrepend}>
                <Plus size={16} /> Prepend New Item to Top of List
              </button>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Active Key Strategy: <strong>{useIndexAsKey ? "key={index}" : "key={item.id}"}</strong>
              </span>
            </div>

            {/* Live Diff Diagnostics */}
            {simulatedDiff && (
              <div style={{ 
                padding: "14px 18px", 
                borderRadius: "8px", 
                marginBottom: "20px",
                border: simulatedDiff.indexUsed ? "1px solid rgba(244, 63, 94, 0.4)" : "1px solid rgba(16, 185, 129, 0.4)",
                background: simulatedDiff.indexUsed ? "rgba(244, 63, 94, 0.1)" : "rgba(16, 185, 129, 0.1)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  {simulatedDiff.indexUsed ? <AlertTriangle size={16} color="#fb7185" /> : <CheckCircle size={16} color="#34d399" />}
                  <strong style={{ fontSize: "0.9rem", color: simulatedDiff.indexUsed ? "#fb7185" : "#34d399" }}>
                    Diffing Result: {simulatedDiff.action} with {simulatedDiff.indexUsed ? "key={index}" : "key={id}"}
                  </strong>
                </div>
                <div style={{ fontSize: "0.83rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {simulatedDiff.explanation}
                </div>
              </div>
            )}

            <div className="grid-2">
              <div>
                <div className="inspector-title">Active Component List:</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {items.map((item, index) => (
                    <div 
                      key={useIndexAsKey ? index : item.id}
                      style={{
                        padding: "12px 16px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>
                            {useIndexAsKey ? `key: ${index}` : `key: "${item.id}"`}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{item.name}</span>
                        </div>
                        <input 
                          type="text" 
                          defaultValue={item.note}
                          placeholder="Type personal note (e.g. 'Priority Customer')..."
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            background: "var(--code-bg)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.8rem"
                          }}
                        />
                      </div>

                      <button 
                        className="btn btn-danger" 
                        style={{ padding: "6px 10px" }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="state-inspector-card">
                <div className="inspector-title">🧪 How to Trigger the Reconciliation State Bug:</div>
                <ol style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  <li>Click <strong>"Index as Key (Buggy)"</strong> above.</li>
                  <li>In the top task's text box, type: <code>"VIP Urgency: Client waiting!"</code>.</li>
                  <li>Now click <strong>"Prepend New Item to Top of List"</strong>.</li>
                  <li>
                    <strong>Notice the bug:</strong> The text you typed stays stuck in the <em>first row</em> (which is now a completely different repair item!), instead of traveling with the original iPhone repair task!
                  </li>
                  <li>Now switch to <strong>"Unique ID as Key (Correct)"</strong> and repeat — your text travels with its true owner!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
