"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CSRDemoPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchTimestamp, setFetchTimestamp] = useState("");
  const [renderCount, setRenderCount] = useState(0);

  function loadClientData() {
    setLoading(true);
    const start = performance.now();

    // Simulating client-side asynchronous API fetch:
    setTimeout(() => {
      setProducts([
        { id: 1, name: "iPhone 17 Pro", price: 999, category: "Phones" },
        { id: 2, name: "MacBook Pro M4", price: 1999, category: "Laptops" },
        { id: 3, name: "AirPods Pro 3", price: 249, category: "Audio" },
      ]);
      setLoading(false);
      setFetchTimestamp(new Date().toLocaleTimeString());
      setRenderCount((c) => c + 1);
    }, 800); // 800ms client latency
  }

  useEffect(() => {
    loadClientData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Client-Side Rendering (CSR) Live Demo
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          The initial HTML received by the browser is a blank shell. JavaScript downloads, 
          executes in the browser CPU, and triggers a client-side fetch in <code>useEffect()</code>.
        </p>
      </div>

      <div className="demo-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span className="badge badge-blue">Client Component ("use client")</span>
            <span style={{ marginLeft: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Client Fetches: {renderCount} | Last Fetched: {fetchTimestamp || "Pending..."}
            </span>
          </div>
          <button onClick={loadClientData} disabled={loading} className="btn">
            {loading ? "Fetching..." : "🔄 Trigger Client Refetch"}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div className="skeleton" style={{ width: "60px", height: "60px", borderRadius: "50%", margin: "0 auto 16px" }}></div>
            <p style={{ color: "var(--text-secondary)" }}>
              ⏳ Downloading data over client network... (Simulating blank screen / spinner)
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {products.map((p) => (
              <div key={p.id} style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span className="badge badge-green" style={{ marginBottom: "8px" }}>{p.category}</span>
                <h3 style={{ fontSize: "1.1rem", margin: "6px 0" }}>{p.name}</h3>
                <p style={{ color: "var(--accent-blue)", fontWeight: 700 }}>${p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>How This Works Under The Hood:</h3>
        <pre className="code-block">
{`// 1. Initial HTML delivered from server is virtually empty:
<div id="root"></div>

// 2. Client executes React in the user's browser:
"use client";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⚠️ FETCH WATERFALL: Fetch only begins AFTER JS bundle downloads and parses!
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  return <ProductList items={products} />;
}`}
        </pre>
      </div>
    </div>
  );
}

