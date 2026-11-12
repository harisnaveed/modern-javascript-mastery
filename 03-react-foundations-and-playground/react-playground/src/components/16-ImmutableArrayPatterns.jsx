import React, { useState } from "react";
import { ListPlus, ArrowDown, ArrowUp, Trash2, Edit3, ArrowUpDown, Layers, Plus } from "lucide-react";

export default function ImmutableArrayPatterns() {
  const [tasks, setTasks] = useState([
    { id: 101, title: "Diagnostic check", cost: 30, completed: false },
    { id: 102, title: "Clean thermal paste", cost: 20, completed: false },
    { id: 103, title: "Replace laptop fan", cost: 65, completed: true }
  ]);

  const [order, setOrder] = useState({
    customer: "Haris Ali",
    city: "Wah Cantt",
    devices: [
      {
        deviceId: "dev_1",
        model: "MacBook Pro M1",
        parts: [{ id: "p1", name: "Retina Display", price: 320 }]
      }
    ]
  });

  const [log, setLog] = useState("Array state loaded with 3 items.");

  // 1. Appending
  const handleAppend = () => {
    const nextId = Date.now() % 10000;
    const newItem = { id: nextId, title: `New Repair Task #${nextId}`, cost: 45, completed: false };
    setTasks(prev => [...prev, newItem]);
    setLog(`[Append] Added Task #${nextId} to end of array using [...prev, newItem].`);
  };

  // 2. Prepending
  const handlePrepend = () => {
    const nextId = Date.now() % 10000;
    const newItem = { id: nextId, title: `Urgent Diagnostic #${nextId}`, cost: 50, completed: false };
    setTasks(prev => [newItem, ...prev]);
    setLog(`[Prepend] Added Task #${nextId} to beginning of array using [newItem, ...prev].`);
  };

  // 3. Insert at Index 1
  const handleInsertAt = () => {
    const nextId = Date.now() % 10000;
    const newItem = { id: nextId, title: `Priority Solder #${nextId}`, cost: 70, completed: false };
    setTasks(prev => [...prev.slice(0, 1), newItem, ...prev.slice(1)]);
    setLog(`[Insert at Index 1] Inserted item between index 0 and index 1.`);
  };

  // 4. Remove by ID
  const handleRemove = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setLog(`[Remove] Removed task ${id} using prev.filter(t => t.id !== ${id}).`);
  };

  // 5. Update by ID
  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    setLog(`[Update] Toggled completion status of task ${id} using prev.map().`);
  };

  // 6. Sort Immutably
  const handleSortByCost = () => {
    setTasks(prev => prev.toSorted((a, b) => b.cost - a.cost));
    setLog(`[ES2023 toSorted] Sorted tasks by cost (highest first) without mutating original array!`);
  };

  // Nested Multi-level update
  const handleAddNestedPart = () => {
    setOrder(prev => ({
      ...prev,
      devices: prev.devices.map(dev => 
        dev.deviceId === "dev_1"
          ? {
              ...dev,
              parts: [
                ...dev.parts,
                { id: `p_${Date.now() % 1000}`, name: "99Wh OEM Battery", price: 110 }
              ]
            }
          : dev
      )
    }));
    setLog(`[Nested Update] Added part to dev_1 without mutating parent references!`);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-emerald">Module 16</span>
          <span className="badge badge-blue">Array Mastery</span>
        </div>
        <h3 className="content-title">The 6 Immutable Array Patterns & Deep Nested Updates</h3>
        <p className="content-subtitle">
          Mastering modern declarative array operations: appending, prepending, filtering, mapping, and ES2023 non-mutating methods.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><ListPlus size={16} /> Golden Rules</h4>
            <p>
              Never call <code>push()</code>, <code>pop()</code>, or <code>splice()</code> on React state! Always return a fresh array using the spread operator <code>[...prev]</code>, <code>filter()</code>, <code>map()</code>, or ES2023 <code>toSorted()</code>.
            </p>
          </div>
          <div className="theory-box">
            <h4><Layers size={16} /> Deep Nested Immutability</h4>
            <p>
              When modifying an array inside an object inside an array, you must clone each layer along the path of mutation using <code>{`{ ...obj, list: obj.list.map(...) }`}</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <ListPlus size={18} className="text-emerald-400" />
            Interactive Array Operations Workbench
          </div>
          <span className="badge badge-purple">Items: {tasks.length}</span>
        </div>

        <div className="playground-body">
          {/* Action Toolbar */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <button className="btn btn-primary" onClick={handleAppend}>
              <ArrowDown size={14} /> 1. Append (to end)
            </button>
            <button className="btn btn-secondary" onClick={handlePrepend}>
              <ArrowUp size={14} /> 2. Prepend (to start)
            </button>
            <button className="btn btn-secondary" onClick={handleInsertAt}>
              <Plus size={14} /> 3. Insert at Index 1
            </button>
            <button className="btn btn-secondary" onClick={handleSortByCost}>
              <ArrowUpDown size={14} /> 6. toSorted (By Cost)
            </button>
            <button className="btn btn-emerald" onClick={handleAddNestedPart}>
              <Layers size={14} /> Nested Update (Add Part)
            </button>
          </div>

          <div className="grid-2">
            {/* List View */}
            <div>
              <div className="inspector-title">Active Task Array State:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    style={{
                      padding: "10px 14px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginRight: "8px" }}>[{idx}]</span>
                      <strong style={{ textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "var(--text-muted)" : "var(--text-primary)" }}>
                        {task.title}
                      </strong>
                      <span style={{ marginLeft: "8px", fontSize: "0.8rem", color: "var(--accent-emerald)" }}>${task.cost}</span>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button 
                        className={`btn ${task.completed ? "btn-emerald" : "btn-secondary"}`}
                        style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                        onClick={() => handleToggleComplete(task.id)}
                      >
                        {task.completed ? "Done" : "Pending"}
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: "4px 8px" }}
                        onClick={() => handleRemove(task.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nested Inspector */}
            <div className="state-inspector-card">
              <div className="inspector-title">Nested Order JSON (Multi-layer clone):</div>
              <pre className="code-preview" style={{ maxHeight: "200px" }}>
{JSON.stringify(order, null, 2)}
              </pre>

              <div style={{ marginTop: "16px", padding: "10px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "6px", fontSize: "0.85rem", color: "var(--accent-blue)" }}>
                {log}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
