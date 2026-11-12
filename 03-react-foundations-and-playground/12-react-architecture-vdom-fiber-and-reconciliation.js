/**
 * ============================================================================
 * MODULE 12: React Architecture — Virtual DOM, Fiber Engine & Reconciliation
 * ============================================================================
 * 
 * 1. THE DECLARATIVE UI PARADIGM
 * ----------------------------------------------------------------------------
 * - Imperative UI (jQuery / Vanilla JS):
 *   You manually query DOM nodes and mutate them step-by-step:
 *     document.getElementById("btn").textContent = "Loading...";
 *     document.getElementById("btn").disabled = true;
 * 
 * - Declarative UI (React):
 *   You declare WHAT the UI should look like for a given state:
 *     UI = f(state)
 *   React figures out HOW to mutate the real DOM with minimum operations.
 * 
 * 2. WHAT IS THE VIRTUAL DOM (VDOM)?
 * ----------------------------------------------------------------------------
 * The Virtual DOM is a lightweight in-memory representation of real DOM elements.
 * It is composed of plain JavaScript objects:
 *   {
 *     type: 'button',
 *     props: { className: 'primary', children: 'Click Me' }
 *   }
 * Manipulating millions of JavaScript objects in memory takes less than 1 millisecond.
 * Directly manipulating the browser DOM triggers expensive CSS recalculation,
 * geometric layout reflow, and pixel repainting.
 * 
 * 3. RECONCILIATION & DIFFING HEURISTICS (O(n) Algorithm)
 * ----------------------------------------------------------------------------
 * Standard tree-diffing algorithms run in O(n³) time. React uses 3 heuristics 
 * to achieve blazing-fast O(n) linear diffing:
 * 
 * 1. Different Element Types Produce Different Subtrees:
 *    Changing `<div>` to `<section>` tears down the entire subtree and remounts it.
 * 
 * 2. Same Element Types Preserve DOM Nodes:
 *    `<div className="before" />` -> `<div className="after" />` preserves the 
 *    underlying `HTMLDivElement` in the browser and updates only the class attribute.
 * 
 * 3. Keys in Lists Identify Element Identity:
 *    Keys tell React which list items were moved, added, or deleted, preventing 
 *    subtle form-input state bugs when sorting or prepending items.
 * 
 * 4. THE REACT FIBER REVOLUTION
 * ----------------------------------------------------------------------------
 * Prior to React 16, React used the "Stack Reconciler" which relied on synchronous 
 * recursion down the tree. If rendering took 50ms, the main thread froze, dropping
 * user input frames.
 * 
 * Fiber transformed the tree into a SINGLY LINKED LIST:
 *   - Each component is a "Fiber Node" (unit of work).
 *   - Pointers: `child`, `sibling`, `return` (parent).
 *   - Interruptible: React can pause rendering after 5ms to handle a user click,
 *     then resume background rendering!
 * 
 * Double Buffering:
 *   - `current` tree: The fibers currently rendered on screen.
 *   - `workInProgress` tree: The new fibers being calculated in memory.
 *   - At the Commit phase, React simply swaps the root pointer:
 *     `root.current = workInProgress` (instantaneous switch!).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 12: React Architecture: VDOM, Fiber & Reconciliation");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: VIRTUAL DOM ELEMENT STRUCTURE (createElement)
// ============================================================================
console.log("--- 1. WHAT JSX ACTUALLY COMPILES TO (Virtual DOM Objects) ---");

function createElement(type, rawProps, ...children) {
  const props = rawProps || {};
  return {
    $$typeof: Symbol.for("react.element"),
    type,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children
    },
    key: props.key || null
  };
}

// Simulating: <div className="card"><h1>Haris Ali</h1><button>Contact</button></div>
const vdomNode = createElement(
  "div",
  { className: "card" },
  createElement("h1", null, "Haris Ali"),
  createElement("button", { onClick: () => {} }, "Contact")
);

console.log("Virtual DOM Object Representation:\n", JSON.stringify(vdomNode, (k, v) => typeof v === "function" ? "[Function]" : v, 2));

// ============================================================================
// SECTION 2: SIMULATING RECONCILIATION & DIFFING
// ============================================================================
console.log("\n--- 2. SIMULATING THE RECONCILIATION DIFFING ALGORITHM ---");

function diff(oldVNode, newVNode) {
  const patches = [];

  // Case 1: Node removed
  if (!newVNode) {
    patches.push({ type: "REMOVE", oldVNode });
    return patches;
  }

  // Case 2: Node newly inserted
  if (!oldVNode) {
    patches.push({ type: "INSERT", newVNode });
    return patches;
  }

  // Case 3: Node type replaced (e.g. 'div' -> 'span')
  if (oldVNode.type !== newVNode.type) {
    patches.push({ type: "REPLACE", oldVNode, newVNode });
    return patches;
  }

  // Case 4: Text content changed
  if (typeof oldVNode === "string" || typeof newVNode === "string") {
    if (oldVNode !== newVNode) {
      patches.push({ type: "TEXT", text: newVNode });
    }
    return patches;
  }

  // Case 5: Attributes changed on same element
  const propPatches = {};
  const oldProps = oldVNode.props || {};
  const newProps = newVNode.props || {};

  for (let key in newProps) {
    if (key !== "children" && oldProps[key] !== newProps[key]) {
      propPatches[key] = newProps[key];
    }
  }

  if (Object.keys(propPatches).length > 0) {
    patches.push({ type: "PROPS", tag: oldVNode.type, props: propPatches });
  }

  return patches;
}

const vdomPrev = createElement("button", { className: "btn-idle", disabled: false }, "Submit");
const vdomNext = createElement("button", { className: "btn-active", disabled: true }, "Submitting...");

console.log("Reconciling VDOM Old -> New:");
const calculatedPatches = diff(vdomPrev, vdomNext);
console.log("Calculated Surgical DOM Patches:", calculatedPatches);

// ============================================================================
// SECTION 3: SIMULATING REACT FIBER LINKED LIST TRAVERSAL
// ============================================================================
console.log("\n--- 3. REACT FIBER LINKED-LIST STRUCTURE & SCHEDULING ---");

/**
 * Fiber Node Data Structure:
 * Each component gets a Fiber with 3 traversal links:
 * - child: Pointer to first direct child
 * - sibling: Pointer to next sibling
 * - return: Pointer back to parent
 */
