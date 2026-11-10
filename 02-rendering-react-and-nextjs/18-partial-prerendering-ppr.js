/**
 * ============================================================================
 * MODULE 18: PPR — Partial Prerendering in Next.js
 * ============================================================================
 *
 * 1. THE "WHY" & THE HISTORICAL BINARY CHOICE
 * ----------------------------------------------------------------------------
 * Throughout the history of web development, developers were forced into a 
 * painful all-or-nothing binary compromise:
 * - Either a page was 100% Static (SSG) -> Blazing fast CDN delivery, but NO 
 *   personalized user data (everyone sees the exact same page).
 * - Or a page was 100% Dynamic (SSR) -> Supports personalized carts and cookies, 
 *   but slow TTFB and heavy server compute load for every single request.
 *
 * THE TRAGIC NEXT.JS PROBLEM:
 * Imagine you built a huge 5,000-word static blog post.
 * If you added a tiny `<UserAvatar />` in the top navbar reading a session cookie:
 * 💥 The ENTIRE page was forced to become a dynamic SSR route!
 * 99% static text had to be re-rendered on the server for every single visitor!
 *
 *
 * 2. THE HOLY GRAIL: PARTIAL PRERENDERING (PPR)
 * ----------------------------------------------------------------------------
 * Introduced in Next.js 14 and refined in Next.js 15, Partial Prerendering (PPR) 
 * combines static build-time speed and dynamic request-time rendering in the SAME document!
 *
 * HOW PPR WORKS ARCHITECTURALLY:
 * 1. Build Time (`next build`):
 *    Next.js analyzes your page. Everything OUTSIDE a `<Suspense>` boundary is 
 *    pre-rendered into a static HTML shell (Navbar, Layout, Footer, Static Text) 
 *    and uploaded to the CDN Edge cache.
 *
 * 2. Request Time:
 *    When a user visits the page:
 *    - Step A: The CDN immediately flushes the static shell (< 20ms TTFB!).
 *    - Step B: In parallel, Next.js server executes the dynamic `<Suspense>` holes 
 *      (e.g. User Profile, Cart items) and streams them down into the shell.
 *
 *
 * 3. CONFIGURING PPR IN NEXT.JS
 * ----------------------------------------------------------------------------
 * // next.config.js
 * const nextConfig = {
 *   experimental: {
 *     ppr: 'incremental', // Opt-in incrementally route by route
 *   },
 * };
 *
 * // app/dashboard/page.jsx
 * export const experimental_ppr = true; // Enables PPR on this specific route!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 18: PPR — Partial Prerendering in Next.js");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE PARTIAL PRERENDERING ARCHITECTURE
// ============================================================================
console.log("--- 1. SIMULATING PPR (STATIC SHELL + DYNAMIC STREAMED HOLES) ---");

class PartialPrerenderingSimulator {
  // 1. Build time: Pre-render static shell
  static buildStaticShell() {
    console.log("[Build Step: next build] Prerendering Static Shell to CDN Edge...");
    return {
      shellHTML: `
      <div id="page-shell">
        <header><nav>Logo | Home | Products | <span id="dyn-user-slot">Loading...</span></nav></header>
        <main>
          <h1>Summer Sale - 50% Off Everything!</h1>
          <p>Static promotional description pre-rendered at build time.</p>
          <div id="dyn-cart-slot"><div class="shimmer">Loading personalized cart...</div></div>
        </main>
        <footer><p>© 2026 Enterprise Store. All rights reserved.</p></footer>
      </div>
      `.trim(),
      generatedAt: "BUILD_TIME_TIMESTAMP",
    };
  }

  // 2. Request time: User arrives with cookies
  static async handleIncomingRequest(staticShell, userCookies) {
    console.log(`\n[Request Time] Incoming HTTP Request with user session cookie: "${userCookies.sessionToken}"`);
    console.log(`[T=15ms]  FLUSHING STATIC SHELL FROM CDN EDGE (Instant TTFB):`);
    console.log(staticShell.shellHTML);
    console.log(`--> User sees 95% of the visual page in under 20ms!`);

    // In parallel, server resolves dynamic user data:
    console.log(`\n[T=20ms]  Next.js Server resolving dynamic Suspense holes...`);
    await new Promise((r) => setTimeout(r, 60)); // Simulating auth DB query

    const dynamicHoleChunks = `
    <!-- Streamed Dynamic Chunk over same HTTP connection -->
    <script>
      document.getElementById("dyn-user-slot").innerHTML = "Welcome, Haris Ali (Pro Member)";
      document.getElementById("dyn-cart-slot").innerHTML = "<div class='cart-widget'>🛒 3 Items in Cart ($149.00)</div>";
    </script>
    `.trim();

    console.log(`[T=80ms]  STREAMING DYNAMIC HOLES:`);
    console.log(dynamicHoleChunks);
    console.log(`--> Static shell populated with user-specific data seamlessly!`);
  }
}

const staticShell = PartialPrerenderingSimulator.buildStaticShell();
PartialPrerenderingSimulator.handleIncomingRequest(staticShell, { sessionToken: "user_jwt_9912" }).then(() => {
  // ==========================================================================
  // SECTION 2: NEXT.JS CODE STRUCTURE FOR PPR
  // ==========================================================================
  console.log("\n--- 2. NEXT.JS APP ROUTER PPR COMPONENT STRUCTURE ---");

  const pprCodeSnippet = `
  // app/page.jsx
  import { Suspense } from "react";
  import { cookies } from "next/headers";

  export const experimental_ppr = true; // Enables Partial Prerendering!

  // Dynamic component reading request cookies:
  async function UserCartBadge() {
    const cookieStore = await cookies();
    const cartCount = cookieStore.get("cart_items")?.value || 0;
    return <span className="badge">Cart: {cartCount}</span>;
  }

  export default function HomePage() {
    return (
      <div>
        {/* 1. Statically prerendered shell at build time: */}
        <header>
          <h1>Store Header (Static Shell)</h1>
          {/* 2. Dynamic hole resolved at request time: */}
          <Suspense fallback={<span>Loading cart...</span>}>
            <UserCartBadge />
          </Suspense>
        </header>

        <section>
          <h2>Product Catalog (Static Shell)</h2>
        </section>
      </div>
    );
  }
  `;

  console.log(pprCodeSnippet.trim());

  // ==========================================================================
  // SECTION 3: PPR SUMMARY CHEAT SHEET
  // ==========================================================================
  console.log("\n--- 3. PPR COMPARISON TABLE ---");

  const pprComparison = [
    {
      Technology: "Pure SSG",
      StaticShell: "YES (Entire Page)",
      DynamicData: "NO (Cannot personalize)",
      TTFB: "Instant (< 20ms)",
    },
    {
      Technology: "Pure SSR",
      StaticShell: "NO (Server must compute all)",
      DynamicData: "YES (Full access)",
      TTFB: "Slow (~200ms-1s)",
    },
    {
      Technology: "Partial Prerendering (PPR)",
      StaticShell: "YES (Build-time shell via CDN)",
      DynamicData: "YES (Streamed via <Suspense>)",
      TTFB: "Instant (< 20ms CDN shell)",
    },
  ];

  console.table(pprComparison);
  console.log("\nModule 18 loaded and executed successfully.");
});

