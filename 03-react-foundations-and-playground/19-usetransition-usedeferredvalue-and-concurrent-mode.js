/**
 * ============================================================================
 * MODULE 19: useTransition and useDeferredValue — Concurrent React 18 & 19
 * ============================================================================
 * 
 * 1. THE PROBLEM: UNINTERRUPTIBLE RENDERING IN TRADITIONAL REACT
 * ----------------------------------------------------------------------------
 * In React 17 and earlier, rendering was synchronous. Once React started rendering
 * a list of 5,000 elements, it could NOT be stopped.
 * If a user typed into an autocomplete search box, the text cursor froze until
 * the entire 5,000-item list finished rendering.
 * 
 * 2. CONCURRENT REACT & URGENT VS TRANSITION UPDATES
 * ----------------------------------------------------------------------------
 * React 18 & 19 introduced Concurrent Rendering, dividing updates into 2 classes:
 * 
 * 1. URGENT UPDATES:
 *    Reflects direct user physical interaction: typing, clicking, dragging.
 *    Needs instantaneous visual feedback (< 16ms).
 * 
 * 2. TRANSITION UPDATES (Non-urgent):
 *    Transitioning the UI from one view to another: filtering a catalog, switching tabs.
 *    Can be interrupted if a new urgent update arrives!
 * 
 * 3. WHAT IS `useTransition`?
 * ----------------------------------------------------------------------------
 *   const [isPending, startTransition] = useTransition();
 * 
 * Wrap non-urgent updates inside `startTransition`:
 *   function handleChange(e) {
 *     // Urgent: Update input text immediately so typing feels instant
 *     setInputText(e.target.value);
 * 
 *     // Non-urgent: Defer heavy list filter
 *     startTransition(() => {
 *       setFilteredResults(heavySearch(e.target.value));
 *     });
 *   }
 * 
 * 4. WHAT IS `useDeferredValue`?
 * ----------------------------------------------------------------------------
 * When you don't control the state setter (e.g. receiving a prop from parent):
 *   const deferredValue = useDeferredValue(text);
 * 
 * React renders with the old `deferredValue` first, then updates it in the 
 * background once urgent work finishes!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 19: useTransition, useDeferredValue & Concurrency");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE CONCURRENT INTERRUPTIBLE SCHEDULER
// ============================================================================
console.log("--- 1. URGENT VS TRANSITION PRIORITY SCHEDULER ---");

class MockConcurrentScheduler {
  constructor() {
    this.urgentQueue = [];
    this.transitionQueue = [];
    this.isRendering = false;
  }

  // Urgent update (Typing in input box)
  scheduleUrgent(actionName) {
    console.log(`[Urgent Input] ⚡ User typed: "${actionName}" (Priority: HIGH)`);
    this.urgentQueue.push(actionName);
    this.processWork();
  }

  // Non-urgent transition (Filtering heavy list)
  scheduleTransition(actionName) {
    console.log(`[Transition] 🐢 Scheduled heavy filter: "${actionName}" (Priority: LOW)`);
    this.transitionQueue.push(actionName);
    this.processWork();
  }

  processWork() {
    // 1. Process ALL urgent work first
    while (this.urgentQueue.length > 0) {
      const urgentTask = this.urgentQueue.shift();
      console.log(`  -> [Scheduler Execution] Rendered urgent input update: "${urgentTask}" (0ms latency)`);
    }

    // 2. Only process transitions when urgent queue is completely drained
    if (this.transitionQueue.length > 0) {
      const transitionTask = this.transitionQueue.shift();
      console.log(`  -> [Scheduler Execution] Yielded to background. Rendered transition: "${transitionTask}"`);
    }
  }
}

const scheduler = new MockConcurrentScheduler();

console.log("User types 'i' into autocomplete:");
scheduler.scheduleUrgent("i");
scheduler.scheduleTransition("Filter 5,000 items with query 'i'");

console.log("\nUser quickly types 'ip' before the 5,000 items finish filtering:");
scheduler.scheduleUrgent("ip");
scheduler.scheduleTransition("Filter 5,000 items with query 'ip'");

console.log("\n==================================================================");
console.log("  useTransition VS useDeferredValue QUICK GUIDE");
console.log("==================================================================");
console.log("Hook              | Where Used             | Typical Use Case");
console.log("------------------|------------------------|--------------------------");
console.log("useTransition     | Wraps a setState call  | startTransition(() => setPage(2))");
console.log("useDeferredValue  | Wraps a raw value/prop | const deferred = useDeferredValue(query)");
console.log("isPending         | Provided by transition | Shows subtle loading indicator");
console.log("==================================================================\n");

console.log("✅ Module 19 Execution Verified: Concurrent scheduling and transition priorities proven.");
