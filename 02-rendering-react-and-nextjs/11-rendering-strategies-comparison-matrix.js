/**
 * ============================================================================
 * MODULE 11: Master Rendering Strategies Comparison & Hybrid Architecture
 * ============================================================================
 *
 * 1. THE "WHY" & HYBRID RENDERING REALITY
 * ----------------------------------------------------------------------------
 * A common misconception among developers is:
 * "Should I build my app using CSR, SSR, or SSG?"
 *
 * In modern fullstack web development (especially Next.js App Router), the answer 
 * is NEVER just one strategy!
 * You do NOT choose one rendering strategy for your whole website.
 * Instead, modern web architecture uses HYBRID RENDERING:
 * You choose the OPTIMAL strategy PER ROUTE (or even per component)!
 *
 *
 * 2. REAL-WORLD PRODUCTION ARCHITECTURE: ECOMMERCE STORE CASE STUDY
 * ----------------------------------------------------------------------------
 * Page                    Strategy      Why?
 * ----------------------------------------------------------------------------
 * Homepage (/)            SSG + ISR     Changes occasionally; needs 15ms CDN speed for SEO.
 * About Us (/about)       SSG           100% static; zero reason to hit a database.
 * Blog (/blog/[slug])     SSG + ISR     Articles change infrequently; revalidate on publish.
 * Product (/product/[id]) ISR (60s)     Product specs static; price/stock revalidates.
 * Search (/search?q=...)  SSR           Dynamic search queries must evaluate at request time.
 * Cart (/cart)            CSR           Client state; saved in localStorage or cookie.
 * User Dashboard (/admin) CSR or SSR    Private, authenticated, personalized; zero SEO needed.
 * Live Stock Ticker       SSR           Real-time data changes every second.
 *
 *
 * 3. THE ARCHITECTURAL DECISION TREE
 * ----------------------------------------------------------------------------
 * Q1: Does the page need SEO?
 *     - NO  -> CSR (Private dashboard, settings, internal tools).
 *     - YES -> Proceed to Q2.
 *
 * Q2: Does the content change for every single user request (e.g. cookies, geolocation)?
 *     - YES -> SSR (Request-time server rendering).
 *     - NO  -> Proceed to Q3.
 *
 * Q3: Can the content be generated in advance during build time?
 *     - YES, and it NEVER changes -> SSG (Build-time static generation).
 *     - YES, but it updates periodically -> ISR (Static generation + revalidation).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 11: Master Rendering Comparison & Hybrid Architecture");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: AUTOMATED RENDERING STRATEGY DECISION ENGINE
// ============================================================================
console.log("--- 1. RENDERING STRATEGY DECISION ENGINE ---");

function selectOptimalRenderingStrategy({
  isPrivateDashboard = false,
  needsSEO = true,
  changesPerRequest = false,
  dataUpdateFrequency = "never", // 'never', 'hours', 'seconds'
}) {
  if (isPrivateDashboard || !needsSEO) {
    return {
      strategy: "CSR (Client-Side Rendering)",
      reason: "Private, authenticated UI does not require SEO. Offload rendering to client CPU to save server costs.",
    };
  }

  if (changesPerRequest || dataUpdateFrequency === "seconds") {
    return {
      strategy: "SSR (Server-Side Rendering)",
      reason: "Data changes on every request or requires request headers/cookies. Must evaluate at request time.",
    };
  }

  if (dataUpdateFrequency === "never") {
    return {
      strategy: "SSG (Static Site Generation)",
      reason: "Content is permanent. Pre-render at build time for instant CDN delivery and zero server cost.",
    };
  }

  return {
    strategy: "ISR (Incremental Static Regeneration)",
    reason: "Content updates occasionally. Serve static HTML from CDN while revalidating cache in the background.",
  };
}

// Testing the decision engine on various pages:
const pageScenarios = [
  { name: "About Us Page", config: { needsSEO: true, dataUpdateFrequency: "never" } },
  { name: "Ecommerce Product Page", config: { needsSEO: true, dataUpdateFrequency: "hours" } },
  { name: "Live Stock Market Feed", config: { needsSEO: true, changesPerRequest: true } },
  { name: "User Settings Dashboard", config: { isPrivateDashboard: true, needsSEO: false } },
];

for (const scenario of pageScenarios) {
  const result = selectOptimalRenderingStrategy(scenario.config);
  console.log(`Page: [${scenario.name}]`);
  console.log(` -> Recommended: ${result.strategy}`);
  console.log(`    Reason: ${result.reason}\n`);
}


// ============================================================================
// SECTION 2: THE DEFINITIVE 4-STRATEGY MASTER MATRIX
// ============================================================================
console.log("--- 2. MASTER RENDERING STRATEGY MATRIX ---");

const masterMatrix = [
  {
    Strategy: "CSR",
    WhereItRenders: "Browser (Client V8)",
    WhenItRenders: "On client after JS downloads",
    InitialHTML: "Empty shell (<div id='root'>)",
    SEO: "Requires JS execution",
    TTFB: "Instant (< 20ms)",
    ServerLoad: "Zero",
  },
  {
    Strategy: "SSR",
    WhereItRenders: "Server (Node.js)",
    WhenItRenders: "At request time (every hit)",
    InitialHTML: "Full populated HTML",
    SEO: "100% Native",
    TTFB: "Moderate (waits for DB)",
    ServerLoad: "High (CPU per request)",
  },
  {
    Strategy: "SSG",
    WhereItRenders: "Build Machine (CI/CD)",
    WhenItRenders: "During 'next build'",
    InitialHTML: "Full populated HTML",
    SEO: "100% Native",
    TTFB: "Instant (< 20ms CDN)",
    ServerLoad: "Zero (Served via CDN)",
  },
  {
    Strategy: "ISR",
    WhereItRenders: "Server Background Worker",
    WhenItRenders: "Build + Background Revalidation",
    InitialHTML: "Full populated HTML",
    SEO: "100% Native",
    TTFB: "Instant (< 20ms CDN)",
    ServerLoad: "Very Low (Runs periodically)",
  },
];

console.table(masterMatrix);

console.log("\nModule 11 loaded and executed successfully.");

