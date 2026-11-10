import Link from "next/link";

// Forces request-time dynamic SSR on every page hit:
export const dynamic = "force-dynamic";

// Asynchronous Server Component fetching live request-time data
async function getLiveServerData() {
  // Simulating server query:
  const serverTimestamp = new Date().toISOString();
  const serverProcessPID = process.pid;

  const liveStock = [
    { id: 101, symbol: "AAPL", price: (220 + Math.random() * 5).toFixed(2), change: "+1.2%" },
    { id: 102, symbol: "GOOGL", price: (175 + Math.random() * 4).toFixed(2), change: "+0.8%" },
    { id: 103, symbol: "MSFT", price: (415 + Math.random() * 6).toFixed(2), change: "-0.4%" },
    { id: 104, symbol: "NVDA", price: (140 + Math.random() * 3).toFixed(2), change: "+3.1%" },
  ];

  return { serverTimestamp, serverProcessPID, liveStock };
}

export default async function SSRDemoPage() {
  const { serverTimestamp, serverProcessPID, liveStock } = await getLiveServerData();

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Server-Side Rendering (SSR) Live Demo
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Every single time you refresh this page, the Node.js server re-executes this component, 
          generates fresh HTML, and streams the complete document. (Zero client useEffect needed!)
        </p>
      </div>

      <div className="demo-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="badge badge-amber">Server Component (Request-Time SSR)</span>
            <span style={{ marginLeft: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Server PID: {serverProcessPID} | Rendered at: {serverTimestamp}
            </span>
          </div>
          <Link href="/ssr" className="btn btn-secondary">
            🔄 Refresh Page (Trigger New SSR)
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {liveStock.map((stock) => (
            <div key={stock.id} style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{stock.symbol}</h3>
                <span className={stock.change.startsWith("+") ? "badge badge-green" : "badge badge-red"}>
                  {stock.change}
                </span>
              </div>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: "8px", color: "var(--accent-blue)" }}>
                ${stock.price}
              </p>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                Rendered on Node.js Server
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
          <p style={{ fontSize: "0.85rem", color: "#93c5fd" }}>
            💡 <strong>Verification Tip:</strong> Right-click anywhere on this page and choose <strong>"View Page Source"</strong>.
            You will see that the stock numbers ($22x.xx) are ALREADY inside the initial HTML sent over the wire!
          </p>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>How This Works in Next.js App Router:</h3>
        <pre className="code-block">
{`// app/ssr/page.jsx
// 1. Force request-time dynamic evaluation:
export const dynamic = "force-dynamic";

// 2. Direct async Server Component (Zero client-side JS bundle overhead!):
export default async function SSRPage() {
  // Direct DB or API query executed on Node.js server:
  const res = await fetch("https://api.internal/live-stocks", {
    cache: "no-store", // Guarantees fresh data on every request
  });
  const stocks = await res.json();

  // Full HTML generated on server and flushed to browser:
  return (
    <div>
      {stocks.map(s => <StockCard key={s.id} item={s} />)}
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

