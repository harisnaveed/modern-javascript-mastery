/**
 * ============================================================================
 * MODULE 03: Virtual DOM & Declarative UI
 * ============================================================================
 *
 * 1. THE "WHY" & CORE DEFINITION
 * ----------------------------------------------------------------------------
 * In large vanilla JavaScript or jQuery applications, managing DOM updates 
 * manually becomes an unmaintainable nightmare:
 * - Did you remember to update the total price when an item was removed?
 * - Did you remove the loading spinner DOM element when the fetch failed?
 * - Did you forget to detach event listeners, causing memory leaks?
 *
 * This imperative style ("find element X, change property Y, delete element Z") 
 * leads to synchronization bugs where the UI state gets out of sync with actual data.
 *
 * THE REVOLUTIONARY REACT SOLUTION: THE VIRTUAL DOM
 * React introduced the concept of Declarative UI:
 *   UI = f(state)
 *
 * You do NOT touch the DOM. You simply write a function that describes what the 
 * UI SHOULD look like for a given state.
 *
 * What is the Virtual DOM?
 * The Virtual DOM (VDOM) is a lightweight, in-memory representation of the UI 
 * made of plain JavaScript objects.
 * When state changes, React creates a new Virtual DOM tree, compares it with 
 * the previous Virtual DOM tree (diffing), and calculates the minimal set of 
 * changes to apply to the real browser DOM.
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In Laravel:
 *   When you return a Blade view `return view('shop.product', ['price' => 120]);`, 
 *   Laravel renders the entire HTML template from top to bottom. It does not 
 *   diff the previous response against the new response.
 *
 * - In React:
 *   Instead of replacing the whole page, React creates an in-memory JS tree 
 *   resembling nested array/object structures, identifies that ONLY the 
 *   price text changed, and mutates only that single text node!
 *
 *
 * 3. BUSTING THE FAMOUS MYTH: "IS VIRTUAL DOM FASTER THAN REAL DOM?"
 * ----------------------------------------------------------------------------
 * ❌ MYTH: "Virtual DOM is faster than the real DOM."
 * ✅ TRUTH: No, Virtual DOM is NOT inherently faster than hand-optimized direct DOM operations.
 *
 * Directly doing `node.textContent = '120'` is theoretically faster than:
 * 1. Allocating a new VDOM JavaScript object tree.
 * 2. Traversing both trees recursively (Diffing).
 * 3. Generating a patch list.
 * 4. Applying the patch to the DOM.
 *
 * THEN WHY DOES REACT USE IT?
 * 1. Declarative Developer Experience: You focus entirely on state logic; React 
 *    guarantees the UI matches your state.
 * 2. Batching: Multiple `setState()` calls are batched into a single DOM update.
 * 3. Cross-Platform Abstraction: The same VDOM logic can render to Browser DOM (ReactDOM), 
 *    Mobile Apps (React Native), or Terminal UIs (Ink).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 03: Virtual DOM & Declarative UI");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: ANATOMY OF A VIRTUAL DOM TREE (JS OBJECTS)
// ============================================================================
console.log("--- 1. VIRTUAL DOM TREE OBJECT DESCRIPTOR ---");

function createVNode(type, props = {}, children = []) {
  return {
    type,
    props: {
      ...props,
      children: children.map((c) => (typeof c === "string" ? { type: "TEXT", text: c } : c)),
    },
  };
}

// Initial UI representation when price = 100:
const prevVTree = createVNode("div", { id: "product-card" }, [
  createVNode("h1", {}, ["My Shop"]),
  createVNode("p", { className: "price" }, ["Price: $100"]),
  createVNode("button", { id: "buy-btn" }, ["Add to Cart"]),
]);

console.log("Virtual DOM Object Structure (In-Memory Tree):");
console.log(JSON.stringify(prevVTree, null, 2));


// ============================================================================
// SECTION 2: SIMULATING THE VIRTUAL DOM DIFFING ALGORITHM
// ============================================================================
console.log("\n--- 2. VIRTUAL DOM DIFFING (PREV VS NEXT) ---");

// User clicks "Update Price" -> price becomes 120:
const nextVTree = createVNode("div", { id: "product-card" }, [
  createVNode("h1", {}, ["My Shop"]),
  createVNode("p", { className: "price" }, ["Price: $120"]), // <- ONLY THIS CHANGED!
  createVNode("button", { id: "buy-btn" }, ["Add to Cart"]),
]);

function diffVNodes(prevNode, nextNode, path = "root") {
  const patches = [];

  // Case 1: Node type changed entirely (e.g. <div> became <section>)
  if (prevNode.type !== nextNode.type) {
    patches.push({ type: "REPLACE_NODE", path, newType: nextNode.type });
    return patches;
  }

  // Case 2: Text node updated
  if (prevNode.type === "TEXT" && nextNode.type === "TEXT") {
    if (prevNode.text !== nextNode.text) {
      patches.push({
        type: "UPDATE_TEXT",
        path,
        oldText: prevNode.text,
        newText: nextNode.text,
      });
    }
    return patches;
  }

  // Case 3: Compare children recursively
  const prevChildren = prevNode.props.children || [];
  const nextChildren = nextNode.props.children || [];
  const maxLen = Math.max(prevChildren.length, nextChildren.length);

  for (let i = 0; i < maxLen; i++) {
    const childPath = `${path} > ${nextNode.type}[${i}]`;
    const childPatches = diffVNodes(prevChildren[i], nextChildren[i], childPath);
    patches.push(...childPatches);
  }

  return patches;
}

const calculatedPatches = diffVNodes(prevVTree, nextVTree);
console.log("Calculated Surgical Patches:");
console.log(calculatedPatches);
console.log(`\nNotice: Only 1 DOM text mutation was needed out of the entire tree!`);


// ============================================================================
// SECTION 3: VIRTUAL DOM VS REAL DOM COMPARISON
// ============================================================================
console.log("\n--- 3. VIRTUAL DOM VS REAL DOM COMPARISON ---");

const domComparison = [
  {
    Feature: "What is it?",
    RealDOM: "The actual browser C++ document tree (window.document).",
    VirtualDOM: "Lightweight in-memory JavaScript objects describing UI.",
  },
  {
    Feature: "Creation Cost",
    RealDOM: "High (allocates browser memory, styles, layout geometry).",
    VirtualDOM: "Low (plain JavaScript object allocation in V8 heap).",
  },
  {
    Feature: "Mutation Cost",
    RealDOM: "Triggers style recalculation, reflow, and GPU repaints.",
    VirtualDOM: "Fast in-memory comparison (diffing) before batching updates.",
  },
  {
    Feature: "Programming Model",
    RealDOM: "Imperative (manual find & replace).",
    VirtualDOM: "Declarative (UI = f(state)).",
  },
];

console.table(domComparison);

console.log("\nModule 03 loaded and executed successfully.");

