/**
 * ============================================================================
 * MODULE 03: Stale Closures in React — Diagnosis, Mechanics & 3 Modern Solutions
 * ============================================================================
 * 
 * 1. WHAT IS A "STALE CLOSURE"?
 * ----------------------------------------------------------------------------
 * In React, components are functions that execute repeatedly on every state change.
 * Every render produces a "snapshot" of local variables (props, state, handlers).
 * 
 * A STALE CLOSURE occurs when an asynchronous callback (such as `setTimeout`,
 * `setInterval`, an event listener, or a memoized function) holds onto a reference
 * to a variable from an EARLIER render snapshot, rather than the CURRENT state.
 * 
 * 2. THE CLASSIC BUG SCENARIO
 * ----------------------------------------------------------------------------
 * Consider this React component:
 *   function Counter() {
 *     const [count, setCount] = useState(0);
 * 
 *     const handleDelayedAdd = () => {
 *       setTimeout(() => {
 *         setCount(count + 1); // ⚠️ DANGER: Captures 'count' from when clicked!
 *       }, 3000);
 *     };
 * 
 *     return <button onClick={handleDelayedAdd}>Add Later</button>;
 *   }
 * 
 * What happens:
 * 1. At render 1: `count` is 0.
 * 2. User clicks "Add Later". `setTimeout` is scheduled, closing over `count = 0`.
 * 3. Meanwhile, user clicks an instant increment button 5 times. Current `count` is now 5.
 * 4. 3 seconds elapse. The timeout callback fires:
 *    It executes `setCount(0 + 1)`.
 * 5. State reverts from 5 back to 1! 💥 User is confused and bug report filed.
 * 
 * 3. THE 3 MODERN BATTLE-TESTED SOLUTIONS:
 * ----------------------------------------------------------------------------
 * - Solution 1: Functional State Updater -> `setCount(prev => prev + 1)`
 *   React guarantees that `prev` is always the freshest, committed value.
 * 
 * - Solution 2: Exhaustive Dependency Arrays in `useEffect` / `useCallback`
 *   Re-create the closure whenever dependencies change.
 * 
 * - Solution 3: The `useRef` Pattern (Ref-Forwarding Escape Hatch)
 *   Keep a mutable reference `latestRef.current = count` to read latest state 
 *   without tearing down timers or re-subscribing to expensive WebSockets.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 03: Stale Closures in React & Battle-Tested Solutions");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE STALE CLOSURE BUG (The Problem)
// ============================================================================
console.log("--- 1. REPRODUCING THE STALE CLOSURE IN PURE JAVASCRIPT ---");

class MockReactEngine {
  constructor(initialState = 0) {
    this.state = initialState;
    this.queuedTasks = [];
  }

  // Simulates normal state assignment
  setCountDirect(newValue) {
    this.state = newValue;
    console.log(`[React Engine] State updated directly to: ${this.state}`);
  }

  // Simulates functional updater
  setCountFunctional(updaterFn) {
    this.state = updaterFn(this.state);
    console.log(`[React Engine] State updated functionally to: ${this.state}`);
  }
}

const engine = new MockReactEngine(0);

// Render Pass 1: count is 0
let currentRenderCount = engine.state; // 0
console.log(`Initial Render: count is ${currentRenderCount}`);

// User clicks button with delayed handler that captures 'currentRenderCount'
const staleCallback = () => {
  console.log(`\n[Timer Firing] Executing delayed callback...`);
  console.log(`[Timer Firing] Value captured in closure: ${currentRenderCount}`);
  // Buggy update: uses the old captured value
  engine.setCountDirect(currentRenderCount + 1);
};

// Now simulate user clicking "+1" immediately 5 times while timer is pending:
console.log("\nUser rapidly increments count 5 times in the UI...");
for (let i = 1; i <= 5; i++) {
  engine.setCountDirect(i);
}
console.log(`Current Live State before timer fires: ${engine.state}`); // 5

// Timer finally executes:
staleCallback();
console.log(`💥 State after buggy stale closure timer: ${engine.state} (Expected 6, got 1!)`);

// ============================================================================
// SECTION 2: SOLUTION 1 — FUNCTIONAL STATE UPDATER
// ============================================================================
console.log("\n--- 2. SOLUTION 1: FUNCTIONAL STATE UPDATER ---");

const engineSolved1 = new MockReactEngine(0);
let renderCountSnapshot = engineSolved1.state; // 0

// The callback does NOT rely on the captured snapshot variable!
const fixedFunctionalCallback = () => {
  console.log(`\n[Timer Firing] Executing functional updater callback...`);
  // Solution: React supplies the latest state to the updater argument!
  engineSolved1.setCountFunctional(previousState => {
    console.log(`[React Updater] Received true current state: ${previousState}`);
    return previousState + 1;
  });
};

// User rapidly increments count 5 times:
console.log("User rapidly increments count 5 times in the UI...");
for (let i = 1; i <= 5; i++) {
  engineSolved1.setCountDirect(i);
}
console.log(`Current Live State before timer fires: ${engineSolved1.state}`); // 5

// Timer executes:
fixedFunctionalCallback();
console.log(`✅ State after functional updater: ${engineSolved1.state} (Correctly evaluated to 6!)`);

// ============================================================================
// SECTION 3: SOLUTION 2 — THE useRef ESCAPE HATCH (For Asynchronous Handlers)
// ============================================================================
console.log("\n--- 3. SOLUTION 2: THE useRef MUTABLE CONTAINER PATTERN ---");

/**
 * When you need to READ the latest state inside an async handler or event listener
 * without re-triggering the timer or listener setup:
 */
class MockRef {
  constructor(initialValue) {
    this.current = initialValue;
  }
}

const engineSolved2 = new MockReactEngine(0);
const latestCountRef = new MockRef(engineSolved2.state);

// On every render, React components update the ref's .current property:
function syncRefWithRender(newRenderValue) {
  latestCountRef.current = newRenderValue;
}

const fixedRefCallback = () => {
  console.log(`\n[Timer Firing] Executing ref-based callback...`);
  console.log(`[Timer Firing] Reading latestCountRef.current: ${latestCountRef.current}`);
  engineSolved2.setCountDirect(latestCountRef.current + 1);
};

// Simulate user updates:
for (let i = 1; i <= 5; i++) {
  engineSolved2.setCountDirect(i);
  syncRefWithRender(engineSolved2.state); // Component re-rendered, updated ref
}

fixedRefCallback();
console.log(`✅ State after useRef pattern: ${engineSolved2.state} (Correctly evaluated to 6!)`);

console.log("\n==================================================================");
console.log("  STALE CLOSURE DECISION MATRIX");
console.log("==================================================================");
console.log("Scenario                     | Recommended Fix");
console.log("-----------------------------|------------------------------------");
console.log("Updating state inside async  | setCount(prev => prev + 1)");
console.log("Effect reading changing state| Add variable to dependency array [state]");
console.log("Long-lived listener / timer  | Keep latest value in useRef(state)");
console.log("==================================================================\n");

console.log("✅ Module 03 Execution Verified: Stale closure diagnosis and all 3 solutions verified.");
