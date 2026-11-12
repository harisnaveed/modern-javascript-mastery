import React, { useState } from "react";
import { Shield, Loader2, GitCommit, Layers, UserCheck, UserX } from "lucide-react";

export default function HocVsCustomHooks() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [approach, setApproach] = useState("hook"); // 'hoc' | 'hook'

  const handleSimulateFetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 05</span>
          <span className="badge badge-blue">Patterns</span>
        </div>
        <h3 className="content-title">Higher-Order Components (HOC) vs Custom Hooks</h3>
        <p className="content-subtitle">
          How React evolved from component-wrapping HOCs (React 15/16) to composable, flat Custom Hooks (React 16.8+ to 19).
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Layers size={16} /> Higher-Order Component (HOC)</h4>
            <p>
              A function taking a Component and returning an Enhanced Component (e.g. <code>withAuth(withLoading(Profile))</code>). Suffered from "Wrapper Hell" in React DevTools, props collision, and static method hoisting bugs.
            </p>
          </div>
          <div className="theory-box">
            <h4><GitCommit size={16} /> Modern Custom Hook</h4>
            <p>
              Direct stateful logic extraction (e.g. <code>const {`{ user, isAuth }`} = useAuth();</code>). Keeps component trees completely flat with 0 extra Fiber/DOM wrapper nodes.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Shield size={18} className="text-purple-400" />
            Interactive Pattern Comparator: Auth & Loading Guards
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              className={`btn ${approach === "hoc" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setApproach("hoc")}
            >
              HOC Pattern
            </button>
            <button 
              className={`btn ${approach === "hook" ? "btn-emerald" : "btn-secondary"}`}
              onClick={() => setApproach("hook")}
            >
              Custom Hook Pattern
            </button>
          </div>
        </div>

        <div className="playground-body">
          {/* Controls */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <button 
              className={`btn ${isLoggedIn ? "btn-emerald" : "btn-danger"}`}
              onClick={() => setIsLoggedIn(prev => !prev)}
            >
              {isLoggedIn ? <UserCheck size={16} /> : <UserX size={16} />}
              Toggle Session: {isLoggedIn ? "Authenticated" : "Logged Out"}
            </button>

            <button 
              className="btn btn-secondary" 
              onClick={handleSimulateFetch}
              disabled={isLoading}
            >
              <Loader2 size={16} className={isLoading ? "animate-spin" : ""} />
              Simulate 1.2s Network Fetch
            </button>
          </div>

          <div className="grid-2">
            {/* Live Rendered Component */}
            <div className="state-inspector-card">
              <div className="inspector-title">Active Render Output ({approach.toUpperCase()} Mode)</div>

              <div style={{ minHeight: "140px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", padding: "20px" }}>
                {!isLoggedIn ? (
                  <div style={{ textAlign: "center", color: "var(--accent-rose)" }}>
                    <Shield size={32} style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontWeight: 700 }}>⛔ Access Denied</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Please log in to view account dashboard.</p>
                  </div>
                ) : isLoading ? (
                  <div style={{ textAlign: "center", color: "var(--accent-blue)" }}>
                    <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontWeight: 600 }}>Loading user metrics...</p>
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent-blue)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>HA</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>Haris Ali</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)" }}>Active Session • Verified Pro</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px" }}>
                      Plan: Enterprise Developer | Total Repaired Devices: 24
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DevTools Tree Inspector */}
            <div className="state-inspector-card">
              <div className="inspector-title">React DevTools Component Hierarchy</div>
              
              {approach === "hoc" ? (
                <pre className="code-preview" style={{ color: "#f43f5e" }}>
{`// HOC: 3 Nested Fiber Layers ("Wrapper Hell")
<WithAuth(WithLoading(UserProfile))>
  <WithAuth>
    <WithLoading>
      <UserProfile user={user} />
    </WithLoading>
  </WithAuth>
</WithAuth>`}
                </pre>
              ) : (
                <pre className="code-preview" style={{ color: "#34d399" }}>
{`// Custom Hook: 1 Flat Component!
<UserProfile>
  // Runs:
  // const { isAuth } = useAuth();
  // const { isLoading } = useLoading();
</UserProfile>`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
