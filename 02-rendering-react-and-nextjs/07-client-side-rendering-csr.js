/**
 * ============================================================================
 * MODULE 07: CSR — Client-Side Rendering
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL BACKGROUND
 * ----------------------------------------------------------------------------
 * In the early 2010s, Single-Page Applications (SPAs) transformed the web.
 * Traditional multi-page websites reloaded the entire page on every single link 
 * click, causing jarring white flashes and destroying client-side UI state.
 *
 * Client-Side Rendering (CSR) solved this by turning the browser into a rich 
 * application runtime. React projects created with Create React App (CRA) or 
 * Vite use CSR by default.
 *
 * HOW CSR WORKS STEP-BY-STEP:
 * 1. User visits `https://my-app.com`.
 * 2. Web server responds with a virtually empty HTML shell:
 *    <!DOCTYPE html>
 *    <html>
 *      <body>
 *        <div id="root"></div> <!-- 💥 COMPLETELY BLANK! -->
 *        <script type="module" src="/src/main.jsx"></script>
 *      </body>
 *    </html>
 * 3. The browser downloads the JavaScript bundle (`bundle.js`).
 * 4. The browser executes React in the user's browser CPU.
 * 5. React mounts the components into `#root` and paints the initial UI.
 * 6. `useEffect` triggers HTTP fetches to get backend data.
 * 7. When data returns, React re-renders with the real content.
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In Traditional PHP:
 *   The server does all the work. PHP queries MySQL, populates Blade HTML, and 
 *   sends complete markup to the browser.
 *
 * - In React CSR (e.g. Vite + Laravel API):
 *   Laravel acts PURELY as a headless JSON API (`/api/v1/products`).
 *   The frontend HTML is completely static. The client's phone or laptop CPU 
 *   is responsible for downloading JavaScript, parsing JSON, and generating DOM elements.
 *
 *
 * 3. ADVANTAGES & DISADVANTAGES OF CSR
 * ----------------------------------------------------------------------------
 * ✅ ADVANTAGES:
 * - Ultra-smooth navigation: Zero page reloads after initial load.
 * - Reduced server load: The server only serves static files and JSON endpoints.
 * - Offline capabilities: Can be turned into a Progressive Web App (PWA).
 * - Ideal for: User dashboards, SaaS tools, Admin panels, Canvas apps, Trello/Canva.
 *
 * ❌ DISADVANTAGES:
 * - Slow Initial Page Load: Users stare at a blank screen or spinner while JS downloads.
 * - Data Fetching Waterfall: Data fetch doesn't even START until the JS bundle has 
 *   downloaded and executed!
 * - Heavy Client CPU/Battery consumption on budget mobile devices.
 * - SEO Vulnerability: Some search engine crawlers struggle or timeout before JS renders.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 07: CSR — Client-Side Rendering");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE COMPLETE CSR TIMELINE
// ============================================================================
console.log("--- 1. SIMULATING CLIENT-SIDE RENDERING (CSR) TIMELINE ---");

async function simulateCSRFlow() {
  console.log("[T=0ms]   User navigates to https://shop.com");
  console.log("[T=50ms]  Browser receives initial HTML from CDN:");
  console.log(`          <!DOCTYPE html><html><body><div id="root"></div></body></html>`);
  console.log(`          --> Visual state: BLANK WHITE SCREEN`);

  console.log("[T=200ms] Downloading large JavaScript bundle (main.js - 450 KB)...");
  await new Promise((r) => setTimeout(r, 60));

  console.log("[T=260ms] JavaScript downloaded! V8 parses and compiles bundle...");
  console.log("[T=300ms] React executes: createRoot(document.getElementById('root')).render(<App />)");
  console.log(`          --> Visual state: <h2>Loading Products Spinner...</h2>`);

  console.log("[T=320ms] useEffect() triggers client-side data fetch: GET /api/products");
  await new Promise((r) => setTimeout(r, 60));

  console.log("[T=380ms] API responds with JSON: [ { id: 1, name: 'iPhone 17', price: 799 } ]");
  console.log("[T=400ms] State updated: setProducts(data). React re-renders component tree.");
  console.log(`          --> Visual state: FULL PRODUCT UI DISPLAYED ON SCREEN!`);
}

simulateCSRFlow().then(() => {
  // ==========================================================================
  // SECTION 2: THE CLASSIC CSR REACT DATA FETCHING PATTERN
  // ==========================================================================
  console.log("\n--- 2. IDIOMATIC REACT CSR COMPONENT PATTERN ---");

  const simulatedCodeSnippet = `
  import { useEffect, useState } from "react";

  export default function ProductsCSR() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // ⚠️ WATERFALL: Doesn't start fetching until client bundle finishes executing!
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        });
    }, []);

    if (loading) return <div className="spinner">Loading Products...</div>;

    return (
      <div>
        <h1>Products</h1>
        {products.map((p) => <h2 key={p.id}>{p.name} - \${p.price}</h2>)}
      </div>
    );
  }
  `;

  console.log(simulatedCodeSnippet.trim());

  // ==========================================================================
  // SECTION 3: CSR SUMMARY CHEAT SHEET
  // ==========================================================================
  console.log("\n--- 3. CSR ARCHITECTURE CHEAT SHEET ---");

  const csrSummary = [
    {
      Metric: "Initial HTML Content",
      Value: "Empty shell (<div id='root'></div>)",
    },
    {
      Metric: "Rendering Execution",
      Value: "100% in user's browser CPU (Client V8)",
    },
    {
      Metric: "Time To First Byte (TTFB)",
      Value: "Ultra fast (~20ms from CDN static file)",
    },
    {
      Metric: "First Contentful Paint (FCP)",
      Value: "Slow (waits for JS bundle download)",
    },
    {
      Metric: "Best Use Cases",
      Value: "Private dashboards, Admin panels, Interactive SaaS apps",
    },
    {
      Metric: "Worst Use Cases",
      Value: "Public blogs, Ecommerce, SEO-critical landing pages",
    },
  ];

  console.table(csrSummary);
  console.log("\nModule 07 loaded and executed successfully.");
});

