/**
 * ============================================================================
 * MODULE 09: Asynchronous Code in React — useEffect Rules & Network Race Conditions
 * ============================================================================
 * 
 * 1. WHY `useEffect(async () => {})` IS STRICTLY FORBIDDEN
 * ----------------------------------------------------------------------------
 * Beginners often try writing:
 *   // ❌ CRITICAL REACT ANTI-PATTERN:
 *   useEffect(async () => {
 *     const data = await fetchUserData();
 *     setUser(data);
 *   }, []);
 * 
 * Why does React throw an error or warning?
 * - React expects the function passed to `useEffect` to return either:
 *   1. `undefined` (no cleanup needed)
 *   2. A Synchronous Cleanup Function: `() => { ... }` (invoked before unmount or re-run)
 * 
 * - An `async` function ALWAYS returns a `Promise`.
 *   React cannot invoke a Promise as a cleanup function!
 * 
 * The Canonically Correct Pattern:
 *   useEffect(() => {
 *     let isMounted = true;
 *     async function load() {
 *       const data = await fetchUserData();
 *       if (isMounted) setUser(data);
 *     }
 *     load();
 *     return () => { isMounted = false; }; // Clean synchronous cleanup!
 *   }, []);
 * 
 * 2. THE INFAMOUS "NETWORK RACE CONDITION"
 * ----------------------------------------------------------------------------
 * Imagine an e-commerce tab switcher: [Electronics] vs [Clothing]
 * 1. User clicks "Electronics". Request A starts (slow connection, takes 300ms).
 * 2. User quickly clicks "Clothing". Request B starts (fast connection, takes 50ms).
 * 3. Request B resolves first at 50ms -> State updates to "Clothing" items.
 * 4. At 300ms, Request A resolves -> Overwrites state with "Electronics"!
 * Result: User sees "Clothing" tab selected, but "Electronics" products displayed!
 * 
 * Solutions:
 * - Solution 1: Active boolean flag (`ignore = true`) in effect cleanup.
 * - Solution 2: Browser standard `AbortController` (cancels inflight HTTP request).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 09: Async in React, useEffect & Network Race Conditions");
console.log("==================================================================\n");

// Helper function to simulate network response with specific latency
const mockNetworkFetch = (category, delayMs, signal) => 
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(`[Products for ${category}]`);
    }, delayMs);

    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new Error(`Fetch aborted for category: ${category}`));
      });
    }
  });

// ============================================================================
// SECTION 1: SIMULATING THE RACE CONDITION BUG
// ============================================================================
console.log("--- 1. REPRODUCING THE NETWORK RACE CONDITION ---");

class BuggyTabComponent {
  constructor() {
    this.currentCategoryTab = null;
    this.displayedProducts = null;
  }

  // Simulates user clicking a tab without cleanup
  selectTab(category, latency) {
    this.currentCategoryTab = category;
    console.log(`[User Action] Clicked "${category}" tab (Expected latency: ${latency}ms)`);

    // Asynchronous network fetch without cancellation
    mockNetworkFetch(category, latency).then(products => {
      // ⚠️ BUG: Blindly overwriting state whenever response arrives!
      this.displayedProducts = products;
      console.log(`  -> [Response Arrived] State updated with: ${products}`);
    });
  }
}

const buggyComp = new BuggyTabComponent();

// User clicks Tab 1 (Slow: 60ms)
buggyComp.selectTab("Electronics", 60);

// 10ms later, user rapidly clicks Tab 2 (Fast: 20ms)
setTimeout(() => {
  buggyComp.selectTab("Clothing", 20);
}, 10);

// Check final state at 90ms:
setTimeout(() => {
  console.log(`\n💥 FINAL BUGGY STATE:`);
  console.log(`  Active Selected Tab:   "${buggyComp.currentCategoryTab}"`);
  console.log(`  Displayed Products:    "${buggyComp.displayedProducts}"`);
  console.log(`  ⚠️ MISMATCH: Display shows Electronics while active tab is Clothing!\n`);
  
  runAbortControllerSolution();
}, 90);

// ============================================================================
// SECTION 2: SOLUTION WITH AbortController & CLEANUP
// ============================================================================
function runAbortControllerSolution() {
  console.log("--- 2. SOLUTION VIA AbortController IN useEffect CLEANUP ---");

  class SafeTabComponent {
    constructor() {
      this.currentCategoryTab = null;
      this.displayedProducts = null;
      this.activeController = null;
    }

    // Simulates useEffect lifecycle
    selectTab(category, latency) {
      // 1. If an inflight request exists, ABORT IT (equivalent to effect cleanup)!
      if (this.activeController) {
        console.log(`[Cleanup] Aborting inflight request for "${this.currentCategoryTab}"`);
        this.activeController.abort();
      }

      this.currentCategoryTab = category;
      this.activeController = new AbortController();
      const signal = this.activeController.signal;

      console.log(`[User Action] Clicked "${category}" tab (Latency: ${latency}ms)`);

      mockNetworkFetch(category, latency, signal)
        .then(products => {
          this.displayedProducts = products;
          console.log(`  -> [Safe Response Arrived] State updated with: ${products}`);
        })
        .catch(err => {
          console.log(`  -> [Handled Cancellation] ${err.message}`);
        });
    }
  }

  const safeComp = new SafeTabComponent();

  // User clicks Tab 1 (Slow: 60ms)
  safeComp.selectTab("Electronics", 60);

  // User immediately switches to Tab 2 (Fast: 20ms)
  setTimeout(() => {
    safeComp.selectTab("Clothing", 20);
  }, 10);

  // Verify safe state:
  setTimeout(() => {
    console.log(`\n✅ FINAL SAFE STATE:`);
    console.log(`  Active Selected Tab: "${safeComp.currentCategoryTab}"`);
    console.log(`  Displayed Products:  "${safeComp.displayedProducts}"`);
    console.log(`  🎉 PERFECT MATCH: Outdated request was safely cancelled!\n`);
    console.log("✅ Module 09 Execution Verified: useEffect async rules and race conditions solved.");
  }, 90);
}
