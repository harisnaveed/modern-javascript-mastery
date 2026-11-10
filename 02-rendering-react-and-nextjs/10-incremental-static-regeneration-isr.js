/**
 * ============================================================================
 * MODULE 10: ISR — Incremental Static Regeneration
 * ============================================================================
 *
 * 1. THE "WHY" & THE STALENESS PROBLEM
 * ----------------------------------------------------------------------------
 * Pure SSG (Static Site Generation) has a crippling limitation:
 * If you have an ecommerce store with 50,000 products, running `next build` takes 
 * 45 minutes. And if a merchant updates a price from $799 to $899 in the database, 
 * the static page will continue showing $799 until a full rebuild occurs!
 *
 * But using dynamic SSR for 50,000 products puts huge load on your database and 
 * increases TTFB from 20ms to 400ms.
 *
 * THE SOLUTION: ISR (INCREMENTAL STATIC REGENERATION)
 * Next.js invented ISR to bridge the gap between static and dynamic:
 * - You get the 15ms CDN speed of static HTML.
 * - But you can regenerate static pages in the background WITHOUT rebuilding the whole site!
 *
 *
 * 2. HOW TIME-BASED ISR WORKS (STALE-WHILE-REVALIDATE)
 * ----------------------------------------------------------------------------
 * Suppose you configure: `export const revalidate = 60;` (60-second window):
 *
 * 1. Page is statically generated at build time with Price: $799.
 * 2. During the first 60 seconds: All visitors receive the cached $799 HTML instantly.
 * 3. After 60 seconds, a visitor arrives:
 *    - Next.js serves the CACHED (stale) $799 HTML immediately (User sees page instantly!).
 *    - In the BACKGROUND, Next.js executes the component, queries the database, and 
 *      regenerates fresh HTML with Price: $899.
 *    - Once regeneration succeeds, Next.js updates the CDN edge cache.
 * 4. The NEXT visitor receives the fresh $899 HTML!
 *
 *
 * 3. ON-DEMAND REVALIDATION (PURGING CACHE INSTANTLY)
 * ----------------------------------------------------------------------------
 * What if an ecommerce merchant cannot wait 60 seconds?
 * Next.js provides On-Demand Revalidation:
 * - `revalidatePath('/products/iphone-17')`
 * - `revalidateTag('products')`
 *
 * In your Laravel or Node.js CMS webhook (or Next.js Server Action), as soon 
 * as the merchant clicks "Save Price", you invoke `revalidatePath()`.
 * Next.js instantly purges the stale cache and regenerates the page on the next request!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 10: ISR — Incremental Static Regeneration");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE STALE-WHILE-REVALIDATE TIMELINE
// ============================================================================
console.log("--- 1. SIMULATING ISR (STALE-WHILE-REVALIDATE) LIFECYCLE ---");

class ISRCacheSimulator {
  constructor(revalidateSeconds = 60) {
    this.revalidateMs = revalidateSeconds * 1000;
    this.pageCache = {
      html: "<h1>iPhone 17 - $799</h1>",
      generatedAt: Date.now(),
    };
    this.dbPrice = 799; // Database initial price
  }

  // Merchant updates price in database:
  updateDatabasePrice(newPrice) {
    console.log(`\n[Database Update] Merchant changed price to: $${newPrice}`);
    this.dbPrice = newPrice;
  }

  // Visitor requests page:
  async handleRequest(visitorName, requestTimeOffsetSeconds) {
    const requestTime = this.pageCache.generatedAt + requestTimeOffsetSeconds * 1000;
    const ageSeconds = Math.floor((requestTime - this.pageCache.generatedAt) / 1000);

    console.log(`\n[Visitor: ${visitorName}] Arrives at T+${requestTimeOffsetSeconds}s (Cache age: ${ageSeconds}s)`);

    if (ageSeconds < this.revalidateMs / 1000) {
      console.log(` - [Cache HIT] Cache is FRESH (< 60s). Returning instant HTML:`);
      console.log(`   --> ${this.pageCache.html}`);
      return;
    }

    // Cache is STALE!
    console.log(` - [Cache STALE] Cache expired (> 60s).`);
    console.log(`   1. Serving existing STALE HTML to ${visitorName} immediately (Fast TTFB!):`);
    console.log(`      --> ${this.pageCache.html}`);

    console.log(`   2. Triggering BACKGROUND regeneration with fresh database data...`);
    await new Promise((r) => setTimeout(r, 50)); // Simulating DB fetch & render

    this.pageCache = {
      html: `<h1>iPhone 17 - $${this.dbPrice}</h1>`,
      generatedAt: requestTime,
    };
    console.log(`   3. ✅ Background regeneration complete! Updated CDN cache to:`);
    console.log(`      --> ${this.pageCache.html}`);
  }
}

async function runSimulation() {
  const isr = new ISRCacheSimulator(60);

  // Visitor 1 arrives at T+10 seconds
  await isr.handleRequest("User_1", 10);

  // Merchant updates price in database at T+30 seconds
  isr.updateDatabasePrice(899);

  // Visitor 2 arrives at T+45 seconds (still within 60s window)
  await isr.handleRequest("User_2", 45);

  // Visitor 3 arrives at T+75 seconds (Window expired! Triggers revalidation)
  await isr.handleRequest("User_3", 75);

  // Visitor 4 arrives at T+80 seconds (Receives freshly generated cache!)
  await isr.handleRequest("User_4", 80);
}

runSimulation().then(() => {
  // ==========================================================================
  // SECTION 2: NEXT.JS APP ROUTER ISR CODE EXAMPLES
  // ==========================================================================
  console.log("\n--- 2. NEXT.JS APP ROUTER ISR CODE EXAMPLES ---");

  const isrCodeSnippets = `
  // EXAMPLE 1: Time-Based Revalidation
  // app/products/page.jsx
  
  export const revalidate = 60; // Revalidate every 60 seconds

  export default async function ProductsPage() {
    const products = await fetch("https://api.internal/products", {
      next: { revalidate: 60, tags: ["products-list"] },
    }).then((r) => r.json());

    return <div>{/* Render products */}</div>;
  }

  // EXAMPLE 2: On-Demand Revalidation via Server Action or API
  // app/actions/update-product.js
  "use server";

  import { revalidatePath, revalidateTag } from "next/cache";

  export async function updateProductPrice(id, newPrice) {
    await db.product.update({ where: { id }, data: { price: newPrice } });

    // Instantly purges cache without waiting for time interval!
    revalidatePath(\`/products/\${id}\`);
    revalidateTag("products-list");
  }
  `;

  console.log(isrCodeSnippets.trim());

  // ==========================================================================
  // SECTION 3: ISR SUMMARY CHEAT SHEET
  // ==========================================================================
  console.log("\n--- 3. ISR SUMMARY MATRIX ---");

  const isrSummary = [
    {
      Feature: "Initial Page Delivery",
      Behavior: "Instant (< 30ms) static HTML from CDN Edge.",
    },
    {
      Feature: "When Cache Expires",
      Behavior: "Serves stale HTML to current visitor, regenerates in background.",
    },
    {
      Feature: "On-Demand Trigger",
      Behavior: "revalidatePath() or revalidateTag() purges cache immediately.",
    },
    {
      Feature: "Best Use Cases",
      Behavior: "Ecommerce product pages, blog articles, repair service pricing.",
    },
  ];

  console.table(isrSummary);
  console.log("\nModule 10 loaded and executed successfully.");
});

