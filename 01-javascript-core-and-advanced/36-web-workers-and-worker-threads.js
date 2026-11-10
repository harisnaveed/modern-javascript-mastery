/**
 * ============================================================================
 * MODULE 36: Web Workers & Node.js Worker Threads (Multi-Threading in JS)
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL BACKGROUND
 * ----------------------------------------------------------------------------
 * JavaScript was famously created as a single-threaded language running on a 
 * single Event Loop. For 90% of web tasks (I/O, database queries, HTTP fetches), 
 * single-threaded asynchronous non-blocking I/O is blazing fast and eliminates 
 * the complexity of thread synchronization, race conditions, and deadlocks.
 *
 * THE FATAL FLAW OF THE SINGLE THREAD:
 * What happens when your application needs to do HEAVY CPU-INTENSIVE computation?
 * (e.g. image resizing, cryptographic hashing, 3D physics, parsing 500MB JSON, 
 * machine learning inference, complex PDF generation).
 *
 * 💥 In the Browser: The main UI thread freezes completely. Clicks, scrolls, and 
 * animations stop responding. The browser displays "Page Unresponsive - Wait or Kill".
 * 💥 In Node.js / Next.js Server: The Event Loop is BLOCKED. Because the server is 
 * single-threaded, while it spends 3 seconds calculating a heavy hash, ALL other 
 * 5,000 incoming HTTP requests from other users are completely frozen in queue!
 *
 * MODERN SOLUTION:
 * - Browsers: "Web Workers" (W3C standard) — background threads that run scripts 
 *   without interfering with the user interface.
 * - Node.js: "worker_threads" module — allows the execution of JavaScript in 
 *   multiple parallel V8 threads with shared memory and message passing!
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - Classic PHP:
 *   PHP handles concurrency via multiple independent OS processes (Apache MPM prefork 
 *   or PHP-FPM pools). If 10 requests come in, 10 separate PHP processes handle them.
 *   For background CPU work, PHP developers typically push jobs to Redis/Database 
 *   queues handled by `php artisan queue:work` worker processes.
 *
 * - Node.js Worker Threads:
 *   Instead of launching heavy OS processes (which consume 30MB+ RAM each like `child_process.fork`), 
 *   Node.js `worker_threads` run inside the SAME process as lightweight V8 "Isolates".
 *   Each worker has its own V8 engine instance, its own call stack, and its own event loop, 
 *   but they can share binary memory lightning-fast using `SharedArrayBuffer`!
 *
 *
 * 3. CORE CONCEPTS & MESSAGING ARCHITECTURE
 * ----------------------------------------------------------------------------
 * A. Message Passing (Actor Model):
 *    - Main thread and Worker threads communicate by sending serialized messages 
 *      using `postMessage()` and receiving via `on('message', callback)`.
 *    - Data is cloned via the HTML Structured Clone Algorithm (safe, isolated).
 *
 * B. SharedArrayBuffer & Atomics:
 *    - Direct zero-copy shared memory block accessible by both main and worker threads.
 *    - `Atomics` API provides atomic read, write, and wait operations to prevent 
 *      race conditions and data corruption without mutex deadlocks.
 *
 * C. Web Workers (Browser) vs Worker Threads (Node.js):
 *    - Web Workers: Cannot touch the DOM (`document`, `window`). They communicate 
 *      purely via messages and handle heavy client calculations (e.g. video filters).
 *    - Worker Threads: No `globalThis.window`, but have full access to Node.js 
 *      APIs (crypto, buffers, file system).
 * ============================================================================
 */

const { Worker, isMainThread, parentPort, workerData } = require("node:worker_threads");

// ============================================================================
// LOGIC SPLIT: MAIN THREAD VS WORKER THREAD
// ============================================================================

