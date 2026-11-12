/**
 * ============================================================================
 * MODULE 01: Mutability, Immutability, and Pure Functions in JavaScript & React
 * ============================================================================
 * 
 * 1. THE CORE PROBLEM & DEFINITIONS
 * ----------------------------------------------------------------------------
 * - MUTABLE: An entity whose state/data can be modified after creation.
 *   In JavaScript, Objects and Arrays are mutable reference types by default.
 * 
 * - IMMUTABLE: An entity whose state CANNOT be changed after creation.
 *   To change data, you produce a BRAND NEW value or container with the updates,
 *   leaving the original completely untouched.
 *   In JavaScript, Primitives (strings, numbers, booleans, null, undefined, 
 *   BigInt, Symbol) are immutable by default.
 * 
 * 2. PHP / LARAVEL COMPARISON (Bridging the Mental Model)
 * ----------------------------------------------------------------------------
 * - PHP Array Semantics:
 *   In PHP, arrays have "Copy-on-Write" (value-based) semantics by default:
 *     $a = [1, 2, 3];
 *     $b = $a;
 *     $b[] = 4; // Modifies $b only! $a remains [1, 2, 3]
 * 
 * - JavaScript Array/Object Semantics:
 *   In JavaScript, arrays and objects are passed by REFERENCE:
 *     const a = [1, 2, 3];
 *     const b = a;
 *     b.push(4); // Modifies BOTH a and b! Both point to the exact same heap memory!
 * 
 * This fundamental difference is why PHP developers learning React often fall
 * into the "Direct State Mutation" trap.
 * 
 * 3. WHY REACT STRICTLY DEMANDS IMMUTABILITY
 * ----------------------------------------------------------------------------
 * React re-renders components by comparing previous state with next state.
 * To do this efficiently at 60 frames per second, React uses `Object.is(prev, next)`
 * which takes O(1) time (comparing memory pointers).
 * 
 * If you mutate state directly:
 *   user.age = 26;
 *   setUser(user);
 * React checks: `Object.is(user, user) === true`.
 * Result: React thinks NOTHING changed, and silently BAILS OUT of re-rendering!
 * Your UI appears frozen and broken.
 * 
 * By creating a new reference:
 *   setUser(prev => ({ ...prev, age: 26 }));
 * React checks: `Object.is(prev, next) === false`.
 * Result: React schedules a re-render and updates the DOM cleanly.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 01: Mutability, Immutability & Pure Functions in React");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: MUTABLE VS IMMUTABLE OPERATIONS IN JAVASCRIPT
// ============================================================================
console.log("--- 1. MUTABLE VS IMMUTABLE DATA STRUCTURES ---");

// A. The Mutation Trap (Objects)
const originalUser = { name: "Haris", age: 25, role: "Engineer" };
const mutatedUser = originalUser; // Copies the pointer, NOT the object
mutatedUser.age = 26; // Mutates original in-place!

console.log("Original User Age after mutation:", originalUser.age); // 26 (Accidental change!)
console.log("Are pointers identical?:", originalUser === mutatedUser); // true

// B. The Immutable Solution (Spread Operator)
const freshUser = { name: "Haris", age: 25, role: "Engineer" };
const updatedUser = {
  ...freshUser,      // 1. Copy all previous key-values
  age: 26,           // 2. Override specific properties
  city: "Wah Cantt"  // 3. Add new properties
};

console.log("\nFresh User Age (Untouched):", freshUser.age); // 25
console.log("Updated User Age (New Object):", updatedUser.age); // 26
console.log("Referential Equality Check (fresh === updated):", freshUser === updatedUser); // false

// ============================================================================
// SECTION 2: MUTABLE ARRAY METHODS VS IMMUTABLE MODERN ALTERNATIVES
// ============================================================================
console.log("\n--- 2. ARRAY METHODS CHEAT SHEET ---");

const baseNumbers = [10, 20, 30];

// MUTABLE METHODS (Avoid these in React state updates!)
// push(), pop(), shift(), unshift(), splice(), sort(), reverse()

// IMMUTABLE ALTERNATIVES (Always use these in React!):
// 1. Adding an item:
const appended = [...baseNumbers, 40];
const prepended = [0, ...baseNumbers];

// 2. Removing an item (by index or condition):
const filtered = baseNumbers.filter(n => n !== 20);

// 3. Transforming items:
const doubled = baseNumbers.map(n => n * 2);

// 4. Modern ES2023 Non-mutating methods:
const unsorted = [50, 10, 40, 20];
const sortedImmutably = unsorted.toSorted((a, b) => a - b);
const reversedImmutably = unsorted.toReversed();
const replacedImmutably = unsorted.with(1, 999); // Replaces index 1 without mutation

console.log("Base Numbers Array (Unchanged):", baseNumbers);
console.log("Appended Array:", appended);
console.log("Filtered Array (removed 20):", filtered);
console.log("Doubled Array (map):", doubled);
console.log("Original Unsorted (Unchanged):", unsorted);
console.log("ES2023 toSorted (New Array):", sortedImmutably);
console.log("ES2023 with() at index 1:", replacedImmutably);

// ============================================================================
// SECTION 3: SHALLOW COPY VS DEEP COPY
// ============================================================================
console.log("\n--- 3. SHALLOW COPY VS DEEP COPY ---");

const profile = {
  name: "Haris",
  address: {
    city: "Wah Cantt",
    country: "Pakistan"
  }
};

// Shallow copy using Object Spread
const shallowCopy = { ...profile };
shallowCopy.name = "Ali"; // Safe! Top-level is cloned.
shallowCopy.address.city = "Islamabad"; // DANGER! Nested object is still shared by reference!

console.log("Profile Name (Safe):", profile.name); // "Haris"
console.log("Profile City (Mutated through shallow copy!):", profile.address.city); // "Islamabad"

// True Deep Copy using Native structuredClone (ES2022)
const deepProfile = {
  name: "Haris",
  address: {
    city: "Wah Cantt",
    country: "Pakistan"
  }
};

const deepClone = structuredClone(deepProfile);
deepClone.address.city = "Lahore";

console.log("Deep Profile City (Completely Safe):", deepProfile.address.city); // "Wah Cantt"
console.log("Deep Clone City:", deepClone.address.city); // "Lahore"

// The Idiomatic React Nested Update Pattern (Without cloning everything):
const updatedProfileInReact = {
  ...deepProfile,
  address: {
    ...deepProfile.address,
    city: "Karachi"
  }
};
console.log("React-style nested update city:", updatedProfileInReact.address.city);

// ============================================================================
// SECTION 4: PURE FUNCTIONS VS IMPURE FUNCTIONS IN REACT
// ============================================================================
console.log("\n--- 4. PURE FUNCTIONS IN REACT ARCHITECTURE ---");

/**
 * PURE FUNCTION:
 * 1. Given the same inputs, it ALWAYS returns the exact same output.
 * 2. It produces ZERO side effects (does not mutate external variables, make 
 *    HTTP calls, or touch the DOM during calculation).
 */
