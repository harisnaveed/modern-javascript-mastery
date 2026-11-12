/**
 * ============================================================================
 * MODULE 06: The Event Loop, Call Stack, Microtasks, and Macrotasks
 * ============================================================================
 * 
 * 1. THE CORE ARCHITECTURAL MODEL (Prompt 2 Clarity)
 * ----------------------------------------------------------------------------
 * JavaScript is single-threaded. It has ONE Call Stack and executes ONE statement 
 * at a time.
 * 
 * How does it handle heavy network requests, database lookups, or file uploads 
 * without freezing the entire browser or server?
 * 
 * Answer: NON-BLOCKING I/O & THE EVENT LOOP!
 * 
 * 2. THE RESTAURANT WAITER ANALOGY
 * ----------------------------------------------------------------------------
 * - Synchronous / Blocking Model (PHP Traditional):
 *   A waiter takes Order 1 to the kitchen, stands in front of the oven for 20 minutes
 *   doing nothing until the pizza is baked, serves it, and ONLY then talks to Customer 2.
 *   Result: Customer 2 waits 20 minutes just to get water.
 * 
 * - Asynchronous Event Loop Model (JavaScript / Node.js):
 *   The waiter takes Order 1, slips the ticket to the chef (Web API / OS Kernel),
 *   and IMMEDIATELY turns around to take Order 2, 3, and 4!
 *   When the kitchen bell rings (Promise fulfilled / Timer expired), the waiter serves
 *   the ready food between taking new orders.
 * 
 * 3. THE 4 PILLARS OF JAVASCRIPT RUNTIME
 * ----------------------------------------------------------------------------
 * 1. Call Stack: LIFO (Last In, First Out). Executes currently active functions.
 * 2. Web APIs (Browser) / C++ APIs (Node.js): Background threads handling timers,
 *    HTTP requests, and file streams outside the main JS thread.
 * 3. Microtask Queue: Holds Promise reactions (`.then`, `.catch`, `.finally`), 
 *    `await` continuations, and `queueMicrotask()`. High priority!
 * 4. Task Queue (Macrotasks): Holds `setTimeout`, `setInterval`, I/O, UI events.
 * 
 * 4. THE GOLDEN EXECUTION PRIORITY RULE:
 * ----------------------------------------------------------------------------
 *   [Synchronous Code] ➔ [DRAIN ALL Microtasks] ➔ [ONE Task from Task Queue] ➔ [Repeat]
 * 
 * Microtasks ALWAYS take precedence over timers!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 06: Event Loop, Microtasks & Asynchronous Runtime");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: THE CLASSIC TIMING PUZZLE DECONSTRUCTED
// ============================================================================
console.log("--- 1. STEP-BY-STEP EXECUTION TRACE ---");
console.log("Code being executed:");
console.log(`
  console.log("1: Synchronous Start");
  setTimeout(() => console.log("2: Macrotask (setTimeout 0ms)"), 0);
  Promise.resolve().then(() => console.log("3: Microtask (Promise .then)"));
  console.log("4: Synchronous End");
`);

console.log("--- LIVE EXECUTION OUTPUT ---");

console.log("1: Synchronous Start");

// Scheduled to Task Queue (Macrotask)
setTimeout(() => {
  console.log("2: Macrotask (setTimeout 0ms) -> Ran AFTER microtasks were drained!");
}, 0);

// Scheduled to Microtask Queue (Microtask)
Promise.resolve().then(() => {
  console.log("3: Microtask (Promise .then) -> Ran IMMEDIATELY after sync code!");
});

console.log("4: Synchronous End");

// ============================================================================
// SECTION 2: MULTI-LEVEL QUEUE SIMULATOR (Microtask Starvation Concept)
// ============================================================================
console.log("\n--- 2. DETAILED EVENT LOOP TIMELINE ---");
console.log(`
  TIMELINE BREAKDOWN:
  -------------------------------------------------------------------
  Time   | Queue               | Action
  -------------------------------------------------------------------
  T0     | Call Stack          | Executes log("1: Synchronous Start")
  T0+1   | Web APIs            | Registers setTimeout timer (0ms)
  T0+2   | Microtask Queue     | Enqueues Promise.then callback
  T0+3   | Call Stack          | Executes log("4: Synchronous End")
  T0+4   | Stack Empty!        | Event loop inspects Microtask Queue
  T0+5   | Microtask Processed | Executes log("3: Microtask")
  T0+6   | Microtask Empty!    | Event loop picks next Task from Task Queue
  T0+7   | Task Processed      | Executes log("2: Macrotask")
  -------------------------------------------------------------------
`);

// ============================================================================
// SECTION 3: NESTED MICROTASKS VS TASKS
// ============================================================================
queueMicrotask(() => {
  console.log("3b: Second Microtask (via queueMicrotask)");
  Promise.resolve().then(() => {
    console.log("3c: Chained Microtask inside Microtask -> Still beats timers!");
  });
});

setTimeout(() => {
  console.log("2b: Second Macrotask timer");
}, 0);

console.log("5: Final Synchronous statement before stack unwinds.\n");
