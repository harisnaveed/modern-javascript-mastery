"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HydrationMismatchDemoPage() {
  const [activeTab, setActiveTab] = useState("safe"); // 'broken' or 'safe'
  const [clientMounted, setClientMounted] = useState(false);
  const [userBrowserWindow, setUserBrowserWindow] = useState("");

  useEffect(() => {
    setClientMounted(true);
    setUserBrowserWindow(`${window.innerWidth}px x ${window.innerHeight}px`);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Hydration Mismatch Errors & Production Fixes
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          A hydration mismatch occurs when the server-rendered HTML diverges from what 
          React calculates during the initial client pass. Learn how to diagnose and prevent it.
        </p>
      </div>

      <div className="demo-box">
        {/* Toggle Mode */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("safe")}
            className={activeTab === "safe" ? "btn" : "btn btn-secondary"}
          >
            ✅ Recommended Fix (Mounting Flag Pattern)
          </button>
          <button
            onClick={() => setActiveTab("broken")}
            className={activeTab === "broken" ? "btn" : "btn btn-secondary"}
          >
            💥 The Anti-Pattern (Causes Mismatch Warning)
          </button>
        </div>

        {activeTab === "safe" ? (
          <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--accent-green)" }}>
            <span className="badge badge-green" style={{ marginBottom: "12px" }}>✅ Safe Production Pattern</span>
            <h3 style={{ fontSize: "1.2rem", margin: "8px 0" }}>Client Browser Dimensions:</h3>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--accent-green)" }}>
              {clientMounted ? userBrowserWindow : "Default Server Shell (Pending Mount...)"}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px" }}>
              💡 <strong>Why this is safe:</strong> On initial server render, it displays the default text.
              During hydration, it matches 100%! Only AFTER hydration completes does <code>useEffect()</code> update the state.
            </p>
          </div>
        ) : (
          <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--accent-red)" }}>
            <span className="badge badge-amber" style={{ marginBottom: "12px" }}>⚠️ Dangerous Anti-Pattern</span>
            <h3 style={{ fontSize: "1.2rem", margin: "8px 0" }}>Direct Browser API Call in Render Body:</h3>
            <p style={{ fontSize: "1.2rem", color: "var(--accent-amber)", fontFamily: "monospace" }}>
              {/* Direct date or random in render body causes mismatch: */}
              Timestamp: {new Date().toLocaleTimeString()}
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "10px" }}>
              💥 <strong>Why this causes bugs:</strong> If rendered on server at 12:00:00 and client hydrates at 12:00:02,
              React detects the difference and logs: <code>"Warning: Text content did not match server-rendered HTML"</code>.
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>The 3 Production Fixes:</h3>
        <pre className="code-block">
{`// FIX 1: The Mounting Flag Pattern
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);
if (!isMounted) return <DefaultFallback />;
return <ClientOnlyThemeWidget />;

// FIX 2: suppressHydrationWarning (for timestamps & dates)
<time suppressHydrationWarning>{new Date().toLocaleTimeString()}</time>

// FIX 3: next/dynamic with ssr: false
const DynamicBrowserMap = dynamic(() => import('@/components/Map'), { ssr: false });`}
        </pre>
      </div>
    </div>
  );
}

