"use client";

import { useState } from "react";
import Link from "next/link";

export default function RscPayloadPage() {
  const [viewMode, setViewMode] = useState("raw"); // "raw", "vdom", "html"

  const rawRscPayload = `1:I["./components/AddToCart.js",["app-pages-internals","static/chunks/app/cart.js"],"default"]
0:["$","$Lreact.fragment",null,{"children":[["$","h1",null,{"className":"text-xl font-bold","children":"Enterprise Cloud Hosting"}],["$","p",null,{"children":"Starting at $49/mo"}],["$","$L1",null,{"planId":"cloud-99","price":49}]]}]`;

  const parsedVdom = {
    $$typeof: "Symbol(react.element)",
    type: "React.Fragment",
    props: {
      children: [
        {
          type: "h1",
          props: { className: "text-xl font-bold", children: "Enterprise Cloud Hosting" },
        },
        {
          type: "p",
          props: { children: "Starting at $49/mo" },
        },
        {
          type: "ClientComponentReference($1: AddToCart)",
          props: { planId: "cloud-99", price: 49 },
        },
      ],
    },
  };

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 16: RSC Payload Internals & Wire Format</h1>
        <span className="badge badge-purple">Next.js 15 Wire Protocol</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        When you navigate between pages in Next.js App Router, the server does not send pure HTML—it sends the 
        <strong>RSC Payload</strong>. This compact, streaming serialization format allows React to update the page 
        without destroying existing client state!
      </p>

      {/* Interactive Wire Inspector */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Live RSC Wire Format Inspector</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setViewMode("raw")}
            className="button"
            style={{
              background: viewMode === "raw" ? "var(--accent-purple)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            1. Raw Wire Payload (Network Stream)
          </button>
          <button
            onClick={() => setViewMode("vdom")}
            className="button"
            style={{
              background: viewMode === "vdom" ? "var(--accent-blue)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            2. Reconstructed React VDOM Tree
          </button>
          <button
            onClick={() => setViewMode("html")}
            className="button"
            style={{
              background: viewMode === "html" ? "var(--accent-green)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            3. Final Rendered Browser DOM
          </button>
        </div>

        {/* View Switcher */}
        {viewMode === "raw" && (
          <div>
            <pre
              style={{
                background: "var(--bg-page)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "0.85rem",
                overflowX: "auto",
                lineHeight: "1.6",
                color: "#38bdf8",
              }}
            >
              {rawRscPayload}
            </pre>
            <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <strong>Line 1 (<code>1:I[...]</code>):</strong> Registers a Client Component import reference with its JavaScript bundle chunk path.<br />
              <strong>Line 2 (<code>0:[...]</code>):</strong> Serialized element tree. Notice <code>$L1</code> represents the hole where the Client Component gets mounted!
            </div>
          </div>
        )}

        {viewMode === "vdom" && (
          <pre
            style={{
              background: "var(--bg-page)",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "0.8rem",
              overflowX: "auto",
              maxHeight: "260px",
            }}
          >
            {JSON.stringify(parsedVdom, null, 2)}
          </pre>
        )}

        {viewMode === "html" && (
          <div
            style={{
              padding: "24px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          >
            <h1 style={{ fontSize: "1.4rem", margin: "0 0 8px 0" }}>Enterprise Cloud Hosting</h1>
            <p style={{ color: "var(--text-secondary)", margin: "0 0 16px 0" }}>Starting at $49/mo</p>
            <button className="button" style={{ background: "var(--accent-green)", color: "#fff" }}>
              Add to Cart (Interactive Client Component)
            </button>
          </div>
        )}
      </div>

      {/* Key Architectural Advantage */}
      <div className="card">
        <h2 className="card-title">Why RSC Payload beats raw HTML for client navigation</h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          <li>
            <strong style={{ color: "#fff" }}>Preserves Client State:</strong> If a user has a video playing, an open search dropdown, or typed text in a form, soft navigation with RSC updates page content without unmounting or resetting client state!
          </li>
          <li>
            <strong style={{ color: "#fff" }}>Diff-able:</strong> React reconciles the incoming RSC payload against the existing client tree, avoiding full DOM re-creations.
          </li>
        </ul>
      </div>
    </div>
  );
}
