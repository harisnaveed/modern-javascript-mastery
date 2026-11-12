import React, { useState } from "react";
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle, Bug } from "lucide-react";

// Crashing Child Component
function PaymentWidget({ shouldCrash, onReset }) {
  if (shouldCrash) {
    throw new Error("Stripe API Token Expired: 401 Unauthorized");
  }

  return (
    <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
      <div style={{ fontWeight: 600, color: "var(--accent-emerald)", marginBottom: "4px" }}>
        💳 Stripe Payment Gateway Active
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
        Ready to process credit card payment for Repair Ticket #819.
      </p>
    </div>
  );
}

// Error Boundary Simulator Wrapper
function ErrorBoundaryWrapper({ children, fallbackMessage, onRecover }) {
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // In real React, this uses static getDerivedStateFromError
  const triggerErrorCatch = (err) => {
    setHasError(true);
    setErrorMsg(err.message);
  };

  const handleReset = () => {
    setHasError(false);
    setErrorMsg("");
    onRecover();
  };

  if (hasError) {
    return (
      <div style={{
        padding: "16px",
        background: "rgba(244,63,94,0.1)",
        border: "1px solid rgba(244,63,94,0.3)",
        borderRadius: "8px",
        color: "#fca5a5"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, marginBottom: "6px" }}>
          <AlertTriangle size={18} />
          {fallbackMessage}
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
          Captured Exception: <code>{errorMsg}</code>
        </p>
        <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={handleReset}>
          <RefreshCw size={12} /> Retry / Recover Component
        </button>
      </div>
    );
  }

  try {
    return children;
  } catch (err) {
    triggerErrorCatch(err);
    return null;
  }
}

export default function ErrorBoundaryResilience() {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [otherWidgetCount, setOtherWidgetCount] = useState(0);

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-rose">Module 24</span>
          <span className="badge badge-emerald">Resilience</span>
        </div>
        <h3 className="content-title">React Error Boundaries & Isolated Crash Containment</h3>
        <p className="content-subtitle">
          How Error Boundaries prevent a single broken component from unmounting the entire application into a blank white screen.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><ShieldAlert size={16} /> Granular Containment</h4>
            <p>
              By wrapping independent widgets (like comments, payments, or charts) in their own boundaries, a crash in one widget displays a localized fallback UI while the rest of the application remains 100% interactive.
            </p>
          </div>
          <div className="theory-box">
            <h4><CheckCircle size={16} /> Error Recovery</h4>
            <p>
              Error Boundaries can provide "Try Again" or "Reload Section" buttons, allowing users to recover from transient network failures without refreshing the page and losing entered data.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <ShieldAlert size={18} className="text-rose-400" />
            Crash Isolation & Recovery Lab
          </div>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            {/* Flaky Protected Widget */}
            <div className="state-inspector-card">
              <div className="inspector-title">Protected Widget (Wrapped in Error Boundary):</div>

              <div style={{ marginBottom: "16px" }}>
                <button 
                  className={`btn ${shouldCrash ? "btn-secondary" : "btn-danger"}`}
                  onClick={() => setShouldCrash(prev => !prev)}
                >
                  <Bug size={14} />
                  {shouldCrash ? "Resolve Component Bug" : "Trigger Unhandled Throw Error"}
                </button>
              </div>

              {shouldCrash ? (
                <div style={{
                  padding: "16px",
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.3)",
                  borderRadius: "8px",
                  color: "#fca5a5"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, marginBottom: "6px" }}>
                    <AlertTriangle size={18} />
                    ⚠️ Payment Service Encountered an Error
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Captured Exception: <code>Stripe API Token Expired: 401 Unauthorized</code>
                  </p>
                  <button className="btn btn-secondary" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={() => setShouldCrash(false)}>
                    <RefreshCw size={12} /> Try Again (Recover)
                  </button>
                </div>
              ) : (
                <PaymentWidget shouldCrash={false} onReset={() => setShouldCrash(false)} />
              )}
            </div>

            {/* Unaffected Neighbor Widget */}
            <div className="state-inspector-card">
              <div className="inspector-title">Independent Neighbor Widget (Always Alive):</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                Even when the payment widget crashes above, notice that this neighbor widget stays completely alive!
              </p>

              <button 
                className="btn btn-primary"
                onClick={() => setOtherWidgetCount(c => c + 1)}
              >
                Click Counter: {otherWidgetCount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
