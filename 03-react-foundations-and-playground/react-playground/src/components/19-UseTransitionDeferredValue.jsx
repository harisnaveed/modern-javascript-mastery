import React, { useState, useTransition, useDeferredValue } from "react";
import { Zap, Loader2, Sparkles, Filter } from "lucide-react";

// Generate 4,000 mock repair catalog items
const CATALOG_ITEMS = Array.from({ length: 4000 }, (_, i) => ({
  id: i + 1,
  name: `Repair Part #${i + 1} - ${i % 2 === 0 ? "OLED Screen" : "Battery Unit"} Model X${i % 100}`,
  price: 20 + (i % 150)
}));

export default function UseTransitionDeferredValue() {
  const [query, setQuery] = useState("");
  const [useConcurrentTransition, setUseConcurrentTransition] = useState(true);
  const [isPending, startTransition] = useTransition();

  // For useDeferredValue demonstration
  const deferredQuery = useDeferredValue(query);

  const [filteredItems, setFilteredItems] = useState(CATALOG_ITEMS);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val); // Urgent: immediate input update

    if (useConcurrentTransition) {
      // Non-urgent: Defer heavy 4,000-item filtering!
      startTransition(() => {
        // Artificial slow filter calculation
        const filtered = CATALOG_ITEMS.filter(it => 
          it.name.toLowerCase().includes(val.toLowerCase())
        );
        setFilteredItems(filtered);
      });
    } else {
      // Blocking sync update in legacy style
      const filtered = CATALOG_ITEMS.filter(it => 
        it.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-emerald">Module 19</span>
          <span className="badge badge-cyan">Concurrent React</span>
        </div>
        <h3 className="content-title">useTransition & useDeferredValue — Fluid Non-Blocking UI</h3>
        <p className="content-subtitle">
          How React 18 & 19 split updates into <strong>Urgent</strong> (instant keystroke feedback) vs <strong>Transition</strong> (background list filtering).
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Zap size={16} /> Urgent vs Transition</h4>
            <p>
              In traditional React, filtering 4,000 items on every keystroke freezes typing cursor animations. <code>startTransition</code> marks the heavy filtering as interruptible low-priority work.
            </p>
          </div>
          <div className="theory-box">
            <h4><Sparkles size={16} /> isPending Feedback</h4>
            <p>
              <code>useTransition</code> gives you a boolean <code>isPending</code> flag so you can show a subtle loading spinner while the background render completes without blocking user clicks!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Filter size={18} className="text-cyan-400" />
            4,000-Item Catalog Search Filter
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
              <input 
                type="checkbox" 
                checked={useConcurrentTransition} 
                onChange={e => setUseConcurrentTransition(e.target.checked)} 
              />
              Enable useTransition (Non-Blocking)
            </label>
          </div>
        </div>

        <div className="playground-body">
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Search 4,000 Items:
              </label>
              {isPending && (
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--accent-amber)" }}>
                  <Loader2 size={14} className="animate-spin" /> Background Filtering...
                </span>
              )}
            </div>

            <input 
              type="text" 
              placeholder="Type quickly (e.g. Model X24)..."
              value={query}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--code-bg)",
                border: `1px solid ${isPending ? "var(--accent-amber)" : "var(--border-color)"}`,
                borderRadius: "8px",
                color: "white"
              }}
            />
          </div>

          <div className="state-inspector-card">
            <div className="inspector-title">
              Filtered Catalog Items ({filteredItems.length.toLocaleString()} Matches)
            </div>

            <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
              {filteredItems.slice(0, 15).map(item => (
                <div 
                  key={item.id}
                  style={{
                    padding: "8px 12px",
                    background: "var(--bg-secondary)",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem"
                  }}
                >
                  <span>{item.name}</span>
                  <strong style={{ color: "var(--accent-emerald)" }}>${item.price}</strong>
                </div>
              ))}
              {filteredItems.length > 15 && (
                <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", padding: "6px" }}>
                  ...and {filteredItems.length - 15} more matches
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
