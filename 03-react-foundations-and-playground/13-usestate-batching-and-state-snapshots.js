/**
 * ============================================================================
 * MODULE 13: useState Mechanics, State Snapshots, and Automatic Batching
 * ============================================================================
 * 
 * 1. STATE AS A SNAPSHOT (The #1 Mental Model for React Beginners)
 * ----------------------------------------------------------------------------
 * Setting state does NOT immediately change the variable in currently running code!
 * Inside a render pass, `state` behaves like a FIXED CONSTANT:
 * 
 *   const [count, setCount] = useState(0);
 * 
 *   function handleClick() {
 *     setCount(count + 1); // setCount(0 + 1)
 *     setCount(count + 1); // setCount(0 + 1)
 *     setCount(count + 1); // setCount(0 + 1)
 *     console.log(count);  // STILL PRINTS 0!
 *   }
 * 
 * When React re-renders, it calls the component function again. Only in the 
 * NEXT render will `count` equal 1!
 * 
 * 2. THE UPDATER QUEUE (Functional State Updates)
 * ----------------------------------------------------------------------------
 * If you need to calculate the next state based on the previous state multiple 
 * times before the next render, pass an UPDATER FUNCTION:
 * 
 *   setCount(prev => prev + 1); // Queue: [0 => 1]
 *   setCount(prev => prev + 1); // Queue: [1 => 2]
 *   setCount(prev => prev + 1); // Queue: [2 => 3]
 * 
 * React processes the queue sequentially during the next render, producing 3!
 * 
 * 3. AUTOMATIC BATCHING IN MODERN REACT (React 18 & 19)
 * ----------------------------------------------------------------------------
 * In React 18+, React groups multiple state updates into a SINGLE re-render pass
 * for optimal performance.
 * Automatic batching occurs everywhere:
 * - Inside React event handlers (`onClick`)
 * - Inside asynchronous Promises (`fetch().then(...)`)
 * - Inside timers (`setTimeout`)
 * - Inside native browser event listeners
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 13: useState Mechanics, Snapshots & Automatic Batching");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE STATE SNAPSHOT PARADOX
// ============================================================================
console.log("--- 1. DIRECT VALUE UPDATES VS FUNCTIONAL UPDATER QUEUE ---");

class MockFiberComponent {
  constructor(initialState) {
    this.committedState = initialState;
    this.updateQueue = [];
    this.renderPasses = 1;
  }

  // Simulates useState dispatch
  dispatch(action) {
    this.updateQueue.push(action);
  }

  // Simulates React's internal queue processing during re-render
  processUpdateQueue() {
    if (this.updateQueue.length === 0) return;

    let nextState = this.committedState;
    console.log(`\n[React Batch Engine] Processing ${this.updateQueue.length} queued updates together...`);

    for (const update of this.updateQueue) {
      if (typeof update === "function") {
        nextState = update(nextState);
        console.log(`  Applying functional updater: next state -> ${nextState}`);
      } else {
        nextState = update;
        console.log(`  Applying direct snapshot value: next state -> ${nextState}`);
      }
    }

    this.committedState = nextState;
    this.updateQueue = [];
    this.renderPasses++;
    console.log(`[React Batch Engine] ✨ Re-rendered! Committed State: ${this.committedState} (Total Renders: ${this.renderPasses})`);
  }
}

// SCENARIO A: Direct Value Snapshots
console.log("Scenario A: Calling setCount(count + 1) three times in a row:");
const compA = new MockFiberComponent(0);
const snapshotA = compA.committedState; // 0

compA.dispatch(snapshotA + 1); // dispatch(1)
compA.dispatch(snapshotA + 1); // dispatch(1)
compA.dispatch(snapshotA + 1); // dispatch(1)
compA.processUpdateQueue(); // Result: 1 (NOT 3!)

// SCENARIO B: Functional Updaters
console.log("\nScenario B: Calling setCount(prev => prev + 1) three times in a row:");
const compB = new MockFiberComponent(0);

compB.dispatch(prev => prev + 1);
compB.dispatch(prev => prev + 1);
compB.dispatch(prev => prev + 1);
compB.processUpdateQueue(); // Result: 3!

// ============================================================================
// SECTION 2: LAZY INITIAL STATE OPTIMIZATION
// ============================================================================
console.log("\n--- 2. LAZY INITIAL STATE OPTIMIZATION ---");

let expensiveCallCount = 0;
function parseHeavyLocalStorageData() {
  expensiveCallCount++;
  console.log(`  [Storage Engine] Executing heavy JSON parsing (Call #${expensiveCallCount})...`);
  return { theme: "dark", language: "en" };
}

// Anti-pattern: Function called on EVERY render
function simulateEagerInitialState() {
  // Notice the parentheses: parseHeavyLocalStorageData() executes every time component runs!
  return parseHeavyLocalStorageData();
}

console.log("Eager Initialization (Anti-pattern across 3 renders):");
simulateEagerInitialState();
simulateEagerInitialState();
simulateEagerInitialState();
console.log(`Total heavy executions: ${expensiveCallCount} (Wasted CPU!)`);

// Correct pattern: Pass function reference () => parseHeavyLocalStorageData()
let lazyCallCount = 0;
function simulateLazyInitialState(isInitialMount) {
  if (isInitialMount) {
    lazyCallCount++;
    console.log(`  [Lazy Engine] Executed heavy function ONCE on mount.`);
    return parseHeavyLocalStorageData();
  }
  // Subsequent renders skip execution completely!
  return null;
}

console.log("\nLazy Initialization (Idiomatic React Pattern across 3 renders):");
simulateLazyInitialState(true);  // Mount
simulateLazyInitialState(false); // Render 2 (Skipped)
simulateLazyInitialState(false); // Render 3 (Skipped)
console.log(`Total lazy executions on initial mount: ${lazyCallCount} (Optimized!)`);

console.log("\n==================================================================");
console.log("  useState CHEAT SHEET");
console.log("==================================================================");
console.log("Pattern                   | Code Syntax                 | Best For");
console.log("--------------------------|-----------------------------|-----------------");
console.log("Simple Value Update       | setCount(count + 1)         | User input, toggles");
console.log("Dependent Sequence Update | setCount(prev => prev + 1)  | Multiple updates, async");
console.log("Heavy Initializer         | useState(() => readDisk())  | LocalStorage, expensive math");
console.log("==================================================================\n");

console.log("✅ Module 13 Execution Verified: useState mechanics and snapshots proven.");
