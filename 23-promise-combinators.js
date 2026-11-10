/**
 * ============================================================================
 * MODULE 23: Promise Combinators (all, allSettled, race, any & withResolvers)
 * Specification: ES6 (all, race) / ES2020 (allSettled) / ES2021 (any) / ES2024 (withResolvers)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 22 (Promises & Chaining)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In production web apps, you rarely fetch only one thing at a time.
 * Real-world applications constantly need to coordinate multiple concurrent tasks:
 *   - Fetching user details, notifications, and shopping cart.
 *   - Uploading 5 image attachments simultaneously.
 *   - Race against a network timeout clock.
 * 
 * SEQUENTIAL VS PARALLEL LATENCY:
 * If task A takes 200ms, task B takes 300ms, and task C takes 100ms:
 *   - Sequential Execution: 200 + 300 + 100 = 600ms latency.
 *   - Parallel Concurrency: max(200, 300, 100) = 300ms latency! (50% faster!)
 * 
 * However, parallel concurrency introduces complex questions:
 * - What if task B fails? Should we abort everything, or keep A and C?
 * - What if we have 3 redundant API mirrors and want the fastest response?
 * - What if an API hangs and we need to abort after 3 seconds?
 * 
 * JavaScript solves this with the **4 Standard Promise Combinators** plus **ES2024 withResolvers**.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, parallel HTTP calls require `curl_multi_exec` or Guzzle's `Promise\all()`.
 * - In modern JavaScript, concurrency combinators are native static methods on `Promise`.
 *
 *
 * 3. THE 4 CORE COMBINATORS + ES2024
 * ----------------------------------------------------------------------------
 * 1. `Promise.all([p1, p2, ...])` (ES6) - "All or Nothing" / "Fail-Fast"
 *    - All must fulfill.
 *    - Returns array of results matching input order.
 *    - If ANY promise rejects, `Promise.all` immediately rejects with that error.
 * 
 * 2. `Promise.allSettled([p1, p2, ...])` (ES2020) - "Resilient Batching"
 *    - NEVER rejects!
 *    - Waits for ALL promises to complete (whether resolved OR rejected).
 *    - Returns array of objects: `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`.
 * 
 * 3. `Promise.race([p1, p2, ...])` (ES6) - "First to Finish Line"
 *    - Resolves OR rejects with the result of the FIRST settled promise.
 *    - Ideal for implementing request timeouts!
 * 
 * 4. `Promise.any([p1, p2, ...])` (ES2021) - "First Successful Winner"
 *    - Resolves with the FIRST fulfilled promise (ignores rejections).
 *    - Rejects ONLY if ALL promises reject (throws an `AggregateError`).
 * 
 * 5. `Promise.withResolvers()` (ES2024) - "Deconstructed Promise"
 *    - Returns `{ promise, resolve, reject }` without nesting inside an executor function!
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Decision Rule:
 * - Use `Promise.all` when all data is strictly required (e.g. checkout cannot
 *   proceed without payment AND inventory confirmation).
 * - Use `Promise.allSettled` when partial success is acceptable (e.g. sending
 *   100 email notifications; 5 failures shouldn't stop the other 95).
 * - Use `Promise.race` for timeouts.
 * - Use `Promise.any` for redundant fallback mirrors.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Next.js Server Components parallel data fetching:
 *     const [user, posts, categories] = await Promise.all([getUser(), getPosts(), getCategories()]);
 * - Node.js microservice health check dashboards (`allSettled`).
 * - Request timeout wrapper utility (`race`).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 23: Promise Combinators");
console.log("==================================================================\n");

// Helper mock async functions with variable response delays:
const fetchUserProfile = () => new Promise(res => setTimeout(() => res({ user: "Haris Ali" }), 30));
const fetchNotifications = () => new Promise(res => setTimeout(() => res(["Notif 1", "Notif 2"]), 50));
const fetchAnalytics = () => new Promise((res, rej) => setTimeout(() => rej(new Error("Analytics API 500")), 20));

// ----------------------------------------------------------------------------
// 1. PROMISE.ALL: ALL-OR-NOTHING / FAIL-FAST
// ----------------------------------------------------------------------------
console.log("--- 1. PROMISE.ALL (FAIL-FAST) ---");

// A) Successful batch:
Promise.all([fetchUserProfile(), fetchNotifications()])
    .then(([profile, notifications]) => {
        console.log("Promise.all succeeded (all fulfilled):", { profile, notifications });
    })
    .catch(err => {
        console.error("Promise.all failed:", err.message);
    });

// B) Failure batch (fetchAnalytics rejects, aborting entire operation):
Promise.all([fetchUserProfile(), fetchAnalytics()])
    .then(() => console.log("Will not run"))
    .catch(err => {
        console.log("Promise.all immediately rejected due to single failure:", err.message);
    });

console.log();

// ----------------------------------------------------------------------------
// 2. PROMISE.ALLSETTLED: RESILIENT BATCHING (NEVER CRASHES)
// ----------------------------------------------------------------------------
console.log("--- 2. PROMISE.ALLSETTLED (RESILIENT BATCHING) ---");

Promise.allSettled([fetchUserProfile(), fetchAnalytics(), fetchNotifications()])
    .then(results => {
        console.log("Promise.allSettled received all outcomes:");
        results.forEach((result, idx) => {
            if (result.status === "fulfilled") {
                console.log(` - Task ${idx + 1}: SUCCESS =>`, result.value);
            } else {
                console.log(` - Task ${idx + 1}: FAILED  =>`, result.reason.message);
            }
        });
    });

console.log();

// ----------------------------------------------------------------------------
// 3. PROMISE.RACE: IMPLEMENTING A NETWORK TIMEOUT PATTERN
// ----------------------------------------------------------------------------
console.log("--- 3. PROMISE.RACE (REQUEST TIMEOUT PATTERN) ---");

function timeout(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    });
}

// Simulated slow database query that takes 100ms:
const slowDatabaseQuery = () => new Promise(res => setTimeout(() => res("Data Loaded"), 100));

// Race slow query against a 40ms timeout:
Promise.race([slowDatabaseQuery(), timeout(40)])
    .then(data => console.log("Query won race:", data))
    .catch(err => console.log("Race lost to timeout:", err.message));

console.log();

// ----------------------------------------------------------------------------
// 4. PROMISE.ANY: FIRST SUCCESSFUL MIRROR
// ----------------------------------------------------------------------------
console.log("--- 4. PROMISE.ANY (FIRST SUCCESSFUL FULFILLMENT) ---");

// Redundant CDN mirrors (Mirror 1 and 2 fail, Mirror 3 succeeds):
const cdnMirror1 = new Promise((_, rej) => setTimeout(() => rej(new Error("CDN 1 Down")), 10));
const cdnMirror2 = new Promise((_, rej) => setTimeout(() => rej(new Error("CDN 2 Down")), 20));
const cdnMirror3 = new Promise(res => setTimeout(() => res("Asset loaded from CDN 3 (Fastest alive)"), 40));

Promise.any([cdnMirror1, cdnMirror2, cdnMirror3])
    .then(fastestAliveResponse => {
        console.log("Promise.any returned first working mirror:", fastestAliveResponse);
    })
    .catch(aggregateError => {
        console.log("All mirrors failed:", aggregateError.errors);
    });

console.log();

// ----------------------------------------------------------------------------
// 5. ES2024 PROMISE.WITHRESOLVERS()
// ----------------------------------------------------------------------------
console.log("--- 5. ES2024 PROMISE.WITHRESOLVERS() ---");

// In ES2024, instead of nesting logic inside `new Promise((res, rej) => ...)`:
// You can deconstruct { promise, resolve, reject } directly:
if (typeof Promise.withResolvers === "function") {
    const { promise, resolve, reject } = Promise.withResolvers();

    // Attach consumers:
    promise.then(msg => console.log("withResolvers() resolved cleanly:", msg));

    // Resolve from anywhere outside:
    resolve("ES2024 withResolvers is supported and working!");
} else {
    console.log("Promise.withResolvers() requires Node v22+");
}

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. PROMISE COMBINATOR DECISION MATRIX ---");
console.table([
    { Method: "Promise.all()", SettlesWhen: "All fulfill OR any rejects", Returns: "Array of values", FailsWhen: "Any 1 promise rejects" },
    { Method: "Promise.allSettled()", SettlesWhen: "All promises settle", Returns: "Array of status objects", FailsWhen: "NEVER rejects" },
    { Method: "Promise.race()", SettlesWhen: "First promise settles", Returns: "Value or reason of winner", FailsWhen: "If winner rejected" },
    { Method: "Promise.any()", SettlesWhen: "First promise fulfills", Returns: "Value of first success", FailsWhen: "Only if ALL reject" }
]);

console.log("Module 23 loaded and executed successfully.\n");

