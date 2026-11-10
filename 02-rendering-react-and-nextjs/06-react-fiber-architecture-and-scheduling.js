/**
 * ============================================================================
 * MODULE 06: React Fiber Architecture & Priority-Based Scheduling
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL PROBLEM (THE STACK RECONCILER)
 * ----------------------------------------------------------------------------
 * In React 15 and earlier, React used the "Stack Reconciler".
 * It traversed the component tree recursively down the JavaScript call stack.
 *
 * THE FATAL FLAW OF RECURSIVE RECONCILIATION:
 * Once the Stack Reconciler started diffing, it COULD NOT BE STOPPED!
 * If your app had a tree with 5,000 components, React would lock the browser 
 * main thread for 80ms - 200ms.
 * During that time:
 * - If the user pressed a key in a search box: The keypress lagged.
 * - If a CSS animation was running: It dropped frames (stutter).
 * - The browser was completely unresponsive.
 *
 *
 * 2. THE FIBER REVOLUTION (REACT 16+)
 * ----------------------------------------------------------------------------
 * In React 16, the core engine was completely rewritten from scratch.
 * This new architecture is called FIBER.
 *
 * What is a Fiber?
 * A "Fiber" is a plain JavaScript object that represents a unit of work.
 * Instead of relying on the JavaScript call stack (which cannot be paused), 
 * React implemented its own virtual stack frame on the heap using a 
 * singly-linked tree of fibers!
 *
 * Each Fiber node has 3 critical pointer references:
 * 1. `child`: Points to its first direct child component.
 * 2. `sibling`: Points to the next sibling component.
 * 3. `return`: Points back to its parent component.
 *
 *
 * 3. SUPERPOWERS GRANTED BY FIBER
 * ----------------------------------------------------------------------------
 * 1. Incremental Rendering: Break rendering work into chunks of 5ms.
 * 2. Time-Slicing: Yield execution back to the browser so user clicks/animations 
 *    remain buttery smooth (60 FPS / 120 FPS).
 * 3. Priority Scheduling: Keystrokes (Urgent) jump ahead of background list rendering (Low).
 * 4. Double Buffering: React maintains TWO trees:
 *    - `current` tree: The fibers currently reflected on the physical screen.
 *    - `workInProgress` tree: The new fibers React computes in the background.
 *    When work is finished, React simply flips a single pointer: `root.current = workInProgress`!
 *
 *
 * 4. CONCURRENT REACT & HOOKS POWERED BY FIBER
 * ----------------------------------------------------------------------------
 * Fiber enabled all modern React 18 & 19 concurrent features:
 * - `<Suspense>`: Pausing a fiber while awaiting an async promise.
 * - `startTransition()`: Marking a state update as non-urgent.
 * - `useDeferredValue()`: Deferring expensive re-renders.
 * - Server Components (RSC): Streaming components over HTTP.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 06: React Fiber Architecture & Scheduling");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING FIBER NODES & THE LINKED LIST OF WORK
// ============================================================================
console.log("--- 1. FIBER NODE STRUCTURE (LINKED TREE OF WORK) ---");

class FiberNode {
  constructor(tag, type, props = {}) {
    this.tag = tag; // FunctionComponent, HostComponent, HostRoot
    this.type = type; // 'div', 'App', 'SearchBox'
    this.props = props;

    // Fiber tree linkage:
    this.child = null; // First child
    this.sibling = null; // Next sibling
    this.return = null; // Parent fiber
    this.alternate = null; // Pointer to workInProgress / current pair (Double Buffering)

    // Work tracking:
    this.memoizedState = null;
    this.flags = "NO_WORK"; // Placement, Update, Deletion
  }
}

// Building a simulated Fiber Tree:
// Root -> App -> [NavBar, ProductList, Footer]
const rootFiber = new FiberNode("HostRoot", "div#root");
const appFiber = new FiberNode("FunctionComponent", "App");
const navFiber = new FiberNode("HostComponent", "nav");
const listFiber = new FiberNode("HostComponent", "ul");
const footerFiber = new FiberNode("HostComponent", "footer");

// Wire parent-child-sibling relationships:
rootFiber.child = appFiber;
appFiber.return = rootFiber;

appFiber.child = navFiber;
navFiber.return = appFiber;

navFiber.sibling = listFiber;
listFiber.return = appFiber;

listFiber.sibling = footerFiber;
footerFiber.return = appFiber;

console.log("Fiber tree linked successfully:");
console.log(`Root [${rootFiber.type}] -> Child: [${rootFiber.child.type}]`);
console.log(` - App Child: [${appFiber.child.type}]`);
console.log(` - Sibling 1: [${navFiber.sibling.type}]`);
console.log(` - Sibling 2: [${listFiber.sibling.type}]`);
console.log(` - Footer Return Parent: [${footerFiber.return.type}]\n`);


// ============================================================================
// SECTION 2: SIMULATING FIBER TIME-SLICING & WORK LOOP
// ============================================================================
console.log("--- 2. SIMULATING FIBER WORK LOOP & TIME-SLICING ---");

/**
 * React's internal workLoopConcurrent checks how much time has passed in the 
 * current 5ms frame slice. If the deadline expires, it PAUSES and yields back!
 */

