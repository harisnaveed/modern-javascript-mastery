/**
 * ============================================================================
 * MODULE 13: Callback Functions & Higher-Order Functions (HOFs)
 * Specification: ECMAScript Core Concept / Functional Programming
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 03 (Arrow Functions), Module 12 (Closures)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * JavaScript is fundamentally single-threaded and non-blocking. It cannot halt
 * the entire program while waiting for a file read, timer, or network request.
 * 
 * To handle asynchronous operations, JavaScript's original architecture relied
 * entirely on **Callback Functions**.
 * 
 * THE HISTORICAL PROBLEMS WITH CALLBACKS:
 * 
 * A) Callback Hell ("The Pyramid of Doom"):
 *    - Chaining multiple asynchronous tasks forced developers into deep,
 *      horizontal pyramid nesting:
 *        login(user, function(token) {
 *            fetchProfile(token, function(profile) {
 *                fetchOrders(profile.id, function(orders) {
 *                    renderUI(orders, function() {
 *                        // Indented 12 levels deep!
 *                    });
 *                });
 *            });
 *        });
 * 
 * B) Inversion of Control:
 *    - You hand your code over to another function/library and TRUST it to call
 *      your callback correctly (not too early, not too late, and not 5 times!).
 * 
 * C) Broken `try/catch` Error Handling:
 *    - A synchronous `try...catch` CANNOT catch errors thrown inside an
 *      asynchronous callback! Node.js invented the "Error-First Callback"
 *      convention `(err, data) => ...` as a compromise before Promises existed.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, functions are callable types:
 *     $filtered = array_filter($data, function($item) { ... });
 * - In JavaScript, functions are **First-Class Citizens**:
 *     1. Assigned to variables: `const fn = () => {};`
 *     2. Stored in data structures: `const obj = { run: fn };`
 *     3. Passed as arguments to other functions: `doWork(fn);`
 *     4. Returned from other functions: `return fn;`
 *
 *
 * 3. WHAT IS A HIGHER-ORDER FUNCTION (HOF)?
 * ----------------------------------------------------------------------------
 * A Higher-Order Function is any function that does AT LEAST ONE of the following:
 * 1. Accepts another function as an argument (e.g., `map`, `filter`, `setTimeout`).
 * 2. Returns another function as its output (e.g., closures, function factories).
 * 
 * Key Functional Programming Techniques Powered by HOFs:
 * - **Currying**: Converting `f(a, b, c)` into unary calls `f(a)(b)(c)`.
 * - **Function Composition / Piping**: Chaining small single-purpose functions
 *   into a processing pipeline: `pipe(sanitize, validate, save)(data)`.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Synchronous vs Asynchronous Callbacks
 *    - `[1, 2].map(fn)` is SYNCHRONOUS (runs immediately).
 *    - `setTimeout(fn, 0)` is ASYNCHRONOUS (queued via the Event Loop).
 *    - Do not confuse the two! A callback is not inherently asynchronous.
 * 
 * Gotcha 2: The Node.js Error-First Convention
 *    - In Node.js callbacks: `(error, result) => {}`
 *    - You must ALWAYS check `if (error) { ... return; }` before reading `result`!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React Higher-Order Components (HOCs):
 *     const ProtectedDashboard = withAuthentication(Dashboard);
 * - Express.js Middleware Pipeline:
 *     app.use((req, res, next) => { ... next(); });
 * - Redux Middleware Architecture (Currying):
 *     const loggerMiddleware = store => next => action => { ... };
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 13: Callback Functions & Higher-Order Functions (HOFs)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SYNCHRONOUS VS ASYNCHRONOUS CALLBACKS
// ----------------------------------------------------------------------------
console.log("--- 1. SYNC VS ASYNC CALLBACKS ---");

// A) Synchronous Callback: Executes sequentially in current call stack
function processUserRecord(userId, callback) {
    console.log(`[Sync] Fetching record for ID: ${userId}`);
    const mockUser = { id: userId, name: "Haris Ali", role: "Engineer" };
    // Callback executes immediately:
    return callback(mockUser);
}

const formattedResult = processUserRecord(101, user => `${user.name.toUpperCase()} (${user.role})`);
console.log("[Sync Output]:", formattedResult);

// B) Asynchronous Callback: Runs via Event Loop
console.log("[Async] Scheduling timer callback...");
setTimeout(() => {
    // console.log("[Async Callback]: Fired after delay via event loop");
}, 10);
console.log("[Async] Main thread continues synchronously without blocking!");

console.log();

// ----------------------------------------------------------------------------
// 2. THE NODE.JS ERROR-FIRST CALLBACK PATTERN
// ----------------------------------------------------------------------------
console.log("--- 2. NODE.JS ERROR-FIRST CALLBACK CONVENTION ---");

// Simulating a traditional Node.js asynchronous operation (like fs.readFile):
function simulateDatabaseQuery(query, callback) {
    setTimeout(() => {
        if (!query) {
            // First argument is the Error object, second is null:
            return callback(new Error("Database query cannot be empty!"), null);
        }

        // First argument is null (no error), second is query result:
        const results = [{ id: 1, title: "Modern JavaScript Masterclass" }];
        callback(null, results);
    }, 20);
}

// Consuming with the standard Node.js guard pattern:
simulateDatabaseQuery("SELECT * FROM courses", (err, data) => {
    if (err) {
        console.error("Database operation failed:", err.message);
        return; // Always return early on error!
    }
    console.log("Database query successful. Received records:", data.length);
});

console.log();

// ----------------------------------------------------------------------------
// 3. CURRYING: TRANSFORMING MULTI-ARGUMENT FUNCTIONS
// ----------------------------------------------------------------------------
console.log("--- 3. FUNCTION CURRYING ---");

// Normal function with 3 arguments:
function regularLogger(environment, level, message) {
    return `[${environment.toUpperCase()}] [${level.toUpperCase()}]: ${message}`;
}
console.log("Regular log:", regularLogger("production", "error", "Database timeout"));

// Curried equivalent (unary function returning unary functions):
const curriedLogger = environment => level => message => {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 8);
    return `[${timestamp}] [${environment.toUpperCase()}] [${level.toUpperCase()}]: ${message}`;
};

// Creating specialized pre-configured loggers:
const prodLogger  = curriedLogger("production");
const prodError   = prodLogger("error");
const prodWarning = prodLogger("warning");

console.log(prodError("Failed payment gateway connection!"));
console.log(prodWarning("Redis memory usage exceeded 80%"));

console.log();

// ----------------------------------------------------------------------------
// 4. FUNCTION COMPOSITION (PIPE & COMPOSE)
// ----------------------------------------------------------------------------
console.log("--- 4. FUNCTION COMPOSITION (PIPE) ---");

/**
 * Pipe executes functions from LEFT to RIGHT:
 * data -> fn1 -> fn2 -> fn3 -> finalResult
 */
