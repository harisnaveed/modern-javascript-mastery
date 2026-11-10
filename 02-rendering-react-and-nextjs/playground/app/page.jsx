import Link from "next/link";

export default function HomePage() {
  const sections = [
    {
      phase: "Phase 1: Browser & React Core Mechanics",
      items: [
        {
          num: "01",
          title: "Browser Critical Rendering Path",
          path: "/browser-pipeline",
          badge: "Browser V8/Blink",
          badgeColor: "badge-blue",
          desc: "Interactive 5-stage pipeline simulator showing Layout, Reflow, Repaint, and GPU Compositing costs.",
        },
        {
          num: "02",
          title: "Real DOM & Mutation Cost",
          path: "/real-dom",
          badge: "DOM Engine",
          badgeColor: "badge-amber",
          desc: "Live benchmark comparing DOM layout thrashing (forced reflows) against batched DocumentFragments and React.",
        },
        {
          num: "03",
          title: "Virtual DOM & Declarative UI",
          path: "/virtual-dom",
          badge: "In-Memory Tree",
          badgeColor: "badge-purple",
          desc: "Side-by-side inspector showing lightweight VDOM JavaScript object nodes and how React patches the real DOM.",
        },
        {
          num: "04",
          title: "Render Phase vs Commit Phase",
          path: "/render-and-commit",
          badge: "Lifecycle",
          badgeColor: "badge-green",
          desc: "Live 3-phase stepper demonstrating why component re-rendering does not mean mutating the real DOM.",
        },
        {
          num: "05",
          title: "Reconciliation & The Key Prop",
          path: "/reconciliation-keys",
          badge: "Diffing Trap",
          badgeColor: "badge-amber",
          desc: "Type notes in input fields and prepend items to watch key={index} corrupt state while key={id} preserves it.",
        },
        {
          num: "06",
          title: "React Fiber Architecture & Scheduling",
          path: "/fiber-architecture",
          badge: "React 19 Engine",
          badgeColor: "badge-purple",
          desc: "Inspect Fiber linked lists (child, sibling, return) and test non-blocking time-slicing with useTransition.",
        },
      ],
    },
    {
      phase: "Phase 2: The 4 Core Rendering Strategies",
      items: [
        {
          num: "07",
          title: "CSR (Client-Side Rendering)",
          path: "/csr",
          badge: "Browser Bundle",
          badgeColor: "badge-blue",
          desc: "Initial empty HTML shell (<div id='root'>), JS bundle download, and client useEffect data fetching.",
        },
        {
          num: "08",
          title: "SSR (Server-Side Rendering)",
          path: "/ssr",
          badge: "Request-Time",
          badgeColor: "badge-amber",
          desc: "Dynamic server rendering on every request using cache: 'no-store' with live timestamps and zero blank screen.",
        },
        {
          num: "09",
          title: "SSG (Static Site Generation)",
          path: "/ssg",
          badge: "Build-Time CDN",
          badgeColor: "badge-green",
          desc: "Pre-rendered static HTML built ahead of time with generateStaticParams() for ultra-fast 15ms CDN delivery.",
        },
        {
          num: "10",
          title: "ISR (Incremental Static Regeneration)",
          path: "/isr",
          badge: "Stale-While-Revalidate",
          badgeColor: "badge-purple",
          desc: "Static speed with background revalidation. Watch countdown timers and background cache revalidation live!",
        },
        {
          num: "11",
          title: "Rendering Strategies Comparison Matrix",
          path: "/comparison",
          badge: "Decision Matrix",
          badgeColor: "badge-purple",
          desc: "Interactive strategy selector: choose your page requirements to calculate the mathematically optimal strategy.",
        },
      ],
    },
    {
      phase: "Phase 3: Hydration & React Server Components",
      items: [
        {
          num: "12",
          title: "Hydration Lifecycle & Overhead",
          path: "/hydration-lifecycle",
          badge: "SSR Overhead",
          badgeColor: "badge-amber",
          desc: "Simulate the Uncanny Valley: test button click failures during unhydrated HTML vs post-hydration interactivity.",
        },
        {
          num: "13",
          title: "Hydration Mismatches & Fixes",
          path: "/hydration-mismatch",
          badge: "Debug & Fix",
          badgeColor: "badge-amber",
          desc: "Toggle between broken non-deterministic server/client values and the robust mounting flag solution.",
        },
        {
          num: "14",
          title: "Server Components vs Client Components",
          path: "/server-vs-client",
          badge: "RSC Architecture",
          badgeColor: "badge-blue",
          desc: "A Server Component querying data with 0 KB client bundle, passing props to an interactive Client Component.",
        },
        {
          num: "15",
          title: "Server & Client Composition Patterns",
          path: "/server-client-composition",
          badge: "Children Slot",
          badgeColor: "badge-blue",
          desc: "Master the Children Slot pattern to nest zero-bundle Server Components inside interactive Client wrappers.",
        },
        {
          num: "16",
          title: "RSC Payload Internals & Wire Format",
          path: "/rsc-payload",
          badge: "Wire Protocol",
          badgeColor: "badge-purple",
          desc: "Inspect the raw streaming RSC payload wire protocol and see how React updates pages without destroying state.",
        },
      ],
    },
    {
      phase: "Phase 4: Advanced Next.js, Performance & Capstone",
      items: [
        {
          num: "17",
          title: "Streaming SSR & React Suspense",
          path: "/streaming",
          badge: "Chunked Transfer",
          badgeColor: "badge-green",
          desc: "Instant shell delivery with Suspense skeleton loaders, followed by slow data streaming into the page in real time.",
        },
        {
          num: "18",
          title: "Partial Prerendering (PPR)",
          path: "/partial-prerendering",
          badge: "PPR Static+Stream",
          badgeColor: "badge-green",
          desc: "Instant static CDN shell served in 15ms while dynamic holes stream personalized data in parallel.",
        },
        {
          num: "19",
          title: "Next.js 4 Caching Layers",
          path: "/caching-layers",
          badge: "Cache Architecture",
          badgeColor: "badge-amber",
          desc: "Interactive simulator for Request Memoization, Data Cache, Full Route Cache, and Browser Router Cache.",
        },
        {
          num: "20",
          title: "Client-Side Navigation & Prefetching",
          path: "/client-navigation",
          badge: "Soft Navigation",
          badgeColor: "badge-blue",
          desc: "Compare standard anchor reloads against Next.js Link prefetching and in-memory state preservation.",
        },
        {
          num: "21",
          title: "Code Splitting & Selective Hydration",
          path: "/code-splitting",
          badge: "next/dynamic",
          badgeColor: "badge-green",
          desc: "Load heavy analytical dashboards on demand, reducing initial JavaScript bundle from 450 KB to 32 KB.",
        },
        {
          num: "22",
          title: "Real-World E-Commerce Architecture",
          path: "/ecommerce-architecture",
          badge: "Enterprise Blueprint",
          badgeColor: "badge-purple",
          desc: "Complete architectural breakdown for Home (SSG), PDP (ISR+PPR), Search (SSR), and Checkout (CSR).",
        },
        {
          num: "23",
          title: "Senior Architect Interview Quiz",
          path: "/interview-quiz",
          badge: "Interview Prep",
          badgeColor: "badge-green",
          desc: "Interactive test evaluating your understanding of React Fiber, hydration, and Next.js 15 App Router.",
        },
        {
          num: "24",
          title: "Core Web Vitals & Performance",
          path: "/core-web-vitals",
          badge: "LCP / INP / CLS",
          badgeColor: "badge-green",
          desc: "Live performance lab testing image priority for LCP, startTransition for INP, and aspect-ratio for CLS.",
        },
      ],
    },
  ];

  return (
    <div>
      <div style={{ margin: "32px 0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span className="badge badge-green">24 Interactive Concepts Available</span>
          <span className="badge badge-blue">Next.js 15 & React 19 App Router</span>
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "12px" }}>
          Next.js 15 Rendering Interactive Playground
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", maxWidth: "840px", lineHeight: "1.6" }}>
          Welcome to the comprehensive live companion application for the <strong>Complete Guide to Rendering</strong>. 
          Every single one of the <strong>24 masterclass concepts</strong> has a dedicated interactive route below.
          Test browser pipelines, inspect VDOM diffs, trigger SSR streams, observe hydration, and master Core Web Vitals!
        </p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "var(--accent-blue)",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "8px",
              marginBottom: "16px",
            }}
          >
            {section.phase}
          </h2>

          <div className="grid">
            {section.items.map((item) => (
              <Link key={item.path} href={item.path} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 className="card-title" style={{ fontSize: "1rem", margin: 0 }}>
                    <span style={{ color: "var(--text-secondary)", marginRight: "6px" }}>{item.num}.</span>
                    {item.title}
                  </h3>
                  <span className={`badge ${item.badgeColor}`}>{item.badge}</span>
                </div>
                <p className="card-desc" style={{ flexGrow: 1 }}>{item.desc}</p>
                <span style={{ fontSize: "0.85rem", color: "var(--accent-blue)", fontWeight: 600, marginTop: "8px" }}>
                  Launch Interactive Demo &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
