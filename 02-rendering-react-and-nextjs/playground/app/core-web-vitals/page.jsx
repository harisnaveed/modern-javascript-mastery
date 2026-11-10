"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

export default function CoreWebVitalsPage() {
  // LCP state
  const [hasPriority, setHasPriority] = useState(false);
  // INP state
  const [searchVal, setSearchVal] = useState("");
  const [useTransitionFlag, setUseTransitionFlag] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [heavyItems, setHeavyItems] = useState([]);
  // CLS state
  const [reserveSpace, setReserveSpace] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  function handleSearch(e) {
    const val = e.target.value;
    setSearchVal(val);

    if (useTransitionFlag) {
      // React 19 Transition: Non-blocking INP
      startTransition(() => {
        const results = Array.from({ length: 300 }, (_, i) => `Result for "${val}" - Item #${i + 1}`);
        setHeavyItems(results);
      });
    } else {
      // Blocking: Forces synchronous UI thread computation
      const results = Array.from({ length: 300 }, (_, i) => `Result for "${val}" - Item #${i + 1}`);
      setHeavyItems(results);
    }
  }

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 24: Core Web Vitals & Rendering Performance</h1>
        <span className="badge badge-green">Production Auditing</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        Google assesses web performance using three Core Web Vitals: <strong>LCP</strong> (Loading speed), 
        <strong>INP</strong> (Responsiveness & interactivity), and <strong>CLS</strong> (Visual stability).
        Test the optimizations below to see how Next.js and React 19 achieve 100/100 Lighthouse scores!
      </p>

      {/* 1. LCP Optimizer */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h2 className="card-title" style={{ margin: 0 }}>1. LCP (Largest Contentful Paint) Optimizer</h2>
          <span className={`badge ${hasPriority ? "badge-green" : "badge-amber"}`}>
            Simulated LCP: {hasPriority ? "0.85s (GOOD)" : "3.20s (POOR)"}
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Without <code>priority</code>, hero images are lazy-loaded after JavaScript executes. Adding <code>priority</code> preloads them in the initial HTML <code>&lt;head&gt;</code>!
        </p>

        <button
          onClick={() => setHasPriority((p) => !p)}
          className="button"
          style={{ background: hasPriority ? "var(--accent-green)" : "var(--accent-amber)", color: "#fff", marginBottom: "16px" }}
        >
          Toggle next/image: {hasPriority ? "priority = true (Preloaded)" : "priority = false (Lazy-loaded)"}
        </button>

        <div
          style={{
            padding: "16px",
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            fontSize: "0.85rem",
          }}
        >
          <code>&lt;Image src=&quot;/hero.webp&quot; alt=&quot;Banner&quot; width=&#123;1200&#125; height=&#123;500&#125; {hasPriority ? "priority" : ""} /&gt;</code>
        </div>
      </div>

      {/* 2. INP Optimizer */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h2 className="card-title" style={{ margin: 0 }}>2. INP (Interaction to Next Paint) Optimizer</h2>
          <span className={`badge ${useTransitionFlag ? "badge-green" : "badge-red"}`}>
            Simulated INP: {useTransitionFlag ? "45ms (GOOD)" : "280ms (POOR)"}
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Using React 19 <code>startTransition</code> marks expensive state updates as non-urgent, keeping the input field immediately responsive without dropped keystrokes.
        </p>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={searchVal}
            onChange={handleSearch}
            placeholder="Type fast here..."
            style={{
              padding: "8px 12px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              color: "#fff",
              minWidth: "220px",
            }}
          />

          <button
            onClick={() => setUseTransitionFlag((f) => !f)}
            className="button"
            style={{ background: useTransitionFlag ? "var(--accent-green)" : "var(--accent-red)", color: "#fff" }}
          >
            Mode: {useTransitionFlag ? "startTransition (Non-blocking)" : "Synchronous (Blocking)"}
          </button>

          {isPending && <span style={{ fontSize: "0.8rem", color: "var(--accent-amber)" }}>Filtering in background...</span>}
        </div>
      </div>

      {/* 3. CLS Optimizer */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h2 className="card-title" style={{ margin: 0 }}>3. CLS (Cumulative Layout Shift) Optimizer</h2>
          <span className={`badge ${reserveSpace ? "badge-green" : "badge-red"}`}>
            Simulated CLS: {reserveSpace ? "0.00 (GOOD)" : "0.34 (POOR)"}
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "14px" }}>
          Inserting dynamic banners without reserving height causes all lower content to jump down suddenly.
          Reserving an aspect ratio or placeholder box prevents layout shifts completely.
        </p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <button
            onClick={() => setReserveSpace((r) => !r)}
            className="button"
            style={{ background: reserveSpace ? "var(--accent-green)" : "var(--accent-red)", color: "#fff" }}
          >
            Reserved Height Placeholder: {reserveSpace ? "ON (aspect-ratio)" : "OFF (Zero height)"}
          </button>
          <button
            onClick={() => setShowBanner((b) => !b)}
            className="button"
            style={{ background: "var(--accent-blue)", color: "#fff" }}
          >
            {showBanner ? "Hide Dynamic Banner" : "Inject Dynamic Banner"}
          </button>
        </div>

        {/* CLS Container */}
        <div
          style={{
            minHeight: reserveSpace ? "70px" : "auto",
            background: showBanner ? "var(--accent-blue)" : reserveSpace ? "rgba(255,255,255,0.05)" : "transparent",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            marginBottom: "12px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          {showBanner ? "🎉 20% Discount Banner Injected!" : reserveSpace ? "Reserved 70px Placeholder Box" : null}
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: 0 }}>
          This paragraph stays completely stable when reserved height is enabled, preventing accidental clicks!
        </p>
      </div>
    </div>
  );
}

