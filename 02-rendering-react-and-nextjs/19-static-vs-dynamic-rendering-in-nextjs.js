/**
 * ============================================================================
 * MODULE 19: Static vs Dynamic Rendering & The 4 Next.js Caches
 * ============================================================================
 *
 * 1. THE "WHY" & AUTOMATIC ROUTE EVALUATION
 * ----------------------------------------------------------------------------
 * Next.js does not make you declare whether every route is "SSR" or "SSG".
 * Instead, Next.js evaluates your code automatically:
 * - If a route is purely deterministic and uses cached data: Next.js uses STATIC RENDERING.
 * - If a route relies on incoming request details: Next.js switches to DYNAMIC RENDERING.
 *
 * WHAT ARE DYNAMIC FUNCTIONS?
 * The moment a Server Component accesses any of these 3 things, Next.js automatically 
 * switches the route from Static to Dynamic:
 * 1. `cookies()`: Accessing request cookies (User session, cart token).
 * 2. `headers()`: Accessing HTTP headers (Authorization, User-Agent, IP address).
 * 3. `searchParams`: Accessing query string parameters (`/products?category=phones`).
 *
 *
 * 2. ROUTE SEGMENT CONFIGURATION (EXPLICIT OVERRIDES)
 * ----------------------------------------------------------------------------
 * You can explicitly control how Next.js renders any route using segment config:
 *
 * export const dynamic = 'auto'; // Default: Static unless dynamic functions used.
 * export const dynamic = 'force-dynamic'; // Equivalent to classic SSR (always runs on request).
 * export const dynamic = 'force-static'; // Force SSG (cookies/headers return empty).
 * export const dynamic = 'error'; // Build fails if any dynamic function is used (great for pure static sites).
 *
 *
 * 3. THE 4 NEXT.JS CACHING LAYERS
 * ----------------------------------------------------------------------------
 * Next.js features a multi-tiered caching architecture:
 *
 * Layer 1: Request Memoization (React Cache)
 *   If 5 different components call `fetch('/api/user/1')` during the same page 
 *   render, React executes the HTTP request ONCE and memoizes it in memory!
 *
 * Layer 2: Data Cache (Next.js Server)
 *   Persists fetch responses across multiple incoming user requests.
 *   Controlled by `cache: 'force-cache'`, `cache: 'no-store'`, or `next: { revalidate: 60 }`.
 *
 * Layer 3: Full Route Cache (Next.js Server & CDN)
 *   Caches the full HTML and RSC payload on the server/CDN for static routes.
 *
 * Layer 4: Router Cache (Client Browser Memory)
 *   Caches visited RSC payloads in browser memory as the user clicks links, 
 *   making back/forward navigation instant!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 19: Static vs Dynamic Rendering & The 4 Caches");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE NEXT.JS ROUTE SEGMENT ANALYZER
// ============================================================================
console.log("--- 1. NEXT.JS AUTOMATIC ROUTE EVALUATION ENGINE ---");

function analyzeRouteEligibility(routePath, featuresUsed) {
  console.log(`Analyzing route: "${routePath}"...`);

  const dynamicTriggers = [];
  if (featuresUsed.hasCookies) dynamicTriggers.push("cookies() accessed");
  if (featuresUsed.hasHeaders) dynamicTriggers.push("headers() accessed");
  if (featuresUsed.hasSearchParams) dynamicTriggers.push("searchParams query string accessed");
  if (featuresUsed.hasUncachedFetch) dynamicTriggers.push("fetch(..., { cache: 'no-store' }) used");

  if (dynamicTriggers.length > 0) {
    return {
      route: routePath,
      renderingMode: "DYNAMIC RENDERING (Request-Time SSR)",
      reasons: dynamicTriggers,
      canBeCachedOnCDN: false,
    };
  }

  return {
    route: routePath,
    renderingMode: "STATIC RENDERING (Build-Time SSG / ISR)",
    reasons: ["Pure deterministic data", "All fetches are cached"],
    canBeCachedOnCDN: true,
  };
}

const routeA = analyzeRouteEligibility("/about", {
  hasCookies: false,
  hasHeaders: false,
  hasSearchParams: false,
  hasUncachedFetch: false,
});
console.log(routeA);

const routeB = analyzeRouteEligibility("/dashboard", {
  hasCookies: true, // User session cookie
  hasHeaders: true,
  hasSearchParams: false,
  hasUncachedFetch: true,
});
console.log("\n", routeB);


// ============================================================================
// SECTION 2: SIMULATING LAYER 1: REQUEST MEMOIZATION
// ============================================================================
console.log("\n--- 2. LAYER 1: REACT REQUEST MEMOIZATION ---");

let actualNetworkCalls = 0;
const memoryCache = new Map();

async function memoizedFetch(url) {
  if (memoryCache.has(url)) {
    console.log(` - [Memoization HIT] Returning cached promise for: ${url}`);
    return memoryCache.get(url);
  }

  console.log(` - [Network Request] Firing real HTTP request for: ${url}`);
  actualNetworkCalls++;
  const promise = Promise.resolve({ data: `Payload for ${url}` });
  memoryCache.set(url, promise);
  return promise;
}

// 3 independent components on the same page requesting current user:
async function simulateRenderTree() {
  console.log("Component A (Header) requests /api/me:");
  await memoizedFetch("/api/me");

  console.log("Component B (Sidebar) requests /api/me:");
  await memoizedFetch("/api/me");

  console.log("Component C (Footer) requests /api/me:");
  await memoizedFetch("/api/me");

  console.log(`Total components calling fetch: 3 | Actual network calls executed: ${actualNetworkCalls}`);
}

simulateRenderTree().then(() => {
  // ==========================================================================
  // SECTION 3: THE 4 CACHING LAYERS CHEAT SHEET
  // ==========================================================================
  console.log("\n--- 3. THE 4 NEXT.JS CACHING LAYERS ---");

  const cacheLayers = [
    {
      Layer: "1. Request Memoization",
      Where: "Server Memory",
      Purpose: "Deduplicates identical fetch() calls within a single render pass.",
      Duration: "Lifetime of a single request.",
    },
    {
      Layer: "2. Data Cache",
      Where: "Server Storage (Disk/Redis)",
      Purpose: "Stores fetch() data across requests and across different users.",
      Duration: "Persistent until revalidated.",
    },
    {
      Layer: "3. Full Route Cache",
      Where: "Server & CDN Edge",
      Purpose: "Stores pre-rendered HTML and RSC Payload for static routes.",
      Duration: "Persistent until rebuilt/revalidated.",
    },
    {
      Layer: "4. Router Cache",
      Where: "Client Browser Memory",
      Purpose: "Stores visited RSC payloads in browser RAM during session navigation.",
      Duration: "Session / Tab lifetime.",
    },
  ];

  console.table(cacheLayers);
  console.log("\nModule 19 loaded and executed successfully.");
});

