import React, { useState } from "react";
import { Smartphone, Laptop, Tablet, CheckCircle, ArrowDown, ArrowUp } from "lucide-react";

// Child 1: Device Selector Component
function DeviceSelector({ selectedDevice, onSelectDevice }) {
  const devices = [
    { id: "smartphone", label: "Smartphone", icon: Smartphone },
    { id: "laptop", label: "Laptop", icon: Laptop },
    { id: "tablet", label: "Tablet", icon: Tablet }
  ];

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
        STEP 1: SELECT DEVICE (Child 1 calling onSelectDevice callback prop)
      </label>
      <div style={{ display: "flex", gap: "10px" }}>
        {devices.map(d => {
          const Icon = d.icon;
          const isSelected = selectedDevice === d.id;
          return (
            <button
              key={d.id}
              className={`btn ${isSelected ? "btn-primary" : "btn-secondary"}`}
              onClick={() => onSelectDevice(d.id)}
            >
              <Icon size={16} />
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Child 2: Brand Selector Component
function BrandSelector({ brands, selectedBrand, onSelectBrand }) {
  if (!brands || brands.length === 0) return null;

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
        STEP 2: SELECT BRAND (Child 2 calling onSelectBrand callback prop)
      </label>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {brands.map(b => (
          <button
            key={b}
            className={`btn ${selectedBrand === b ? "btn-emerald" : "btn-secondary"}`}
            onClick={() => onSelectBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}

// Child 3: Issue Selector Component
function IssueSelector({ issues, selectedIssue, onSelectIssue }) {
  if (!issues || issues.length === 0) return null;

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
        STEP 3: SELECT REPAIR ISSUE (Child 3 calling onSelectIssue callback prop)
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {issues.map(iss => (
          <button
            key={iss.name}
            className={`btn ${selectedIssue === iss.name ? "btn-primary" : "btn-secondary"}`}
            style={{ justifyContent: "space-between" }}
            onClick={() => onSelectIssue(iss.name, iss.cost)}
          >
            <span>{iss.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>${iss.cost}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CallbacksAndProps() {
  const [device, setDevice] = useState("smartphone");
  const [brand, setBrand] = useState("Apple");
  const [issue, setIssue] = useState("Cracked Screen Repair");
  const [price, setPrice] = useState(149);
  const [lastAction, setLastAction] = useState("Default initial state loaded.");

  const brandCatalog = {
    smartphone: ["Apple", "Samsung", "Google Pixel", "OnePlus"],
    laptop: ["Apple MacBook", "Dell", "Lenovo ThinkPad", "HP"],
    tablet: ["Apple iPad", "Samsung Galaxy Tab", "Microsoft Surface"]
  };

  const issueCatalog = [
    { name: "Cracked Screen Repair", cost: 149 },
    { name: "Battery Health Replacement", cost: 79 },
    { name: "Charging Port Failure", cost: 59 },
    { name: "Liquid Damage Diagnostic", cost: 119 }
  ];

  // Callback Prop Handlers
  const handleSelectDevice = (selectedId) => {
    setDevice(selectedId);
    setBrand(brandCatalog[selectedId][0]);
    setLastAction(`Parent received event from Child 1: Device switched to "${selectedId}".`);
  };

  const handleSelectBrand = (selectedBrand) => {
    setBrand(selectedBrand);
    setLastAction(`Parent received event from Child 2: Brand switched to "${selectedBrand}".`);
  };

  const handleSelectIssue = (selectedIssueName, cost) => {
    setIssue(selectedIssueName);
    setPrice(cost);
    setLastAction(`Parent received event from Child 3: Issue switched to "${selectedIssueName}" ($${cost}).`);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-blue">Module 04</span>
          <span className="badge badge-cyan">Architecture</span>
        </div>
        <h3 className="content-title">Callbacks, Higher-Order Functions & React Callback Props</h3>
        <p className="content-subtitle">
          How data flows DOWN via props, and user events flow UP via callback functions passed from parent to children.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><ArrowDown size={16} /> Downward Data Flow</h4>
            <p>
              In React, components can only pass props to their direct children. Props are read-only and immutable to the child.
            </p>
          </div>
          <div className="theory-box">
            <h4><ArrowUp size={16} /> Upward Event Notification</h4>
            <p>
              When a child needs to communicate an event, the parent passes a function prop (e.g. <code>onSelectDevice</code>). The child invokes it with data, executing the parent's handler!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Smartphone size={18} className="text-cyan-400" />
            The Multi-Step Device Repair Widget (Callback Prop Pattern)
          </div>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            <div>
              {/* Child 1 */}
              <DeviceSelector 
                selectedDevice={device} 
                onSelectDevice={handleSelectDevice} 
              />

              {/* Child 2 */}
              <BrandSelector 
                brands={brandCatalog[device]} 
                selectedBrand={brand} 
                onSelectBrand={handleSelectBrand} 
              />

              {/* Child 3 */}
              <IssueSelector 
                issues={issueCatalog} 
                selectedIssue={issue} 
                onSelectIssue={handleSelectIssue} 
              />
            </div>

            {/* Parent State & Invoice View */}
            <div className="state-inspector-card">
              <div className="inspector-title">Parent Component Real-Time Invoice</div>
              
              <div style={{ padding: "16px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Device:</span>
                  <strong>{device.toUpperCase()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Brand:</span>
                  <strong>{brand}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Issue:</span>
                  <strong>{issue}</strong>
                </div>
                <hr style={{ borderColor: "var(--border-color)", margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total Estimate:</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-emerald)" }}>${price}</span>
                </div>
              </div>

              <div className="inspector-title">Callback Bus Audit</div>
              <div style={{ padding: "10px", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "6px", fontSize: "0.85rem", color: "var(--accent-blue)" }}>
                {lastAction}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
