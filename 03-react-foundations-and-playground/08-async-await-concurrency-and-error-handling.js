/**
 * ============================================================================
 * MODULE 08: Async/Await Concurrency, Error Handling & The "Does Await Stop JS?" Question
 * ============================================================================
 * 
 * 1. THE BIG QUESTION: "DOES AWAIT STOP JAVASCRIPT?" (Prompt 2 Highlight)
 * ----------------------------------------------------------------------------
 * When a developer writes:
 *   const response = await fetch("/api/products");
 * 
 * Does the JavaScript engine freeze and stop dead on that line?
 * 
 * 🔴 THE ANSWER: ABSOLUTELY NOT!
 * `await` suspends ONLY the current async function's execution frame.
 * It immediately YIELDS control back to the Call Stack and the Event Loop!
 * 
 * While that async function is paused waiting for the network/database:
 * - Other functions continue running.
 * - The browser continues accepting user clicks, typing, and CSS animations.
 * - In Node.js, your server continues accepting and responding to other incoming HTTP requests!
 * 
 * When the awaited Promise settles, the runtime posts a microtask to RESUME
 * the suspended async function right where it paused.
 * 
 * 2. WHAT IS THE `async` KEYWORD?
 * ----------------------------------------------------------------------------
 * Placed before a function declaration, it guarantees that the function ALWAYS 
 * returns a Promise:
 *   async function greet() { return "Hello"; }
 * is functionally equivalent to:
 *   function greet() { return Promise.resolve("Hello"); }
 * 
 * If an async function throws an error:
 *   async function fail() { throw new Error("Boom"); }
 * it returns a REJECTED Promise rather than throwing a synchronous exception.
 * 
 * 3. SEQUENTIAL VS PARALLEL EXECUTION:
 * ----------------------------------------------------------------------------
 * - Sequential: Task B needs output of Task A (Dependent).
 *     const user = await getUser(id);
 *     const orders = await getOrders(user.id);
 * 
 * - Parallel / Concurrent: Independent tasks (Optimize performance!).
 *     // ❌ SLOW: Waits sequentially (total time = 200ms + 200ms = 400ms)
 *     const products = await getProducts();
 *     const categories = await getCategories();
 * 
 *     // ✅ FAST: Fires both at once (total time = max(200ms, 200ms) = 200ms!)
 *     const [products, categories] = await Promise.all([getProducts(), getCategories()]);
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 08: Async/Await, Concurrency & The Suspension Mechanism");
console.log("==================================================================\n");

// Helper function to simulate network delay
const delay = (ms, value, shouldFail = false) => 
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Failed: ${value}`));
      else resolve(value);
    }, ms);
  });

// ============================================================================
// SECTION 1: PROVING THAT `await` DOES NOT FREEZE THE THREAD
// ============================================================================
console.log("--- 1. PROVING NON-BLOCKING SUSPENSION ---");

async function simulateSuspendedAsyncFunction() {
  console.log("  [Async Fn] 1. Entered async function. Starting 30ms await...");
  
  // Await suspends this function and returns to caller!
  const result = await delay(30, "Database Record #1049");
  
  console.log(`  [Async Fn] 2. Resumed! Value received: "${result}"`);
  return result;
}

console.log("A. [Main Thread] Before calling async function");
const pendingPromise = simulateSuspendedAsyncFunction();
console.log("B. [Main Thread] Immediately AFTER calling async function (Thread is FREE!)");
console.log("C. [Main Thread] Doing other synchronous work while async function is suspended...\n");

// ============================================================================
// SECTION 2: SEQUENTIAL VS CONCURRENT ASYNC/AWAIT
// ============================================================================
async function runConcurrencyComparison() {
  // Wait for section 1 to settle first
  await pendingPromise;

  console.log("\n--- 2. SEQUENTIAL VS PARALLEL EXECUTION BENCHMARK ---");

  // A. Dependent Sequential Requests
  console.log("Scenario A: Dependent Workflow (Sequential)");
  const user = await delay(20, { id: 42, name: "Haris Ali" });
  console.log(`  Step 1: Retrieved user: ${user.name}`);
  const orders = await delay(20, [{ id: "ord_1", item: "Laptop Screen" }]);
  console.log(`  Step 2: Retrieved orders for user ${user.id}:`, orders);

  // B. Independent Concurrent Requests via Promise.all
  console.log("\nScenario B: Independent Workflow (Parallel with Promise.all)");
  const startTime = Date.now();
  
  const [products, categories, banners] = await Promise.all([
    delay(30, ["MacBook Pro", "Dell XPS"]),
    delay(30, ["Laptops", "Monitors"]),
    delay(30, ["Black Friday Sale"])
  ]);

  const elapsed = Date.now() - startTime;
  console.log(`  Products:   ${products.join(", ")}`);
  console.log(`  Categories: ${categories.join(", ")}`);
  console.log(`  Banners:    ${banners.join(", ")}`);
  console.log(`  ⚡ All 3 requests completed concurrently in ~${elapsed}ms (instead of ~90ms sequential!)\n`);

  // ============================================================================
  // SECTION 3: ROBUST ERROR HANDLING (Checking response.ok)
  // ============================================================================
  console.log("--- 3. ROBUST HTTP ERROR HANDLING WITH TRY/CATCH ---");

  // Simulating fetch with status code
  async function mockFetch(url, simulateStatus = 200) {
    await delay(15, null);
    return {
      ok: simulateStatus >= 200 && simulateStatus < 300,
      status: simulateStatus,
      json: async () => ({ error: "Item Not Found in Catalog", code: 404 })
    };
  }

  async function getCatalogItem(itemId) {
    try {
      console.log(`Fetching catalog item ${itemId}...`);
      const response = await mockFetch(`/api/items/${itemId}`, 404);

      // CRITICAL: fetch does NOT throw on 404 or 500! We must verify response.ok!
      if (!response.ok) {
        throw new Error(`HTTP Error: Server responded with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`  [Catch Block] Safely intercepted error: "${error.message}"`);
      return null; // Graceful fallback
    } finally {
      console.log(`  [Finally Block] Cleanup executed (e.g. dismissed loading spinner).`);
    }
  }

  await getCatalogItem("item_missing_99");

  console.log("\n✅ Module 08 Execution Verified: Async/Await mechanics and suspension fully proven.");
}

runConcurrencyComparison();
