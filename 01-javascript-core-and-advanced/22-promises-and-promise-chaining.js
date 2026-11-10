/**
 * ============================================================================
 * MODULE 22: Promises & Promise Chaining
 * Specification: ECMAScript 2015 (ES6) / Promises/A+ Specification
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 13 (Callbacks), Module 21 (The Event Loop)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * Prior to ES6, asynchronous JavaScript was managed exclusively through callbacks.
 * 
 * This caused severe architectural breakdowns:
 * 
 * A) Callback Hell (The Pyramid of Doom):
 *    - Code expanded horizontally rather than vertically.
 * 
 * B) Fragmented Error Handling:
 *    - Developers had to inspect `if (err)` inside every single nested callback.
 *    - Forgetting an `if (err)` check at level 3 silently swallowed errors and
 *      corrupted application state.
 * 
 * C) Inversion of Control & Trust:
 *    - When passing a callback to a third-party library, you had no guarantee:
 *      - Would it call your callback 0 times?
 *      - Would it call your callback 5 times?
 *      - Would it call it synchronously or asynchronously?
 * 
 * ES6 standardized **Promises** (based on Promises/A+) to restore control,
 * guarantee predictable execution, and flatten asynchronous sequences.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In traditional PHP, synchronous execution pauses until an operation finishes.
 * - In JavaScript, a Promise is an **IOU receipt** for a value that hasn't arrived
 *   yet. The code continues executing immediately, and when the value is ready,
 *   the Promise notifies your `.then()` handlers via the Microtask Queue.
 *
 *
 * 3. THE 3 STATES OF A PROMISE
 * ----------------------------------------------------------------------------
 * A Promise is a state machine with 3 non-negotiable states:
 * 
 *   [ Pending ]
 *      │
 *      ├───────► [ Fulfilled ] (Operation succeeded: resolve(result))
 *      │
 *      └───────► [ Rejected ]  (Operation failed: reject(error))
 * 
 * IMMUTABILITY GUARANTEE:
 * Once a Promise transitions to Fulfilled or Rejected, **its state is permanently
 * locked!** It can NEVER change state or resolve again.
 *
 *
 * 4. PROMISE CHAINING & ERROR BUBBLING
 * ----------------------------------------------------------------------------
 * - Every call to `.then()` returns a BRAND NEW Promise.
 * - If you return a value inside `.then()`, it becomes the resolved value of
 *   the next `.then()`.
 * - If you return a Promise inside `.then()`, the chain WAITS for that Promise
 *   to settle before proceeding!
 * - **Error Bubbling**: If an error is thrown at step 1, 2, or 3, execution jumps
 *   immediately down the chain to the first `.catch()` block, exactly like a
 *   synchronous `try...catch`!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Building reusable async helpers: `const sleep = ms => new Promise(r => setTimeout(r, ms));`
 * - Converting legacy Node.js callback APIs into Promises (Promisification).
 * - Multi-step sequential workflows (Authentication -> Authorization -> Data Retrieval).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 22: Promises & Promise Chaining");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. CREATING A PROMISE FROM SCRATCH
// ----------------------------------------------------------------------------
console.log("--- 1. PROMISE CREATION & LIFECYCLE ---");

function fetchSimulatedUserData(userId) {
    return new Promise((resolve, reject) => {
        console.log(`[Promise: Pending] Fetching user ${userId} from database...`);

        setTimeout(() => {
            if (userId <= 0) {
                // Reject transition:
                reject(new Error("Invalid User ID! Must be a positive integer."));
            } else {
                // Fulfilled transition:
                resolve({
                    id: userId,
                    name: "Haris Ali",
                    role: "Fullstack Architect"
                });
            }
        }, 30);
    });
}

// Consuming the promise:
fetchSimulatedUserData(101)
    .then(user => {
        console.log("[Promise: Fulfilled] Received user payload:", user);
    })
    .catch(error => {
        console.error("[Promise: Rejected] Error caught:", error.message);
    })
    .finally(() => {
        console.log("[Promise: Settled] Cleanup executed (runs on both success and error).");
    });

console.log();

// ----------------------------------------------------------------------------
// 2. PROMISE CHAINING: STEP-BY-STEP HORIZONTAL DATA FLOW
// ----------------------------------------------------------------------------
console.log("--- 2. PROMISE CHAINING PIPELINE ---");

function authenticateUser(credentials) {
    return new Promise(resolve => {
        setTimeout(() => resolve({ token: "JWT_AUTH_TOKEN_99", username: credentials.username }), 20);
    });
}

function fetchUserPermissions(token) {
    return new Promise(resolve => {
        setTimeout(() => resolve(["DASHBOARD_ACCESS", "WRITE_POSTS"]), 20);
    });
}

function generateSession(username, permissions) {
    return `Session established for @${username} with permissions: [${permissions.join(", ")}]`;
}

// Clean horizontal chaining: No nested pyramid!
authenticateUser({ username: "haris_dev" })
    .then(authData => {
        console.log(`Step 1: Authenticated as @${authData.username}`);
        // Return another promise; the chain waits automatically:
        return fetchUserPermissions(authData.token).then(permissions => ({
            username: authData.username,
            permissions
        }));
    })
    .then(({ username, permissions }) => {
        console.log("Step 2: Permissions retrieved successfully");
        // Return a plain string; wrapped automatically in fulfilled promise:
        return generateSession(username, permissions);
    })
    .then(finalSessionString => {
        console.log("Step 3: Final Output =>", finalSessionString);
    })
    .catch(err => {
        console.error("Pipeline failure:", err.message);
    });

console.log();

// ----------------------------------------------------------------------------
// 3. ERROR BUBBLING: ONE CATCH TO RULE THEM ALL
// ----------------------------------------------------------------------------
console.log("--- 3. ERROR BUBBLING IN PROMISE CHAINS ---");

Promise.resolve(10)
    .then(num => {
        console.log(`Step A: Received ${num}`);
        return num * 2; // 20
    })
    .then(num => {
        console.log(`Step B: Received ${num}, throwing error now...`);
        throw new Error("Unexpected failure at Step B!");
    })
    .then(num => {
        // SKIPPED COMPLETELY due to error at Step B!
        console.log(`Step C: Received ${num}`);
        return num * 2;
    })
    .catch(err => {
        // Catches errors from ANY preceding step in the chain!
        console.log("Centralized Catch: Successfully handled error =>", err.message);
        return 0; // Recovery fallback
    })
    .then(recoveredValue => {
        console.log("Step D: Execution continues after catch with recovered value:", recoveredValue);
    });

console.log();

// ----------------------------------------------------------------------------
// 4. PROMISIFICATION: CONVERTING CALLBACKS INTO PROMISES
// ----------------------------------------------------------------------------
console.log("--- 4. PROMISIFYING LEGACY CODE ---");

// The modern replacement for setTimeout callbacks:
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log("Sleeping for 15ms using promisified timer...");
sleep(15).then(() => {
    console.log("Promisified sleep finished cleanly.");
});

console.log();

// ----------------------------------------------------------------------------
// 5. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 5. PROMISE API CHEAT SHEET ---");
console.table([
    { Method: "new Promise((res, rej) => ...)", Role: "Constructs a new deferred asynchronous operation" },
    { Method: ".then(onFulfilled)", Role: "Handles successful completion; returns a new promise" },
    { Method: ".catch(onRejected)", Role: "Handles errors from any upstream step; enables error recovery" },
    { Method: ".finally(onSettled)", Role: "Runs guaranteed cleanup regardless of success or failure" },
    { Method: "Promise.resolve(val)", Role: "Creates an immediately fulfilled promise with value" },
    { Method: "Promise.reject(err)", Role: "Creates an immediately rejected promise with reason" }
]);

console.log("Module 22 loaded and executed successfully.\n");