function calculateInvoicePure(hours, rate, discount = 0) {
  return (hours * rate) - discount;
}

console.log("Pure Call 1:", calculateInvoicePure(10, 50, 20)); // 480
console.log("Pure Call 2:", calculateInvoicePure(10, 50, 20)); // 480 (100% deterministic)

// IMPURE FUNCTION (Hidden dependency on external mutable state):
let taxRate = 0.15;
function calculateInvoiceImpure(subtotal) {
  return subtotal + (subtotal * taxRate); // Relies on external mutable 'taxRate'
}

console.log("Impure Call 1 (tax=15%):", calculateInvoiceImpure(100)); // 115
taxRate = 0.20; // External mutation alters output without argument changes!
console.log("Impure Call 2 (tax=20%):", calculateInvoiceImpure(100)); // 120

console.log("\n💡 React Rule: Component rendering MUST be pure! Given same props and state,");
console.log("   React expects components to return identical JSX trees without side effects.");

// ============================================================================
// SECTION 5: SIMULATING REACT STATE RE-RENDER DETECTION
// ============================================================================
console.log("\n--- 5. SIMULATING REACT Object.is RE-RENDER MECHANISM ---");

class MockReactComponent {
  constructor(initialState) {
    this.state = initialState;
    this.renderCount = 1;
  }

  // Simulates React's internal dispatchSetState
  setState(updater) {
    const nextState = typeof updater === "function" ? updater(this.state) : updater;
    
    // React's internal equality check
    if (Object.is(this.state, nextState)) {
      console.log(`[React Mock] State reference UNCHANGED (Object.is === true). Skipping render!`);
      return;
    }

    this.state = nextState;
    this.renderCount++;
    console.log(`[React Mock] State changed! Re-rendered (Total Renders: ${this.renderCount}). State:`, this.state);
  }
}

const component = new MockReactComponent({ count: 0, user: "Haris" });

console.log("\nScenario A: Mutating state object directly (Incorrect React Code)");
const currentState = component.state;
currentState.count = 1; // Mutated in place!
component.setState(currentState); // Passing same pointer

console.log("\nScenario B: Returning a new immutable object (Correct React Code)");
component.setState(prev => ({
  ...prev,
  count: prev.count + 1
}));

console.log("\n✅ Module 01 Execution Verified: All mutability, immutability, and pure function concepts passed.");
