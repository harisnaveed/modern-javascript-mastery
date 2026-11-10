/**
 * ============================================================================
 * MODULE 21: Asynchronous Foundations & The Event Loop
 * Specification: ECMAScript Runtime / HTML Event Loop Standard
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 11 (Scope & Hoisting), Module 13 (Callbacks)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * A major puzzle for beginners is:
 * "JavaScript is single-threaded (it has only ONE Call Stack). How can Node.js
 * handle 10,000 concurrent web requests, or how can the browser download images,
 * play animations, and process user clicks without freezing the page?"
 * 
 * In early computing, languages handled concurrency by spawning multi-threaded
 * OS processes. Spawning thousands of threads consumed massive memory and created
 * complex thread synchronization deadlocks.
 * 
 * JavaScript solved this with the **Event Loop & Non-Blocking Asynchronous I/O**.
 * 
 * THE ARCHITECTURAL COMPONENTS OF JAVASCRIPT RUNTIME:
 * 1. Call Stack: Single-threaded LIFO execution stack for running JS frames.
 * 2. Memory Heap: Unstructured memory allocation for objects and variables.
 * 3. Host APIs (Web APIs in browser / C++ libuv APIs in Node.js):
 *    Handles background timers, network sockets, file reads, and DOM events.
 * 4. Microtask Queue (Job Queue): Promises, `queueMicrotask()`, `process.nextTick()`.
 * 5. Macrotask Queue (Task Queue): `setTimeout`, `setInterval`, I/O, `setImmediate`.
 * 6. The Event Loop: The continuous coordinator that checks if the Call Stack is
 *    empty, and coordinates which queued task gets pushed to the stack next.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - PHP's Traditional Architecture:
 *   PHP-FPM / Apache creates a separate OS process or thread for every single
 *   incoming HTTP request. Blocking operations (e.g. `sleep(5)` or `file_get_contents`)
 *   completely freeze that worker thread until completion.
 * - Node.js Architecture:
 *   A single thread runs the JavaScript Event Loop. When an I/O operation starts,
 *   Node offloads it to the OS kernel / libuv thread pool. The JS thread remains
 *   100% free to handle other incoming requests!
 *
 *
 * 3. THE GOLDEN RULE OF EVENT LOOP PRIORITY
 * ----------------------------------------------------------------------------
 * The Event Loop follows a strict, non-negotiable priority order:
 * 
 *   1. Execute all SYNCHRONOUS code in the Call Stack until it is completely EMPTY.
 *   2. Check the MICROTASK QUEUE:
 *      Execute ALL pending microtasks until the Microtask Queue is completely DRAINED!
 *   3. Pick ONE task from the MACROTASK QUEUE and push it to the Call Stack.
 *   4. Check the Microtask Queue again (drain it if any new microtasks were scheduled).
 *   5. Repeat the loop!
 * 
 * CRITICAL TAKEAWAY:
 * **Microtasks ALWAYS have higher priority than Macrotasks!**
 * A Promise `.then()` callback will ALWAYS run before a `setTimeout(fn, 0)` callback!
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `setTimeout(fn, 0)` Does NOT Mean 0 Milliseconds!
 *    - It means "execute as soon as the Call Stack is empty AND all Microtasks
 *      have finished draining." It can never run immediately.
 * 
 * Gotcha 2: Microtask Starvation (Freezing the Runtime)
 *    - If a microtask recursively schedules another microtask:
 *        function freeze() { Promise.resolve().then(freeze); }
 *    - The Microtask Queue will NEVER empty, completely blocking the Macrotask
 *      Queue, UI rendering, network I/O, and timers!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Node.js Server Performance: NEVER perform heavy synchronous CPU work
 *   (e.g., synchronous file reads `readFileSync` or heavy encryption `crypto.pbkdf2Sync`)
 *   on the main thread, because it starves the Event Loop and freezes all clients!
 * - React Batched Updates: React schedules state updates as microtasks to batch
 *   multiple `setState()` calls into a single UI re-render pass.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 21: Asynchronous Foundations & The Event Loop");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. THE CLASSIC EVENT LOOP TICK INTERVIEW PUZZLE
// ----------------------------------------------------------------------------
console.log("--- 1. PREDICTING THE EVENT LOOP EXECUTION ORDER ---");

console.log("[1] Synchronous: Script starts");

// Macrotask: Scheduled in Macrotask Queue (runs via timer):
setTimeout(() => {
    console.log("[5] Macrotask: setTimeout(0ms) callback executed");
}, 0);

// Microtask: Scheduled in Microtask Queue (Promise):
Promise.resolve().then(() => {
    console.log("[3] Microtask 1: Promise .then() callback executed");
});

// Another Microtask via queueMicrotask:
queueMicrotask(() => {
    console.log("[4] Microtask 2: queueMicrotask() callback executed");
});

console.log("[2] Synchronous: Script ends");

// EXPECTED EXECUTION ORDER:
// 1 -> Synchronous starts
// 2 -> Synchronous ends
// 3 -> Microtask 1 (Promise drains first)
// 4 -> Microtask 2 (Microtask queue finishes draining)
// 5 -> Macrotask (setTimeout finally executes!)

console.log();

// ----------------------------------------------------------------------------
// 2. WHY SETTIMEOUT(FN, 0) IS NEVER ZERO MILLISECONDS
// ----------------------------------------------------------------------------
console.log("--- 2. TIMING ACCURACY & STACK BLOCKING ---");

const startTime = Date.now();

setTimeout(() => {
    const elapsed = Date.now() - startTime;
    console.log(`[Timer Result] setTimeout(0) actually executed after: ${elapsed}ms`);
}, 0);

// Artificially blocking the Call Stack with synchronous work:
let counter = 0;
for (let i = 0; i < 5e6; i++) {
    counter += i;
}
console.log("Synchronous CPU loop completed. Now stack can empty...");

console.log();

// ----------------------------------------------------------------------------
// 3. NODE.JS SPECIFIC: PROCESS.NEXTTICK VS SETIMMEDIATE
// ----------------------------------------------------------------------------
console.log("--- 3. NODE.JS EVENT LOOP PHASES ---");

// process.nextTick is a Node.js specific priority queue that drains BEFORE normal Promise microtasks:
process.nextTick(() => {
    console.log("[Node.js NextTick]: process.nextTick runs before Promise microtasks!");
});

// setImmediate runs in the 'check' phase of libuv, after I/O events:
setImmediate(() => {
    console.log("[Node.js Immediate]: setImmediate executed in check phase");
});

console.log();

// ----------------------------------------------------------------------------
// 4. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 4. EVENT LOOP PRIORITY CHEAT SHEET ---");
console.table([
    { Phase: "1. Synchronous Call Stack", Examples: "Normal JS code, loops, functions", Priority: "Highest (Runs immediately)" },
    { Phase: "2. Microtask Queue", Examples: "Promise.then, queueMicrotask", Priority: "Drains completely before next macrotask" },
    { Phase: "3. Macrotask Queue", Examples: "setTimeout, setInterval, I/O, setImmediate", Priority: "Lowest (One task processed per tick)" }
]);

console.log("Module 21 loaded and executed successfully.\n");