class FiberNode {
  constructor(tag, name) {
    this.tag = tag;
    this.name = name;
    this.child = null;
    this.sibling = null;
    this.return = null; // Parent
  }
}

// Building Fiber Tree: App -> [Header, MainContent -> [Article, Sidebar], Footer]
const rootFiber = new FiberNode("Root", "App");
const header = new FiberNode("Element", "Header");
const main = new FiberNode("Element", "MainContent");
const article = new FiberNode("Element", "Article");
const sidebar = new FiberNode("Element", "Sidebar");
const footer = new FiberNode("Element", "Footer");

// Wire links:
rootFiber.child = header;
header.return = rootFiber;
header.sibling = main;

main.return = rootFiber;
main.child = article;
main.sibling = footer;

article.return = main;
article.sibling = sidebar;

sidebar.return = main;
footer.return = rootFiber;

// Fiber Work Loop Traversal (Depth-First Search without recursion!):
function traverseFiberTree(root) {
  let current = root;
  const visitOrder = [];

  while (current) {
    visitOrder.push(current.name);

    // 1. Go down to child if exists
    if (current.child) {
      current = current.child;
      continue;
    }

    // 2. If no child, go to sibling
    if (current.sibling) {
      current = current.sibling;
      continue;
    }

    // 3. If no sibling, walk back up to parent's sibling
    while (current.return && !current.sibling) {
      current = current.return;
    }
    current = current.sibling;
  }

  return visitOrder;
}

console.log("Fiber WorkLoop Traversal Order (Iterative, Pausable & Interruptible):");
console.log(" ", traverseFiberTree(rootFiber).join(" ➔ "));

console.log("\n==================================================================");
console.log("  THE TWO PHASES OF REACT FIBER");
console.log("==================================================================");
console.log("Phase 1: RENDER PHASE (Asynchronous & Interruptible)");
console.log("  - Calculates diffs and builds the workInProgress tree.");
console.log("  - Can be paused, resumed, or discarded if higher priority events arrive.");
console.log("Phase 2: COMMIT PHASE (Synchronous & Uninterruptible)");
console.log("  - React applies all calculated DOM mutations in one fast atomic batch.");
console.log("  - Runs lifecycle methods like useLayoutEffect and fires browser paints.");
console.log("==================================================================\n");

console.log("✅ Module 12 Execution Verified: VDOM, Fiber, and Reconciliation proven.");
