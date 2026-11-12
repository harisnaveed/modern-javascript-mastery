import React, { useState, useCallback, memo } from "react";
import { Zap, Eye, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

// Memoized Child Component
const MemoizedChild = memo(function MemoizedChild({ title, onAction }) {
  const [renderCount, setRenderCount] = useState(0);

  // Track render count inside child
  React.useEffect(() => {
    setRenderCount(c => c + 1);
  });

  return (
    <div style={{
      padding: "20px",
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      transition: "all 0.3s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <strong style={{ color: "var(--accent-blue)" }}>[Child Component: React.memo]</strong>
        <span className="badge badge-purple">Child Render Count: {renderCount}</span>
      </div>

      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
        Prop Title: <strong>"{title}"</strong>
      </p>

      <button className="btn btn-secondary" onClick={onAction}>
        Trigger Child Action Callback
      </button>
    </div>
  );
});

export default function ReferentialEqualityAndMemo() {
  const [parentCount, setParentCount] = useState(0);
  const [childTitle, setChildTitle] = useState("Product Card #101");
  const [useStableCallback, setUseStableCallback] = useState(false);
  const [parentRenders, setParentRenders] = useState(1);

  // 1. INLINE CALLBACK (New reference on EVERY parent render!)
  const handleInlineAction = () => {
    console.log("Inline callback clicked");
  };

  // 2. STABLE CALLBACK via useCallback (Exact same reference preserved!)
  const handleStableAction = useCallback(() => {
    console.log("Stable callback clicked");
  }, []); // Empty dependencies = constant pointer

  const handleIncrementParent = () => {
    setParentCount(c => c + 1);
    setParentRenders(r => r + 1);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 10</span>
          <span className="badge badge-emerald">Optimization</span>
        </div>
        <h3 className="content-title">Referential Equality & React.memo Optimization</h3>
        <p className="content-subtitle">
          Why <code>React.memo</code> does shallow prop comparison (<code>Object.is</code>), and how passing inline arrow functions breaks memoization.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><AlertTriangle size={16} /> The Inline Function Trap</h4>
            <p>
              In JavaScript, <code>{`(() => {}) === (() => {})`}</code> evaluates to <strong>false</strong>! Every time the parent renders, a new function pointer is created. <code>React.memo</code> sees a new prop reference and re-renders the child anyway.
            </p>
          </div>
          <div className="theory-box">
            <h4><CheckCircle size={16} /> The useCallback Solution</h4>
            <p>
              Wrapping the callback in <code>useCallback(fn, [])</code> preserves the exact same memory pointer across parent renders, allowing <code>React.memo</code> to successfully skip child re-renders!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Zap size={18} className="text-purple-400" />
            Live Memoization & Re-render Visualizer
          </div>
          <span className="badge badge-blue">Parent Renders: {parentRenders}</span>
        </div>

        <div className="playground-body">
          {/* Controls */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleIncrementParent}>
              <RefreshCw size={16} />
              Re-render Parent (Count: {parentCount})
            </button>

            <button 
              className={`btn ${useStableCallback ? "btn-emerald" : "btn-danger"}`}
              onClick={() => setUseStableCallback(prev => !prev)}
            >
              {useStableCallback ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              Prop Mode: {useStableCallback ? "Stable useCallback (Optimized)" : "Inline Function (Breaks Memo)"}
            </button>
          </div>

          <div className="grid-2">
            <div>
              <div className="inspector-title">Child Component Subject to Test:</div>
              <MemoizedChild 
                title={childTitle} 
                onAction={useStableCallback ? handleStableAction : handleInlineAction} 
              />
            </div>

            <div className="state-inspector-card">
              <div className="inspector-title">Optimization Diagnosis:</div>
              {useStableCallback ? (
                <div style={{ color: "var(--accent-emerald)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  ✅ <strong>OPTIMAL PERFORMANCE</strong>: Parent passes a cached <code>useCallback</code> reference. When you click "Re-render Parent", notice that <strong>Child Render Count stays FROZEN</strong>!
                </div>
              ) : (
                <div style={{ color: "var(--accent-rose)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  ⚠️ <strong>MEMOIZATION BROKEN</strong>: Parent passes an unmemoized inline function <code>{`onClick={() => ...}`}</code>. Every time you click "Re-render Parent", <strong>Child Render Count increments needlessly</strong>!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
