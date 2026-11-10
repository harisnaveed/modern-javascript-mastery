"use client";

import { useState } from "react";
import Link from "next/link";

export default function ServerClientCompositionPage() {
  const [pattern, setPattern] = useState("children"); // "import-trap" or "children"
  const [theme, setTheme] = useState("dark");

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 15: Server & Client Composition Patterns</h1>
        <span className="badge badge-blue">RSC Architecture</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        How do you put a Server Component (with database access and 0 KB client bundle) inside an interactive Client Component (like a modal or sidebar)?
        You <strong>CANNOT</strong> directly import a Server Component into a Client Component. You must pass it via the <code>children</code> slot!
      </p>

      {/* Pattern Selector */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Select Composition Pattern</h2>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setPattern("children")}
            className="button"
            style={{
              background: pattern === "children" ? "var(--accent-green)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            Recommended: The Children Slot Pattern
          </button>
          <button
            onClick={() => setPattern("import-trap")}
            className="button"
            style={{
              background: pattern === "import-trap" ? "var(--accent-red)" : "var(--bg-page)",
              border: "1px solid var(--border)",
              color: "#fff",
            }}
          >
            Anti-Pattern: The Direct Import Trap
          </button>
        </div>

        {/* Dynamic Comparison View */}
        {pattern === "children" ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {/* Code Snippet */}
              <div>
                <h4 style={{ fontSize: "0.9rem", color: "var(--accent-green)", marginBottom: "8px" }}>
                  Server Component (page.jsx):
                </h4>
                <pre
                  style={{
                    background: "var(--bg-page)",
                    padding: "14px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    border: "1px solid var(--border)",
                  }}
                >
{`// 1. Server Component renders BOTH:
export default async function Page() {
  const users = await db.user.findMany(); // Direct DB!

  return (
    <ClientModalWrapper>
      {/* Passed as children slot! */}
      <ServerUserTable users={users} />
    </ClientModalWrapper>
  );
}`}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", color: "var(--accent-blue)", marginBottom: "8px" }}>
                  Client Component (ClientModalWrapper.jsx):
                </h4>
                <pre
                  style={{
                    background: "var(--bg-page)",
                    padding: "14px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    border: "1px solid var(--border)",
                  }}
                >
{`"use client";
import { useState } from "react";

export function ClientModalWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="modal">
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children} {/* Server HTML preserved! */}
    </div>
  );
}`}
                </pre>
              </div>
            </div>

            {/* Interactive Live Component */}
            <div
              style={{
                padding: "20px",
                background: theme === "dark" ? "#0f172a" : "#f8fafc",
                color: theme === "dark" ? "#f8fafc" : "#0f172a",
                border: "2px solid var(--accent-green)",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <strong>Client Component Wrapper (State & Theme Provider)</strong>
                <button
                  onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                  className="button"
                  style={{ background: "var(--accent-blue)", color: "#fff", padding: "6px 12px", fontSize: "0.8rem" }}
                >
                  Toggle Client Theme ({theme})
                </button>
              </div>

              {/* Children Slot Simulated Server Output */}
              <div
                style={{
                  padding: "12px",
                  background: theme === "dark" ? "#1e293b" : "#e2e8f0",
                  borderRadius: "6px",
                  border: "1px dashed var(--accent-amber)",
                }}
              >
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span className="badge badge-amber" style={{ fontSize: "0.7rem" }}>SERVER COMPONENT (CHILDREN)</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>0 KB Client Bundle</span>
                </div>
                <div style={{ fontSize: "0.85rem" }}>
                  Query executed on server: <code>SELECT * FROM active_users LIMIT 3;</code>
                </div>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.85rem" }}>
                  <li>Alice (Staff Architect)</li>
                  <li>Bob (DevOps Lead)</li>
                  <li>Charlie (Principal SRE)</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                padding: "16px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid var(--accent-red)",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <h4 style={{ color: "var(--accent-red)", margin: "0 0 8px 0" }}>Why Direct Import Fails:</h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, lineHeight: "1.6" }}>
                When you write <code>&ldquo;use client&rdquo;</code> at the top of a file, every module imported into that file
                becomes part of the client bundle. If you import a server component with database queries or private API keys,
                Next.js build will throw an error or leak sensitive server-only code to the browser!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