let nextUnitOfWork = rootFiber.child; // Start at App

function performUnitOfWork(fiber) {
  console.log(`[Fiber WorkLoop] Processing fiber: <${fiber.type}>`);

  // 1. If fiber has a child, that's the next unit of work:
  if (fiber.child) {
    return fiber.child;
  }

  // 2. If no child, search for sibling or navigate up return tree:
  let currentFiber = fiber;
  while (currentFiber) {
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }
    currentFiber = currentFiber.return;
  }
  return null;
}

// Execute the work loop:
console.log("Starting Fiber traversal (Non-recursive linked-list walk):");
while (nextUnitOfWork !== null && nextUnitOfWork !== rootFiber) {
  nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
}
console.log("Fiber traversal completed without stack overflow!\n");


// ============================================================================
// SECTION 3: DOUBLE BUFFERING IN FIBER
// ============================================================================
console.log("--- 3. DOUBLE BUFFERING MECHANISM (CURRENT VS WORK-IN-PROGRESS) ---");

const currentRoot = {
  tree: "CURRENT (Showing on User Screen: Count = 0)",
};

const workInProgressRoot = {
  tree: "WORK-IN-PROGRESS (Calculated in background memory: Count = 1)",
};

console.log("Before Commit Phase: Screen sees ->", currentRoot.tree);

// When background computation is finished:
function commitRoot() {
  // Flip pointers instantly (Atomic O(1) swap!)
  let activeDisplay = workInProgressRoot;
  console.log("After Commit Phase:  Screen instantly flipped to ->", activeDisplay.tree);
}

commitRoot();


// ============================================================================
// SECTION 4: FIBER ARCHITECTURE SUMMARY CHEAT SHEET
// ============================================================================
console.log("\n--- 4. STACK RECONCILER VS FIBER ARCHITECTURE ---");

const reconcilerComparison = [
  {
    Aspect: "Data Structure",
    StackReconciler_React15: "JavaScript Call Stack (Recursive function calls)",
    Fiber_React16Plus: "Linked List of Fiber objects on the V8 heap",
  },
  {
    Aspect: "Can It Be Interrupted?",
    StackReconciler_React15: "No (Runs synchronously to completion)",
    Fiber_React16Plus: "Yes (Can pause, resume, or abort work based on priority)",
  },
  {
    Aspect: "UI Responsiveness",
    StackReconciler_React15: "Prone to frame drops and lag on large component trees",
    Fiber_React16Plus: "Maintains 60/120 FPS by yielding to browser via time-slicing",
  },
  {
    Aspect: "Powers Modern Features",
    StackReconciler_React15: "None",
    Fiber_React16Plus: "Suspense, Transitions, Server Components, Streaming SSR",
  },
];

console.table(reconcilerComparison);

console.log("\nModule 06 loaded and executed successfully.");

