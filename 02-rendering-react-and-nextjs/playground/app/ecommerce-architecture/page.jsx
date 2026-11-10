"use client";

import { useState } from "react";
import Link from "next/link";

export default function EcommerceArchitecturePage() {
  const [selectedRoute, setSelectedRoute] = useState("pdp");

  const routes = {
    home: {
      route: "/",
      name: "Homepage & Promotional Campaigns",
      strategy: "SSG + ISR (revalidate = 300)",
      ttfb: "15ms (Edge CDN)",
      rendering: "Static Site Generation",
      reason: "High traffic, mostly static marketing banners, needs instant global delivery with 0 server compute load.",
      code: `// app/page.jsx
export const revalidate = 300; // Regenerate every 5 minutes

export default async function HomePage() {
  const banners = await getFeaturedPromotions();
  return <MarketingHero banners={banners} />;
}`,
    },
    pdp: {
      route: "/products/[slug]",
      name: "Product Detail Page (PDP)",
      strategy: "Hybrid: ISR + Streaming Suspense",
      ttfb: "25ms (Static Shell) + 300ms (Live Stock)",
      rendering: "ISR (On-Demand) + Dynamic Holes",
      reason: "Title, specs, and images are static (ISR). Live stock quantity and prices stream in via Suspense so static pages never show stale out-of-stock data.",
      code: `// app/products/[slug]/page.jsx
export const dynamicParams = true;

export default async function ProductPage({ params }) {
  return (
    <div>
      <StaticProductSpecs slug={params.slug} />
      <Suspense fallback={<StockSkeleton />}>
        <RealtimeStockCheck slug={params.slug} />
      </Suspense>
    </div>
  );
}`,
    },
    search: {
      route: "/search?q=keyboard",
      name: "Filtered Search & Facets",
      strategy: "Dynamic SSR with Streaming",
      ttfb: "180ms",
      rendering: "Server-Side Rendering (cache: 'no-store')",
      reason: "Millions of query combinations (price range, brand, rating). Cannot be pre-rendered; rendered dynamically on each user request.",
      code: `// app/search/page.jsx
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const filters = await searchParams;
  const results = await queryElasticSearch(filters);
  return <ProductGrid items={results} />;
}`,
    },
    checkout: {
      route: "/checkout",
      name: "Cart & Secure Checkout",
      strategy: "CSR / Interactive Client Components",
      ttfb: "Instant (Client-Side State)",
      rendering: "Client-Side Rendering ('use client')",
      reason: "Highly interactive form with instant validation, Stripe Elements iframe, and sensitive user payment tokens.",
      code: `"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutForm() {
  const [step, setStep] = useState(1);
  return <StripePaymentPortal step={step} onNext={() => setStep(2)} />;
}`,
    },
  };

  const current = routes[selectedRoute];

  return (
    <div>
      <Link href="/" className="back-link">&larr; Back to Dashboard</Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Concept 22: Real-World E-Commerce Architecture</h1>
        <span className="badge badge-purple">Enterprise Blueprint</span>
      </div>

      <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
        A production enterprise application never relies on a single rendering strategy.
        World-class platforms like Amazon, Shopify, and Nike use a <strong>Hybrid Multi-Strategy Architecture</strong>,
        matching every route to its optimal rendering pattern.
      </p>

      {/* Route Switcher Tabs */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h2 className="card-title">Select Architectural Route</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          {Object.entries(routes).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedRoute(key)}
              className="button"
              style={{
                background: selectedRoute === key ? "var(--accent-purple)" : "var(--bg-page)",
                border: "1px solid var(--border)",
                color: "#fff",
              }}
            >
              {data.route} ({key.toUpperCase()})
            </button>
          ))}
        </div>

        {/* Selected Route Specification */}
        <div
          style={{
            padding: "20px",
            background: "var(--bg-page)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{current.name}</h3>
            <span className="badge badge-green">{current.strategy}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Expected TTFB:</span>
              <div style={{ fontWeight: 700, color: "var(--accent-blue)" }}>{current.ttfb}</div>
            </div>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Rendering Mode:</span>
              <div style={{ fontWeight: 700, color: "#fff" }}>{current.rendering}</div>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6", margin: "0 0 16px 0" }}>
            <strong style={{ color: "#fff" }}>Architectural Rationale:</strong> {current.reason}
          </p>

          <pre
            style={{
              background: "#020617",
              padding: "14px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              border: "1px solid #1e293b",
              overflowX: "auto",
            }}
          >
            {current.code}
          </pre>
        </div>
      </div>
    </div>
  );
}

