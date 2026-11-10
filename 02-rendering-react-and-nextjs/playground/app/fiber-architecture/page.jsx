"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

export default function FiberArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState("App");
  const [isPending, startTransition] = useTransition();
  const [filterText, setFilterText] = useState("");
  const [items, setItems] = useState(() => Array.from({ length: 400 }, (_, i) => `Catalog Item #${i + 1}`));
  const [clickCount, setClickCount] = useState(0);

  // Fiber Node Definitions
  const fiberTree = {
    App: {
      type: "App",
      child: "Header",
      sibling: "null",
      return: "HostRoot",
      flags: "PerformedWork",
      memoizedState: "{ user: 'Admin' }",
    },
    Header: {
      type: "Header",
      child: "NavBar",
      sibling: "MainContent",
      return: "App",
      flags: "NoFlags",
      memoizedState: "null",
    },
    NavBar: {
      type: "nav",
      child: "null",
      sibling: "null",
      return: "Header",
      flags: "NoFlags",
      memoizedState: "null",
    },
    MainContent: {
      type: "main",
      child: "ItemList",
      sibling: "Sidebar",
      return: "App",
      flags: "Update",
      memoizedState: "{ scrollY: 120 }",
    },
    ItemList: {
      type: "ul",
      child: "null",
      sibling: "null",
      return: "MainContent",
      flags: "Placement",
      memoizedState: "null",
    },
    Sidebar: {
      type: "aside",
      child: "null",
      sibling: "null",
      return: "App",
      flags: "NoFlags",
      memoizedState: "null",
    },
  };

  function handleSearchWithTransition(e) {
    const val = e.target.value;
    // 1. URGENT PRIORITY (Typed character renders immediately!)
    setFilterText(val);

    // 2. LOW PRIORITY TRANSITION (Time-sliced work in React 19 Fiber)
    startTransition(() => {
      const filtered = Array.from({ length: 400 }, (_, i) => `Catalog Item #${i + 1}`)
        .filter((item) => item.toLowerCase().includes(val.toLowerCase()));
      setItems(filtered);
    });
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 06: React Fiber Architecture & Scheduling</h1>
        <span className="badge badge-purple">React 19 Engine</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Prior to React 16, React used a synchronous <strong>Stack Reconciler</strong> that blocked the browser main thread until an entire tree was rendered.
        <strong>Fiber</strong> replaced recursion with a singly linked list (<code>child</code>, <code>sibling</code>, <code>return</code>), enabling time-slicing and interruptible rendering.
      </p>

      {/* Fiber Tree Explorer */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">1. Fiber Singly Linked List Node Inspector</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Click any Fiber in the linked list below to inspect its internal Fiber fields:
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          {Object.keys(fiberTree).map((nodeName) => (
            <button
              key={nodeName}
              onClick={() => setSelectedNode(nodeName)}
              className="button"
              style={{
                background: selectedNode === nodeName ? "var(--accent-purple)" : "var(--bg-page)",
                border: "1px solid var(--border)",
                color: "#fff",
              }}
            >
              Fiber: &lt;{nodeName} /&gt;
            </button>
          ))}
        </div>

        {/* Selected Fiber Details */}
        <div
          style={{
            padding: "16px",
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>child pointer:</span>
            <div style={{ fontWeight: 600, color: "var(--accent-blue)" }}>{fiberTree[selectedNode].child}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>sibling pointer:</span>
            <div style={{ fontWeight: 600, color: "var(--accent-green)" }}>{fiberTree[selectedNode].sibling}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>return (parent):</span>
            <div style={{ fontWeight: 600, color: "var(--accent-amber)" }}>{fiberTree[selectedNode].return}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Effect Flags:</span>
            <div style={{ fontWeight: 600, color: "var(--accent-red)" }}>{fiberTree[selectedNode].flags}</div>
          </div>
        </div>
      </div>

      {/* Time-Slicing Scheduler Simulator */}
      <div className="card">
        <h2 className="card-title">2. Time-Slicing & Priority Scheduling (React 19 useTransition)</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Fiber allows React to pause rendering low-priority items (400 catalog rows) to keep high-priority user interactions responsive.
        </p>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={filterText}
            onChange={handleSearchWithTransition}
            placeholder="Type fast here (e.g. 5, 22, 9)..."
            style={{
              padding: "10px 14px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "#fff",
              minWidth: "260px",
            }}
          />

          <button
            onClick={() => setClickCount((c) => c + 1)}
            className="button"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            Click Me Rapidly! ({clickCount})
          </button>

          {isPending && (
            <span className="badge badge-amber" style={{ animation: "pulse 1s infinite" }}>
              ⏳ Fiber Time-Slicing in progress...
            </span>
          )}
        </div>

        <div
          style={{
            maxHeight: "150px",
            overflowY: "auto",
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "8px",
            fontSize: "0.8rem",
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: "3px 6px", borderBottom: "1px solid #1e293b" }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
