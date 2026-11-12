/**
 * ============================================================================
 * MODULE 10: Referential Equality and React.memo Performance Optimization
 * ============================================================================
 * 
 * 1. PRIMITIVE EQUALITY VS REFERENTIAL EQUALITY
 * ----------------------------------------------------------------------------
 * In JavaScript:
 * - Primitive Types (string, number, boolean, null, undefined, symbol):
 *   Compared by VALUE:
 *     "Haris" === "Haris" // true
 *     42 === 42           // true
 * 
 * - Reference Types (Object, Array, Function):
 *   Compared by MEMORY ADDRESS (Pointer):
 *     { id: 1 } === { id: 1 }           // false! (Two distinct objects on the heap)
 *     [1, 2] === [1, 2]                 // false!
 *     (() => {}) === (() => {})         // false! (Two distinct function instances)
 * 
 * 2. WHY REACT DEFAULT RE-RENDERING WORKS THIS WAY
 * ----------------------------------------------------------------------------
 * In React, when a Parent component re-renders:
 * By default, ALL of its Child components re-render recursively, regardless of 
 * whether their props changed!
 * 
 * This is usually fast enough, but for heavy children (charts, long tables, 3D viewers),
 * unnecessary re-renders degrade frame rates.
 * 
 * 3. WHAT IS `React.memo`?
 * ----------------------------------------------------------------------------
 * `React.memo` is a Higher-Order Component that wraps your component.
 * Before rendering, React performs a SHALLOW COMPARISON of incoming props against
 * previous props using `Object.is()`.
 * 
 * - If every prop's reference is identical: React BAILS OUT of rendering the child!
 * - If any prop reference changed: The child re-renders.
 * 
 * ⚠️ THE COMMON TRAP:
 * If the parent passes an inline object (`user={{ name: "Haris" }}`) or an inline
 * arrow function (`onClick={() => handleClick()}`), a BRAND NEW reference is 
 * created on every render.
 * Result: `React.memo`'s shallow check always sees a change, rendering the 
 * optimization completely useless!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 10: Referential Equality & React.memo Optimization");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: PROVING REFERENTIAL EQUALITY IN JAVASCRIPT
// ============================================================================
console.log("--- 1. PRIMITIVE VS REFERENCE COMPARISON ---");

const str1 = "Haris";
const str2 = "Haris";
console.log(`Primitives ("${str1}" === "${str2}"):`, str1 === str2); // true

const obj1 = { role: "Frontend" };
const obj2 = { role: "Frontend" };
console.log(`Objects ({ role: ... } === { role: ... }):`, obj1 === obj2); // false!

const obj3 = obj1; // Reference copy
console.log(`Shared Reference (obj1 === obj3):`, obj1 === obj3); // true!

// Functions are reference types:
const fn1 = () => "hello";
const fn2 = () => "hello";
console.log(`Function instances (fn1 === fn2):`, fn1 === fn2); // false!

// ============================================================================
// SECTION 2: SIMULATING React.memo SHALLOW PROP COMPARISON
// ============================================================================
console.log("\n--- 2. SIMULATING React.memo INTERNAL RE-RENDER ENGINE ---");

function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false; // Found a changed prop reference
    }
  }

  return true; // All prop references are identical!
}

class MockMemoizedChild {
  constructor(name) {
    this.name = name;
    this.prevProps = null;
    this.renderPasses = 0;
  }

  render(nextProps) {
    if (this.prevProps !== null && shallowEqual(this.prevProps, nextProps)) {
      console.log(`  [React.memo: ${this.name}] ⏩ Props unchanged (shallow equal). SKIPPED render!`);
      return;
    }

    this.prevProps = nextProps;
    this.renderPasses++;
    console.log(`  [React.memo: ${this.name}] 🎨 Props changed or first render. Rendered! (Total: ${this.renderPasses})`);
  }
}

const child = new MockMemoizedChild("ProductCard");

// Initial render
console.log("\nRender 1 (Mount):");
child.render({ title: "MacBook Pro", price: 1999 });

// Parent re-renders, but passes same primitive values
console.log("\nRender 2 (Parent re-rendered, passed same primitive props):");
child.render({ title: "MacBook Pro", price: 1999 });

// Parent re-renders, but passes an INLINE OBJECT (Breaks memoization!)
console.log("\nRender 3 (Parent passed inline object configuration - Reference changes!):");
child.render({ title: "MacBook Pro", price: 1999, theme: { mode: "dark" } });

console.log("\nRender 4 (Parent passed newly allocated inline object with identical contents):");
child.render({ title: "MacBook Pro", price: 1999, theme: { mode: "dark" } }); // theme is a new pointer!

// ============================================================================
// SECTION 3: CUSTOM COMPARISON FUNCTION IN React.memo
// ============================================================================
console.log("\n--- 3. CUSTOM COMPARISON FUNCTION (React.memo second argument) ---");

// Sometimes you want to compare only specific IDs rather than all references:
function customArePropsEqual(prevProps, nextProps) {
  // Only re-render if product ID or price actually changed
  return prevProps.product.id === nextProps.product.id && 
         prevProps.product.price === nextProps.product.price;
}

const prevPropsCustom = { product: { id: 101, price: 50 }, onAction: () => {} };
const nextPropsCustom = { product: { id: 101, price: 50 }, onAction: () => {} }; // New function reference!

console.log("Standard Shallow Equal with new onAction callback:", shallowEqual(prevPropsCustom, nextPropsCustom)); // false!
console.log("Custom Comparator (ignoring inline callbacks):", customArePropsEqual(prevPropsCustom, nextPropsCustom)); // true!

console.log("\n✅ Module 10 Execution Verified: Referential equality and React.memo internals passed.");
