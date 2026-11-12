import React, { useState } from "react";
import { GitCommit, Layers, ArrowRight, Plus, Trash2, Shuffle } from "lucide-react";

export default function DeepReconciliationTwoPass() {
  const [items, setItems] = useState([
    { key: "A", name: "Screen Replacement" },
    { key: "B", name: "Battery Replacement" },
    { key: "C", name: "Charging Port Solder" }
  ]);

  const [opsAudit, setOpsAudit] = useState([
    "Initial tree mounted with keys: [A, B, C]."
  ]);

  const handlePrepend = () => {
    const newKey = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (Date.now() % 100);
    const newItem = { key: newKey, name: `Emergency Diagnostic #${newKey}` };
    setItems(prev => [newItem, ...prev]);
    setOpsAudit(prev => [
      `[Pass 1 Mismatch] Key "${newKey}" prepended at index 0. Pass 1 broken! Pass 2 constructed Map<key, Fiber> to preserve existing items without remounting DOM!`,
      ...prev.slice(0, 3)
    ]);
  };

  const handleShuffle = () => {
    setItems(prev => [...prev].sort(() => Math.random() - 0.5));
    setOpsAudit(prev => [
      `[Pass 2 Map Lookup] Items reordered. React looked up keys in Map in O(1) time and generated MOVE_OR_UPDATE flags!`,
      ...prev.slice(0, 3)
    ]);
  };

  const handleDelete = (key) => {
    setItems(prev => prev.filter(it => it.key !== key));
    setOpsAudit(prev => [
      `[Pass 2 Deletion] Item "${key}" missing in new array. React marked Fiber with DELETION flag!`,
      ...prev.slice(0, 3)
    ]);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 22</span>
          <span className="badge badge-cyan">Reconciliation</span>
        </div>
        <h3 className="content-title">Deep Reconciliation & The 2-Pass Diffing Algorithm</h3>
        <p className="content-subtitle">
          How React converts an O(n³) tree-matching algorithm into an O(n) linear scan by using <strong>Pass 1 (Index scan)</strong> and <strong>Pass 2 (Map-based lookup)</strong>.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Layers size={16} /> Pass 1: Linear Scan</h4>
            <p>
              React walks old fibers and new elements side-by-side by index. As long as keys match, DOM nodes are reused in-place. If an item was prepended, Pass 1 breaks immediately!
            </p>
          </div>
          <div className="theory-box">
            <h4><GitCommit size={16} /> Pass 2: Map Lookup</h4>
            <p>
              React packs remaining old fibers into a <code>Map&lt;key, Fiber&gt;</code>. It then loops through new elements, finding matching fibers in O(1) time to move or update them!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <GitCommit size={18} className="text-cyan-400" />
            2-Pass Diffing Workbench
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={handlePrepend}>
              <Plus size={14} /> Prepend Item (Breaks Pass 1)
            </button>
            <button className="btn btn-secondary" onClick={handleShuffle}>
              <Shuffle size={14} /> Shuffle Order (Pass 2 Move)
            </button>
          </div>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            <div>
              <div className="inspector-title">Active Fiber Keys:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {items.map((it, idx) => (
                  <div
                    key={it.key}
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
                      <span className="badge badge-purple" style={{ marginRight: "8px" }}>key: "{it.key}"</span>
                      <span>{it.name}</span>
                    </div>

                    <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(it.key)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="state-inspector-card">
              <div className="inspector-title">Reconciliation Engine Audit Trail:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {opsAudit.map((op, i) => (
                  <div key={i} style={{ padding: "8px 12px", background: "var(--code-bg)", borderRadius: "6px", fontSize: "0.82rem", color: "var(--text-secondary)", borderLeft: "3px solid var(--accent-blue)" }}>
                    {op}
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
