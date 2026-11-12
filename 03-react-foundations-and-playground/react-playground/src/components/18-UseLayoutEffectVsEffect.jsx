import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Eye, Layers, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function UseLayoutEffectVsEffect() {
  const [mode, setMode] = useState("layout"); // 'effect' | 'layout'
  const [tooltipWidth, setTooltipWidth] = useState(120);
  const [repositionCount, setRepositionCount] = useState(0);
  const buttonRef = useRef(null);

  const handleToggleContent = () => {
    setTooltipWidth(prev => prev === 120 ? 320 : 120);
    setRepositionCount(c => c + 1);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 18</span>
          <span className="badge badge-amber">DOM Timing</span>
        </div>
        <h3 className="content-title">useLayoutEffect vs useEffect — Preventing Layout Flicker</h3>
        <p className="content-subtitle">
          Understanding the browser painting pipeline: executing synchronous DOM layout measurements before pixel paint vs asynchronous passive effects.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><AlertTriangle size={16} /> useEffect (After Paint)</h4>
            <p>
              Runs <strong>asynchronously AFTER</strong> the browser paints pixels on screen. If you measure DOM width/height and update state here, the user sees an unsightly visual flicker / jump!
            </p>
          </div>
          <div className="theory-box">
            <h4><CheckCircle size={16} /> useLayoutEffect (Before Paint)</h4>
            <p>
              Runs <strong>synchronously BEFORE</strong> the browser paints pixels. Any DOM measurement or style correction happens before the frame renders on monitor, eliminating flicker completely.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Eye size={18} className="text-amber-400" />
            Dynamic Tooltip Measurement Lab
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className={`btn ${mode === "effect" ? "btn-danger" : "btn-secondary"}`}
              onClick={() => setMode("effect")}
            >
              useEffect Mode (Flicker Risk)
            </button>
            <button 
              className={`btn ${mode === "layout" ? "btn-emerald" : "btn-secondary"}`}
              onClick={() => setMode("layout")}
            >
              useLayoutEffect Mode (Zero Flicker)
            </button>
          </div>
        </div>

        <div className="playground-body">
          <div style={{ marginBottom: "24px" }}>
            <button 
              ref={buttonRef} 
              className="btn btn-primary"
              onClick={handleToggleContent}
            >
              <RefreshCw size={14} /> Toggle Tooltip Width ({tooltipWidth}px)
            </button>
          </div>

          {/* Dynamic Floating Tooltip */}
          <div style={{ minHeight: "180px", position: "relative", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", padding: "20px" }}>
            <div style={{
              width: `${tooltipWidth}px`,
              padding: "12px 16px",
              background: mode === "layout" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
              border: `1px solid ${mode === "layout" ? "rgba(16,185,129,0.4)" : "rgba(244,63,94,0.4)"}`,
              color: mode === "layout" ? "#6ee7b7" : "#fda4af",
              borderRadius: "8px",
              fontSize: "0.85rem",
              transition: mode === "effect" ? "none" : "width 0.2s ease"
            }}>
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                {mode === "layout" ? "⚡ Synchronous Layout Effect" : "🕒 Asynchronous Effect"}
              </div>
              <div>Measured Width: <strong>{tooltipWidth}px</strong></div>
              <div style={{ fontSize: "0.75rem", marginTop: "4px", opacity: 0.8 }}>
                Reposition Pass #{repositionCount}
              </div>
            </div>

            <div style={{ marginTop: "30px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {mode === "layout" ? (
                <span>
                  ✅ <strong>useLayoutEffect Active:</strong> DOM calculations run before browser paint. The tooltip is measured, sized, and aligned synchronously without any intermediate frame flashes.
                </span>
              ) : (
                <span>
                  ⚠️ <strong>useEffect Active:</strong> The initial frame is painted by the browser at default dimensions. Then <code>useEffect</code> executes after the paint, causing a layout reflow.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
