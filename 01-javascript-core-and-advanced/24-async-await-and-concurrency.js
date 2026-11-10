/**
 * ============================================================================
 * MODULE 24: Async/Await & Concurrency Patterns
 * Specification: ECMAScript 2017 (ES8) / ES2022 (Top-Level Await)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 22 (Promises), Module 23 (Combinators)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * While Promises and `.then()` chains solved Callback Hell, writing complex
 * asynchronous logic (loops, conditionals, nested tries) was still mentally
 * exhausting compared to clean synchronous code:
 * 
 *     function getOrders(userId) {
 *         return validate(userId)
 *             .then(isValid => {
 *                 if (!isValid) return [];
 *                 return fetchDb(userId).then(orders => transform(orders));
 *             })
 *             .catch(err => handleError(err));
 *     }
 * 
 * ES2017 introduced `async` and `await` as built-in syntax.
 * Under the hood, `async/await` is syntactic sugar over Promises and Generators
 * (Module 18), allowing asynchronous code to look and read like synchronous code!
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, asynchronous execution traditionally required libraries (Amp/ReactPHP)
 *   or PHP 8.1 Fibers.
 * - In JavaScript, `async/await` is the universal, modern standard for all I/O,
 *   network calls, and database operations.
 *
 *
 * 3. CORE MECHANICS OF ASYNC/AWAIT
 * ----------------------------------------------------------------------------
 * - The `async` keyword:
 *   - Can be placed before any function declaration, arrow function, or method.
 *   - An `async` function ALWAYS returns a Promise (wrapping values in `Promise.resolve()`).
 * 
 * - The `await` keyword:
 *   - Pauses execution of the enclosing `async` function until the Promise settles.
 *   - CRITICAL: It pauses ONLY the local async function; it DOES NOT block the
 *     JavaScript thread or Event Loop!
 *   - Unwraps the fulfilled value directly: `const user = await fetchUser();`
 *   - If the Promise rejects, `await` throws the error, letting you use standard
 *     `try...catch...finally`!
 * 
 * - Top-Level Await (ES2022):
 *   - In ES Modules, you can use `await` directly at the file root without
 *     wrapping it in an `async function`!
 *
 *
 * 4. THE TWO BIGGEST ASYNC/AWAIT PITFALLS (GOTCHAS)
 * ----------------------------------------------------------------------------
 * Gotcha 1: The Accidental Waterfall (Sequential Await)
 *    - Writing:
 *        const user = await getUser();
 *        const posts = await getPosts(); // If posts don't depend on user, this wastes time!
 *    - Solution: Run concurrently with `Promise.all`:
 *        const [user, posts] = await Promise.all([getUser(), getPosts()]);
 * 
 * Gotcha 2: The `Array.forEach()` Async Trap!
 *    - `arr.forEach(async item => { await doWork(item); });`
 *    - `forEach` DOES NOT WAIT for Promises! It fires all callbacks and exits immediately.
 *    - Solution for sequential: Use `for...of`.
 *    - Solution for parallel: Use `await Promise.all(arr.map(async item => ...))`.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Next.js App Router (Server Components):
 *     export default async function ProductPage({ params }) {
 *         const product = await getProduct(params.id);
 *         return <h1>{product.title}</h1>;
 *     }
 * - Next.js Server Actions:
 *     "use server";
 *     export async function createOrder(formData) { ... }
 * - Node.js Express Controllers with async/await error handlers.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 24: Async/Await & Concurrency Patterns");
console.log("==================================================================\n");

// Simulated asynchronous network operations with delays:
const mockFetchUser = id => new Promise(res => setTimeout(() => res({ id, name: "Haris Ali" }), 30));
const mockFetchPosts = () => new Promise(res => setTimeout(() => res(["Post 1", "Post 2"]), 30));
const mockFailingApi = () => new Promise((_, rej) => setTimeout(() => rej(new Error("Database Connection Reset")), 20));

// ----------------------------------------------------------------------------
// 1. BASIC ASYNC / AWAIT WITH TRY / CATCH
// ----------------------------------------------------------------------------
console.log("--- 1. BASIC ASYNC / AWAIT WITH TRY / CATCH ---");

async function loadUserProfile(userId) {
    try {
        console.log(`[Loading] Initiating user profile fetch for #${userId}...`);
        const user = await mockFetchUser(userId);
        console.log("[Success] User retrieved:", user);
        return user;
    } catch (error) {
        console.error("[Caught Error]:", error.message);
    } finally {
        console.log("[Cleanup] Loader finished.");
    }
}

// Consuming async function:
loadUserProfile(101);

// Error demonstration:
async function triggerFailure() {
    try {
        await mockFailingApi();
    } catch (err) {
        console.log("[Caught Async Failure]:", err.message);
    }
}
triggerFailure();

console.log();

// ----------------------------------------------------------------------------
// 2. SEQUENTIAL WATERFALL VS PARALLEL EXECUTION (PERFORMANCE)
// ----------------------------------------------------------------------------
console.log("--- 2. SEQUENTIAL WATERFALL VS PARALLEL EXECUTION ---");

// A) The Slow Sequential Waterfall (Total time: 30ms + 30ms = 60ms):
async function runSequential() {
    const t0 = Date.now();
    const user = await mockFetchUser(1);
    const posts = await mockFetchPosts();
    const elapsed = Date.now() - t0;
    console.log(`[Sequential Waterfall] Took: ~${elapsed}ms for 2 requests`);
}
runSequential();

// B) The Fast Parallel Concurrency (Total time: max(30ms, 30ms) = 30ms):
async function runParallel() {
    const t0 = Date.now();
    const [user, posts] = await Promise.all([mockFetchUser(1), mockFetchPosts()]);
    const elapsed = Date.now() - t0;
    console.log(`[Parallel Concurrency] Took: ~${elapsed}ms for 2 requests (50% faster!)`);
}
runParallel();

console.log();

// ----------------------------------------------------------------------------
// 3. THE FOREACH ASYNC TRAP & HOW TO FIX IT
// ----------------------------------------------------------------------------
console.log("--- 3. THE FOREACH ASYNC TRAP ---");

const itemIds = [1, 2, 3];

// BROKEN: forEach does NOT wait for async callbacks:
async function brokenForEachLoop() {
    console.log(">> Starting broken forEach...");
    itemIds.forEach(async id => {
        await mockFetchUser(id);
        // console.log(`   Fetched item ${id}`);
    });
    console.log(">> brokenForEachLoop exited! (Notice: it exited BEFORE items finished!)");
}
brokenForEachLoop();

// FIX 1: Sequential processing with for...of (Waits for each in order):
async function fixedSequentialLoop() {
    console.log(">> Starting fixed sequential for...of...");
    for (const id of itemIds) {
        const item = await mockFetchUser(id);
        // Each iteration waits for previous one:
    }
    console.log(">> fixedSequentialLoop exited cleanly after all completed!");
}
fixedSequentialLoop();

// FIX 2: Parallel processing with Promise.all and map (Fastest):
async function fixedParallelLoop() {
    console.log(">> Starting fixed parallel map...");
    const results = await Promise.all(itemIds.map(id => mockFetchUser(id)));
    console.log(`>> fixedParallelLoop completed all ${results.length} items in parallel!`);
}
fixedParallelLoop();

console.log();

// ----------------------------------------------------------------------------
// 4. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 4. ASYNC / AWAIT BEST PRACTICES ---");
console.table([
    { Rule: "Independent requests?", Action: "Use await Promise.all([...])", Benefit: "Runs concurrently, halves response latency" },
    { Rule: "Dependent requests?", Action: "Use sequential awaits: a = await A(); b = await B(a)", Benefit: "Ensures step 2 has required data" },
    { Rule: "Iterating with delay?", Action: "Use 'for (const x of arr)' loop", Benefit: "Properly waits for each async step" },
    { Rule: "Error handling?", Action: "Wrap in standard try...catch...finally", Benefit: "Catches rejections like synchronous errors" }
]);

console.log("Module 24 loaded and executed successfully.\n");

