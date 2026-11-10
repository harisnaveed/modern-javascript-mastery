import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// 1. Slow Asynchronous Component (Simulates slow 3rd-party database or AI review analysis):
async function SlowCustomerReviews() {
  // Simulate 2000ms server network delay:
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const reviews = [
    { id: 1, author: "Hamza Khan", rating: 5, comment: "Battery life easily lasts 2 full days. Best laptop I've owned." },
    { id: 2, author: "Zainab Bibi", rating: 5, comment: "Screen is blindingly bright and vibrant. Fast compilation." },
    { id: 3, author: "Bilal Tariq", rating: 4, comment: "A bit heavy in the backpack, but the performance is unmatched." },
  ];

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Customer Reviews (Streamed via Suspense)</h3>
        <span className="badge badge-green">Streamed over HTTP Chunk</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ background: "var(--bg-secondary)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontWeight: 600 }}>{r.author}</span>
              <span style={{ color: "#fbbf24" }}>{"★".repeat(r.rating)}</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Loading Skeleton Fallback Component
function ReviewsSkeleton() {
  return (
    <div style={{ marginTop: "16px", padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--accent-blue)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <div className="skeleton" style={{ width: "200px", height: "24px" }} />
        <span className="badge badge-blue">⏳ Streaming Chunk in Flight...</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="skeleton" style={{ width: "100%", height: "60px" }} />
        <div className="skeleton" style={{ width: "100%", height: "60px" }} />
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--accent-blue)", marginTop: "12px" }}>
        ⚡ Notice: The main page shell above is ALREADY completely visible and interactive!
        The server is currently streaming the slow reviews chunk down the open connection.
      </p>
    </div>
  );
}

export default function StreamingPage() {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Streaming SSR & React Suspense Live Demo
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Watch how Next.js flushes the page shell immediately (TTFB &lt; 20ms) while the slow 
          reviews component streams in 2 seconds later over the SAME open HTTP connection!
        </p>
      </div>

      <div className="demo-box">
        {/* FAST SHELL (Renders immediately!) */}
        <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <span className="badge badge-green">Instant Page Shell (TTFB &lt; 20ms)</span>
          <h2 style={{ fontSize: "1.6rem", margin: "10px 0" }}>iPhone 17 Pro - Titanium Natural</h2>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-blue)", marginBottom: "12px" }}>
            $999.00
          </p>
          <button className="btn" style={{ marginRight: "12px" }}>
            ⚡ Instant Buy Now
          </button>
          <Link href="/streaming" className="btn btn-secondary">
            🔄 Refresh to Watch Streaming Again
          </Link>
        </div>

        {/* SLOW COMPONENT WRAPPED IN SUSPENSE */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <SlowCustomerReviews />
        </Suspense>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>How Next.js Streaming Works:</h3>
        <pre className="code-block">
{`// 1. Wrap the slow database query inside a Suspense boundary:
<Suspense fallback={<ReviewsSkeleton />}>
  <SlowCustomerReviews productId={id} />
</Suspense>

// 2. Next.js server sends HTTP headers with Chunked Transfer Encoding:
Transfer-Encoding: chunked

// 3. Browser receives the fast HTML shell immediately, and swaps 
// the skeleton when the slow chunk finishes resolving!`}
        </pre>
      </div>
    </div>
  );
}

