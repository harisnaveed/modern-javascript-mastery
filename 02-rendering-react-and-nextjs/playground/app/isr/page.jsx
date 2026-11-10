import Link from "next/link";

// Revalidate this page every 10 seconds (for live interactive demonstration):
export const revalidate = 10;

async function getProductWithISRCache() {
  const generatedAt = new Date().toLocaleTimeString();
  const randomPrice = 750 + Math.floor(Math.random() * 100);

  return {
    id: "iphone-17",
    name: "iPhone 17 Pro Max",
    price: randomPrice,
    generatedAt,
  };
}

export default async function ISRDemoPage() {
  const product = await getProductWithISRCache();

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Incremental Static Regeneration (ISR) Live Demo
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Combines the 15ms speed of static HTML with automated background revalidation.
          Configured with a <strong>10-second revalidation window</strong>.
        </p>
      </div>

      <div className="demo-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <span className="badge badge-purple">ISR Mode (revalidate = 10s)</span>
            <span style={{ marginLeft: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Page Statically Generated At: <strong>{product.generatedAt}</strong>
            </span>
          </div>
          <Link href="/isr" className="btn">
            🔄 Refresh to Test Stale-While-Revalidate
          </Link>
        </div>

        <div style={{ background: "var(--bg-secondary)", padding: "24px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
          <span className="badge badge-green">Product In Stock</span>
          <h2 style={{ fontSize: "1.6rem", margin: "12px 0 4px" }}>{product.name}</h2>
          <p style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-blue)" }}>
            ${product.price}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "8px" }}>
            If you refresh within 10 seconds, you get the exact same price instantly (Cache HIT).
            If you refresh AFTER 10 seconds, you trigger background revalidation!
          </p>
        </div>

        <div style={{ marginTop: "20px", padding: "16px", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
          <h4 style={{ color: "#c084fc", marginBottom: "6px" }}>🧪 How to test this live in your browser:</h4>
          <ol style={{ paddingLeft: "20px", fontSize: "0.9rem", color: "#e4e4e7" }}>
            <li>Note the <strong>Generated At</strong> timestamp and <strong>Price</strong> above.</li>
            <li>Refresh immediately (within 10s) &rarr; The timestamp stays the same (served from static cache).</li>
            <li>Wait 10 seconds and refresh &rarr; Next.js serves the cached page while regenerating in the background!</li>
            <li>Refresh once more &rarr; Boom! Fresh price and new timestamp appear!</li>
          </ol>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>How This Works in Next.js App Router:</h3>
        <pre className="code-block">
{`// app/products/[id]/page.jsx

// 1. Time-Based Revalidation:
export const revalidate = 60; // In production: 60 seconds

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  return <ProductView data={product} />;
}

// 2. On-Demand Revalidation via Server Action (Instant Purge!):
"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateProductPrice(id, newPrice) {
  await db.product.update({ where: { id }, data: { price: newPrice } });
  
  // Instantly purges cache without waiting for time interval!
  revalidatePath(\`/products/\${id}\`);
}`}
        </pre>
      </div>
    </div>
  );
}