if (isMainThread) {
  console.log("==================================================================");
  console.log("  MODULE 36: Multi-Threading with Node.js Worker Threads");
  console.log("==================================================================\n");

  // --------------------------------------------------------------------------
  // CODE RUNNING IN MAIN THREAD
  // --------------------------------------------------------------------------
  console.log("--- 1. MAIN THREAD EXECUTION ---");
  console.log(`[Main Thread PID: ${process.pid}] Spawning background worker thread...`);

  /**
   * Heavy CPU calculation function (Fibonacci recursive)
   * This is intentionally CPU-intensive. If run on the main thread, it blocks everything!
   */
  function runWorkerTask(targetNumber) {
    return new Promise((resolve, reject) => {
      // Spawn worker pointing to THIS file, passing workerData
      const worker = new Worker(__filename, {
        workerData: { targetNumber },
      });

      // Listen for message from worker
      worker.on("message", (result) => {
        resolve(result);
      });

      // Handle worker errors
      worker.on("error", (err) => {
        reject(err);
      });

      // Handle worker termination
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  // Demonstration: Main thread remains responsive while worker calculates
  const target = 30;
  console.log(`[Main Thread] Delegating Fibonacci(${target}) computation to Worker Thread...`);

  const startTime = Date.now();

  runWorkerTask(target).then((result) => {
    const elapsed = Date.now() - startTime;
    console.log(`[Main Thread] ✅ Received result from Worker: Fibonacci(${target}) = ${result}`);
    console.log(`[Main Thread] Calculation completed in ${elapsed}ms without blocking the main event loop!\n`);

    // ========================================================================
    // SECTION 2: SHARED MEMORY WITH SHAREDARRAYBUFFER & ATOMICS
    // ========================================================================
    console.log("--- 2. ZERO-COPY SHARED MEMORY (SharedArrayBuffer & Atomics) ---");

    // Allocate 4 bytes of shared memory (1 Int32 integer)
    const sharedBuffer = new SharedArrayBuffer(4);
    const sharedInt32 = new Int32Array(sharedBuffer);

    // Initial value
    sharedInt32[0] = 100;
    console.log(`Initial Shared Value: ${sharedInt32[0]}`);

    // Atomics: Thread-safe atomic increment
    Atomics.add(sharedInt32, 0, 50);
    console.log(`Value after Atomics.add(+50): ${sharedInt32[0]}`);

    // Atomics: Compare and Swap (Exchange value only if expected matches)
    const oldVal = Atomics.compareExchange(sharedInt32, 0, 150, 999);
    console.log(`Atomics.compareExchange (150 -> 999), previous was ${oldVal}, new is: ${sharedInt32[0]}\n`);

    // ========================================================================
    // SECTION 3: REAL-WORLD FRAMEWORK PATTERNS (REACT & NEXT.JS)
    // ========================================================================
    console.log("--- 3. WHEN TO USE WORKERS IN REACT, NEXT.JS & NODE.JS ---");

    const workerUseCases = [
      {
        Environment: "Next.js / Node.js Server",
        UseCases: "PDF report generation, Image resizing (Sharp), Heavy cryptography, ML model inference.",
        Why: "Prevents blocking HTTP request handling. Keeps TTFB (Time to First Byte) under 50ms.",
      },
      {
        Environment: "React / Browser (Web Worker)",
        UseCases: "Client-side search indexation, parsing large CSV/Excel files, Canvas/WebGL physics.",
        Why: "Prevents freezing browser 60 FPS UI rendering and scroll stutter.",
      },
      {
        Environment: "When NOT to use Workers",
        UseCases: "Simple API fetches, Database queries, Disk I/O (already asynchronous in libuv).",
        Why: "Worker thread instantiation has CPU/RAM overhead (~5ms-10ms). Use only for CPU bottlenecks.",
      },
    ];

    console.table(workerUseCases);
    console.log("\nModule 36 loaded and executed successfully.");
  });

} else {
  // --------------------------------------------------------------------------
  // CODE RUNNING IN WORKER THREAD
  // --------------------------------------------------------------------------
  // This code runs in parallel on a separate OS thread!

  function calculateFibonacci(n) {
    if (n <= 1) return n;
    return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
  }

  // Receive data passed from main thread
  const num = workerData.targetNumber;
  const computedResult = calculateFibonacci(num);

  // Send result back to main thread
  parentPort.postMessage(computedResult);
}