const pipe = (...functions) => initialValue => {
    return functions.reduce((currentValue, currentFunction) => {
        return currentFunction(currentValue);
    }, initialValue);
};

// Data transformation steps for user input:
const trimString = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const removeSpecialChars = str => str.replace(/[^a-z0-9\s]/g, "");
const formatAsSlug = str => str.replace(/\s+/g, "-");

// Create reusable pipeline:
const createUrlSlug = pipe(
    trimString,
    toLowerCase,
    removeSpecialChars,
    formatAsSlug
);

const blogTitle = "  10 Secrets of Modern JavaScript (ES6+ & Beyond)!!  ";
console.log("Original Title:   ", `"${blogTitle}"`);
console.log("Slugified Output: ", createUrlSlug(blogTitle));

console.log();

// ----------------------------------------------------------------------------
// 5. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 5. HOF & CALLBACK CHEAT SHEET ---");
console.table([
    { Concept: "Callback", Role: "A function passed into another function to be invoked" },
    { Concept: "Higher-Order Function", Role: "A function that accepts or returns another function" },
    { Concept: "Error-First Callback", Role: "Node.js standard: (err, result) => ... signature" },
    { Concept: "Currying", Role: "Splitting f(a, b) into f(a)(b) for reusable configurations" },
    { Concept: "Function Pipeline", Role: "Composing small unary functions into data processing pipelines" }
]);

console.log("Module 13 loaded and executed successfully.\n");

