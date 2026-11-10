"use client";

import { useState } from "react";
import Link from "next/link";

export default function ComparisonCalculatorPage() {
  const [needsSEO, setNeedsSEO] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [updateFreq, setUpdateFreq] = useState("hours"); // 'never', 'hours', 'seconds'
  const [hasCookies, setHasCookies] = useState(false);

  function calculateStrategy() {
    if (isPrivate || !needsSEO) {
      return {
        strategy: "CSR (Client-Side Rendering)",
        badge: "badge-blue",
        reason: "Since the page is private or behind an authentication login, SEO crawlers cannot access it anyway. Offloading rendering work to the client's device saves massive server compute bills!",
        example: "User Profile, Account Settings, Admin Analytics, Trello Boards.",
      };
    }

    if (hasCookies || updateFreq === "seconds") {
      return {
        strategy: "SSR (Server-Side Rendering)",
        badge: "badge-amber",
        reason: "Content changes per second or relies on incoming request cookies/geolocation. Next.js must dynamically evaluate this on the server for each HTTP hit.",
        example: "Live Stock Market, Personalized Feed, Checkout Confirmation.",
      };
    }

    if (updateFreq === "never") {
      return {
        strategy: "SSG (Static Site Generation)",
        badge: "badge-green",
        reason: "Content is permanent and identical for all visitors. Pre-render at build time into pure HTML for instant <20ms delivery from a Global CDN Edge!",
        example: "About Us, Terms of Service, Marketing Landing Pages, Documentation.",
      };
    }

    return {
      strategy: "ISR (Incremental Static Regeneration)",
      badge: "badge-purple",
      reason: "Content updates occasionally (e.g. products, blog articles). Serve static HTML from CDN edge while Next.js automatically revalidates and refreshes the cache in the background.",
      example: "Ecommerce Product Pages, Category Catalogs, News Articles.",
    };
  }

  const result = calculateStrategy();

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Interactive Rendering Strategy Decision Engine
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Adjust your page requirements below. The decision engine evaluates your constraints 
          and determines the optimal rendering strategy for performance and SEO.
        </p>
      </div>

      <div className="demo-box">
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>1. Configure Route Constraints:</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {/* SEO Toggle */}
          <label style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" checked={needsSEO} onChange={(e) => setNeedsSEO(e.target.checked)} />
            <span>Requires Public SEO Indexing</span>
          </label>

          {/* Private Toggle */}
          <label style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
            <span>Private Behind User Login</span>
          </label>

          {/* Cookies Toggle */}
          <label style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="checkbox" checked={hasCookies} onChange={(e) => setHasCookies(e.target.checked)} />
            <span>Uses Request Cookies / Headers</span>
          </label>

          {/* Frequency Select */}
          <div style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              Data Update Frequency:
            </label>
            <select
              value={updateFreq}
              onChange={(e) => setUpdateFreq(e.target.value)}
              style={{ width: "100%", background: "var(--bg-card)", color: "#fff", border: "1px solid var(--border-color)", padding: "6px", borderRadius: "6px" }}
            >
              <option value="never">Permanent (Never / Rare changes)</option>
              <option value="hours">Hours / Days (Periodic changes)</option>
              <option value="seconds">Every Second / Real-Time</option>
            </select>
          </div>
        </div>

        {/* DECISION RESULT */}
        <div style={{ background: "var(--bg-secondary)", padding: "24px", borderRadius: "10px", border: "2px solid var(--accent-blue)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Recommended Architecture:</h4>
            <span className={`badge ${result.badge}`} style={{ fontSize: "0.9rem" }}>{result.strategy}</span>
          </div>

          <h2 style={{ fontSize: "1.6rem", margin: "8px 0" }}>{result.strategy}</h2>
          <p style={{ color: "#d4d4d8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "14px" }}>
            {result.reason}
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--accent-blue)" }}>
            <strong>Real-World Examples:</strong> {result.example}
          </p>
        </div>
      </div>
    </div>
  );
}

