/**
 * ============================================================================
 * MODULE 40: Senior JavaScript Interview Puzzles, Traps & Architecture Capstone
 * ============================================================================
 *
 * 1. PURPOSE & CAPSTONE OVERVIEW
 * ----------------------------------------------------------------------------
 * This capstone module brings together the subtlest, trickiest, and most 
 * frequently asked interview puzzles and runtime edge cases in the JavaScript 
 * ecosystem. 
 *
 * Senior engineers are distinguished not just by knowing how JavaScript works 
 * when everything goes right, but by understanding the deep engine mechanics, 
 * language specifications (ECMA-262), and IEEE-754 standards that cause subtle 
 * production bugs when things go wrong.
 *
 *
 * 2. TOPICS & PUZZLES COVERED
 * ----------------------------------------------------------------------------
 * 1. The Notorious Type Coercion Puzzles (`[] == ![]`, `NaN === NaN`, `null >= 0`)
 * 2. Event Loop Execution Ordering Challenge (Stack vs NextTick vs Microtask vs Macrotask)
 * 3. IEEE-754 Floating-Point Math (`0.1 + 0.2 !== 0.3` & Number.EPSILON)
 * 4. Sparse Arrays & Empty Slots vs Undefined
 * 5. Shallow Freeze Traps & Immutable State
 * 6. Function Parameter Defaults with `null` vs `undefined`
 * 7. The Senior Fullstack Architecture Checklist (React, Next.js & Node.js)
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 40: Senior JS Interview Puzzles & Architecture Capstone");
console.log("==================================================================\n");

// ============================================================================
// PUZZLE 1: TYPE COERCION & LOOSE EQUALITY SURPRISES
// ============================================================================
console.log("--- 1. TYPE COERCION & EQUALITY PUZZLES ---");

// Puzzle 1A: Why is `[] == ![]` TRUE?!
// Step 1: `![]` converts empty array to boolean. Objects are truthy, so `![]` is `false`.
// Step 2: Expression becomes `[] == false`.
// Step 3: Loose equality converts boolean to number: `false` -> `0`.
// Step 4: Expression becomes `[] == 0`.
// Step 5: Array is coerced to primitive via `[].toString()` -> `""`.
// Step 6: Expression becomes `"" == 0`.
// Step 7: String converts to number: `Number("")` -> `0`.
// Step 8: `0 == 0` -> true!
console.log("Why is `[] == ![]` true?", [] == ![]); // true

// Puzzle 1B: NaN equality
// According to IEEE-754, NaN represents an invalid number and does NOT equal itself.
console.log("NaN === NaN:", NaN === NaN); // false
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN)); // true (SameValue algorithm!)

// Puzzle 1C: Null and Zero comparison weirdness
console.log("null > 0 :", null > 0);   // false (null coerced to 0)
console.log("null == 0:", null == 0);  // false (null only equals undefined with ==)
console.log("null >= 0:", null >= 0);  // true! (relational operator coerces null to 0, 0 >= 0 is true)


// ============================================================================
// PUZZLE 2: IEEE-754 FLOATING-POINT PRECISION
// ============================================================================
console.log("\n--- 2. FLOATING-POINT PRECISION (0.1 + 0.2) ---");

// In binary floating-point representation, fractions like 0.1 and 0.2 cannot be 
// represented with infinite precision, leading to small rounding discrepancies:
const sum = 0.1 + 0.2;
console.log("0.1 + 0.2 =", sum); // 0.30000000000000004
console.log("0.1 + 0.2 === 0.3:", sum === 0.3); // false

// ✅ Senior Solution: Use Number.EPSILON for safe floating-point comparison
function areNumbersApproximatelyEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log("Approximately equal using Number.EPSILON:", areNumbersApproximatelyEqual(sum, 0.3)); // true


// ============================================================================
// PUZZLE 3: SPARSE ARRAYS VS EMPTY SLOTS
// ============================================================================
console.log("\n--- 3. SPARSE ARRAYS & EMPTY SLOTS ---");

// Array(3) creates an array with length 3, but NO indices!
const sparseArray = new Array(3);
console.log("Sparse Array Length:", sparseArray.length);
console.log("Index 0 in sparseArray?", 0 in sparseArray); // false!

// Array iteration methods (map, filter, forEach) SKIP empty slots!
let mapIterations = 0;
sparseArray.map(() => mapIterations++);
console.log("Iterations performed on empty slots:", mapIterations); // 0!

// ✅ Modern Fix: Use Array.from() or Array.of() or spread to initialize with real undefined:
const denseArray = Array.from({ length: 3 });
console.log("Index 0 in denseArray?", 0 in denseArray); // true!


// ============================================================================
// PUZZLE 4: OBJECT.FREEZE IS SHALLOW
// ============================================================================
console.log("\n--- 4. OBJECT.FREEZE SHALLOWNESS TRAP ---");

const appConfig = Object.freeze({
  appName: "SaaS App",
  database: {
    host: "localhost", // Nested object is NOT frozen!
  },
});

// Top-level mutation fails silently (or throws in strict mode)
appConfig.appName = "Hacked App";

// Nested mutation SUCCEEDS because freeze is shallow!
appConfig.database.host = "production-db.internal";
console.log("Top-level protected:", appConfig.appName); // "SaaS App"
console.log("Nested object mutated:", appConfig.database.host); // "production-db.internal"


// ============================================================================
// PUZZLE 5: EVENT LOOP EXECUTION ORDER QUIZ
// ============================================================================
console.log("\n--- 5. EVENT LOOP EXECUTION ORDER PUZZLE ---");

console.log("[1] Synchronous Script Start");

setTimeout(() => {
  console.log("[5] Macrotask: setTimeout(0)");
}, 0);

Promise.resolve().then(() => {
  console.log("[3] Microtask: Promise.then");
});

queueMicrotask(() => {
  console.log("[4] Microtask: queueMicrotask");
});

process.nextTick(() => {
  console.log("[2] Node.js Microtask: process.nextTick (Runs before other microtasks!)");
});

console.log("[1.1] Synchronous Script End\n");


// ============================================================================
// SECTION 6: SENIOR FULLSTACK ARCHITECT CHECKLIST
// ============================================================================
console.log("--- 6. SENIOR FULLSTACK ARCHITECT CHECKLIST ---");

const seniorChecklist = [
  {
    Domain: "State Immutability",
    Standard: "Never mutate React state or Redux stores directly. Use spread or structuredClone.",
  },
  {
    Domain: "Async Concurrency",
    Standard: "Avoid sequential await waterfalls. Use Promise.all() for independent network calls.",
  },
  {
    Domain: "Memory Cleanup",
    Standard: "Always clean up subscriptions and intervals in useEffect / componentWillUnmount.",
  },
  {
    Domain: "Security Defense",
    Standard: "Sanitize URLs, reject __proto__ in JSON merges, and use timingSafeEqual for secrets.",
  },
  {
    Domain: "Real-Time Streaming",
    Standard: "Prefer Server-Sent Events (SSE) for AI token streaming over heavy WebSocket connections.",
  },
];

console.table(seniorChecklist);

console.log("\n==================================================================");
console.log("  CAPSTONE COMPLETE: 40 MODULES TO JAVASCRIPT MASTERY!");
console.log("==================================================================");

