import Link from "next/link";

export default function HomePage() {
  const demos = [
    {
      title: "01. CSR (Client-Side Rendering)",
      path: "/csr",
      badge: "Browser V8",
      badgeColor: "badge-blue",
      desc: "Simulates initial empty HTML shell (<div id='root'>), bundle download, and client useEffect data fetching with a live spinner.",
    },
    {
      title: "02. SSR (Server-Side Rendering)",
      path: "/ssr",
      badge: "Request-Time",
      badgeColor: "badge-amber",
      desc: "Dynamic server rendering on every request using cache: 'no-store' with live server timestamps and zero blank screen.",
    },
    {
      title: "03. SSG (Static Site Generation)",
      path: "/ssg",
      badge: "Build-Time CDN",
      badgeColor: "badge-green",
      desc: "Pre-rendered static HTML built ahead of time with generateStaticParams() for ultra-fast 15ms CDN delivery.",
    },
    {
      title: "04. ISR (Incremental Static Regeneration)",
      path: "/isr",
      badge: "Stale-While-Revalidate",
      badgeColor: "badge-purple",
      desc: "Static speed with background revalidation. Refresh the page to see live countdown timers and cache regeneration in action!",
    },
    {
      title: "05. Server vs Client Components",
      path: "/server-vs-client",
      badge: "RSC Architecture",
      badgeColor: "badge-blue",
      desc: "A Server Component querying data with 0 KB client bundle, passing props to an interactive Client Component with useState.",
    },
    {
      title: "06. Streaming SSR with <Suspense>",
      path: "/streaming",
      badge: "Chunked Transfer",
      badgeColor: "badge-green",
      desc: "Instant shell delivery with Suspense skeleton loaders, followed by slow reviews streaming into the page in real time.",
    },
    {
      title: "07. Keys & Reconciliation Traps",
      path: "/reconciliation-keys",
      badge: "Interactive Lab",
      badgeColor: "badge-amber",
      desc: "Type notes in input fields and prepend users to watch how key={index} corrupts user state while key={id} preserves it!",
    },
    {
      title: "08. Hydration Mismatch Demo & Fix",
      path: "/hydration-mismatch",
      badge: "Debug & Fix",
      badgeColor: "badge-amber",
      desc: "Toggle between broken code (Math.random() causing hydration errors) and the clean, production-grade mounting flag fix.",
    },
    {
      title: "09. Strategy Decision Engine",
      path: "/comparison",
      badge: "Decision Guide",
      badgeColor: "badge-purple",
      desc: "An interactive decision tool: Select your page requirements to find the mathematically optimal rendering strategy!",
    },
    {
      title: "10. Senior Architect Quiz",
      path: "/interview-quiz",
      badge: "Interview Prep",
      badgeColor: "badge-green",
      desc: "Interactive 5-question test evaluating your understanding of React Fiber, hydration, and Next.js 15 App Router.",
    },
  ];

  return (
    <div>
      <div style={{ margin: "32px 0 40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "12px" }}>
          Next.js 15 Rendering Interactive Playground
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: "800px" }}>
          Welcome to the companion live application for the Complete Guide to Rendering! 
          Explore each rendering strategy in real time, inspect browser DevTools Network streams, 
          and observe how React 19 & Next.js 15 App Router handle HTML and client state.
        </p>
      </div>

      <div className="grid">
        {demos.map((demo) => (
          <Link key={demo.path} href={demo.path} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h2 className="card-title" style={{ fontSize: "1.05rem" }}>{demo.title}</h2>
              <span className={`badge ${demo.badgeColor}`}>{demo.badge}</span>
            </div>
            <p className="card-desc">{demo.desc}</p>
            <span style={{ fontSize: "0.85rem", color: "var(--accent-blue)", fontWeight: 600 }}>
              Launch Interactive Demo &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
