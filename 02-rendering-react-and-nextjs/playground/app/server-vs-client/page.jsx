import Link from "next/link";
import ClientCartWidget from "./ClientCartWidget";

// 1. Asynchronous Server Component (Default in App Router)
// Runs 100% on the server! Zero bytes of component code sent to browser!
async function getProductFromDatabase() {
  return {
    id: 101,
    name: "MacBook Pro 16-inch M4 Max",
    price: 3499,
    stock: 8,
    specs: [
      "16-core CPU, 40-core GPU",
      "48GB Unified Memory",
      "1TB Superfast SSD Storage",
      "Liquid Retina XDR Display",
    ],
  };
}

export default async function ServerVsClientPage() {
  const product = await getProductFromDatabase();

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Server Components vs Client Components
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Notice how the outer product specs are rendered by a <strong>Server Component (0 KB JS shipped)</strong>, 
          while the interactive quantity buttons and cart state are isolated inside a <strong>Client Component ("use client")</strong>.
        </p>
      </div>

      <div className="demo-box">
        <div style={{ marginBottom: "16px" }}>
          <span className="badge badge-green">Server Component (RSC Shell)</span>
          <span style={{ marginLeft: "12px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Database fetched directly on server | Zero client API overhead
          </span>
        </div>

        <div style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.5rem" }}>{product.name}</h2>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-blue)", margin: "8px 0 12px" }}>
            ${product.price}
          </p>

          <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "6px" }}>Hardware Specifications:</h4>
          <ul style={{ paddingLeft: "20px", fontSize: "0.9rem", color: "#d4d4d8", marginBottom: "20px" }}>
            {product.specs.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>

          {/* Seamless Client Component boundary! */}
          <ClientCartWidget
            productId={product.id}
            initialStock={product.stock}
            productName={product.name}
          />
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>The Golden Composition Pattern:</h3>
        <pre className="code-block">
{`// 1. Server Component: Fetches DB directly, renders static details (0 KB JS shipped!)
export default async function ProductPage() {
  const product = await db.product.findUnique({ where: { id: 101 } });

  return (
    <div>
      <h1>{product.name}</h1>
      <p>\${product.price}</p>

      {/* 2. Push client interactivity to the leaves of the tree: */}
      <ClientCartWidget productId={product.id} stock={product.stock} />
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

