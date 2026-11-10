/**
 * ============================================================================
 * MODULE 08: SSR — Server-Side Rendering
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL BACKGROUND
 * ----------------------------------------------------------------------------
 * While Client-Side Rendering (CSR) provided great app-like interactivity, it 
 * suffered from poor First Contentful Paint (FCP) and major SEO challenges.
 * Users on 3G/4G connections stared at blank white screens for several seconds 
 * while multi-megabyte JavaScript bundles downloaded and parsed.
 *
 * Server-Side Rendering (SSR) returned to the strengths of traditional web 
 * architecture, but supercharged it with React component modeling.
 *
 * HOW SSR WORKS STEP-BY-STEP:
 * 1. User requests `https://shop.com/products/iphone-17`.
 * 2. Next.js server receives the request.
 * 3. Server queries the database or API directly on the server.
 * 4. Server executes the React component tree and renders it into a complete HTML string.
 * 5. Server sends the fully-populated HTML document to the browser.
 * 6. The browser immediately paints the content! (User sees text & images right away!).
 * 7. In the background, the JavaScript bundle downloads.
 * 8. Hydration occurs: React connects event listeners, making buttons clickable.
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In Laravel:
 *   Laravel has always been SSR! When a user requests `/products/iphone-17`, 
 *   Laravel queries MySQL: `$product = Product::find(1);` and returns `view('product', compact('product'))`.
 *   The server generates the HTML on demand for each request.
 *
 * - In Next.js App Router:
 *   SSR behaves virtually identical to Laravel, but with an enormous bonus:
 *   After the initial server-rendered HTML page loads, subsequent link clicks 
 *   do NOT reload the entire browser! React seamlessly transitions into 
 *   client-side navigation!
 *
 *
 * 3. SSR IN NEXT.JS APP ROUTER
 * ----------------------------------------------------------------------------
 * In Next.js App Router, any Server Component that:
 * - Uses `fetch('...', { cache: 'no-store' })`, OR
 * - Uses dynamic functions like `cookies()` or `headers()`, OR
 * - Sets `export const dynamic = 'force-dynamic'`
 * Automatically becomes a dynamic Server-Side Rendered (SSR) route!
 *
 *
 * 4. ADVANTAGES & DISADVANTAGES OF SSR
 * ----------------------------------------------------------------------------
 * ✅ ADVANTAGES:
 * - Fast First Contentful Paint (FCP): Complete text/images visible immediately.
 * - 100% SEO Friendly: Web crawlers (Google, Bing, social media link unfurls) get full HTML.
 * - Always Fresh Data: Every page load reflects the latest database state.
 *
 * ❌ DISADVANTAGES:
 * - Higher TTFB (Time to First Byte): Server must wait for DB queries before responding.
 * - High Server Compute Load: If 100,000 visitors hit the page simultaneously, 
 *   the server must run React render logic 100,000 times!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 08: SSR — Server-Side Rendering");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE COMPLETE SSR REQUEST LIFECYCLE
// ============================================================================
console.log("--- 1. SIMULATING SERVER-SIDE RENDERING (SSR) TIMELINE ---");

async function simulateSSRRequest(productId) {
  console.log(`[T=0ms]   Incoming HTTP Request: GET /products/${productId}`);
  console.log(`[T=5ms]   Next.js Server identifies dynamic route (cache: 'no-store')`);

  // Step 1: Server fetches data from DB
  console.log(`[T=10ms]  Server querying Database: SELECT * FROM products WHERE id = ${productId}...`);
  await new Promise((r) => setTimeout(r, 40));
  const productData = { id: productId, name: "iPhone 17 Pro", price: 999 };

  // Step 2: Server renders React tree to HTML
  console.log(`[T=55ms]  Server rendering React Component tree into HTML string...`);
  const serverRenderedHTML = `
  <div id="product-page">
    <h1>${productData.name}</h1>
    <p class="price">$${productData.price}</p>
    <button id="add-btn">Add to Cart</button>
  </div>
  `.trim();

  // Step 3: Server sends completed HTML to browser
  console.log(`[T=65ms]  Server sends HTTP 200 with fully-rendered HTML!`);
  console.log(`[T=90ms]  Browser receives complete HTML:`);
  console.log(`          --> Visual state: USER SEES PRODUCT DETAILS & PRICE IMMEDIATELY!`);

  // Step 4: Client hydration occurs
  console.log(`[T=150ms] Client JavaScript bundle loads. React hydrates <button id="add-btn">.`);
  console.log(`          --> Page is now fully interactive!`);
}

simulateSSRRequest(101).then(() => {
  // ==========================================================================
  // SECTION 2: NEXT.JS APP ROUTER SSR CODE PATTERN
  // ==========================================================================
  console.log("\n--- 2. NEXT.JS APP ROUTER DYNAMIC SSR COMPONENT ---");

  const nextJsSSRCode = `
  // app/products/[id]/page.jsx
  // Default is a React Server Component (RSC)
  
  export const dynamic = "force-dynamic"; // Opts into request-time SSR

  async function getProduct(id) {
    // cache: 'no-store' ensures fresh data on every single HTTP request
    const res = await fetch(\`https://api.internal/products/\${id}\`, {
      cache: "no-store",
    });
    return res.json();
  }

  export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    return (
      <main>
        <h1>{product.name}</h1>
        <p>Price: \${product.price}</p>
      </main>
    );
  }
  `;

  console.log(nextJsSSRCode.trim());

  // ==========================================================================
  // SECTION 3: SSR ARCHITECTURE CHEAT SHEET
  // ==========================================================================
  console.log("\n--- 3. SSR SUMMARY MATRIX ---");

  const ssrSummary = [
    {
      Metric: "When is HTML Generated?",
      Value: "At request time (every single HTTP request).",
    },
    {
      Metric: "Rendering Location",
      Value: "Node.js Server runtime.",
    },
    {
      Metric: "Data Freshness",
      Value: "100% Real-time / Up-to-date.",
    },
    {
      Metric: "SEO Capabilities",
      Value: "Excellent (Crawlers see complete markup).",
    },
    {
      Metric: "Best For",
      Value: "Live stock prices, user account dashboards, personalized feeds.",
    },
  ];

  console.table(ssrSummary);
  console.log("\nModule 08 loaded and executed successfully.");
});

