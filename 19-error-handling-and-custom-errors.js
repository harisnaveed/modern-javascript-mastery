/**
 * ============================================================================
 * MODULE 19: Error Handling & Custom Error Hierarchies
 * Specification: ECMAScript Core / ES2019 / ES2022 (Error Cause)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 16 (Classes & OOP)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript, error handling was frequently mishandled:
 * 
 * A) Throwing Raw Strings (The Anti-Pattern):
 *    - Beginners and legacy codebases frequently wrote:
 *        throw "Invalid password!";
 *    - Raw strings DO NOT capture a stack trace! Developers had no file name,
 *      no line number, and no call stack to debug production crashes.
 * 
 * B) Silent Failures & JavaScript Quirks:
 *    - Division by zero in JavaScript does NOT throw an exception!
 *        10 / 0 === Infinity; // No error!
 *    - Accessing non-existent properties returns `undefined`, hiding logic errors.
 * 
 * C) Broken Synchronous `try/catch` with Asynchronous Code:
 *    - You CANNOT wrap a traditional asynchronous callback in a synchronous `try/catch`:
 *        try {
 *            setTimeout(() => { throw new Error("Boom"); }, 100);
 *        } catch (e) {
 *            // NEVER RUNS! The error was thrown in a different tick of the Event Loop!
 *        }
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, you can define multiple typed `catch` blocks:
 *     try { ... }
 *     catch (ValidationException $e) { ... }
 *     catch (DatabaseException $e) { ... }
 *     catch (Exception $e) { ... }
 * - In JavaScript, there is ONLY ONE `catch (error)` block!
 *   To differentiate error types, you must inspect `error instanceof CustomErrorClass`.
 *
 *
 * 3. THE MODERN JAVASCRIPT ERROR ARCHITECTURE
 * ----------------------------------------------------------------------------
 * - `try { ... } catch (error) { ... } finally { ... }`
 * - Built-in Standard Error Types:
 *   - `TypeError`: Wrong data type (e.g. calling `undefined()`).
 *   - `ReferenceError`: Accessing variable in TDZ or undeclared variable.
 *   - `SyntaxError`: Invalid JavaScript grammar (e.g. `JSON.parse("{bad}")`).
 *   - `RangeError`: Number out of bounds (e.g. `new Array(-1)`).
 * - ES2019 Optional Catch Binding:
 *   `try { ... } catch { ... }` omitting the `(error)` variable when not needed.
 * - ES2022 Error Cause Chaining:
 *   `new Error("High level message", { cause: lowLevelError })`
 *   Maintains full root-cause trace across application layers!
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: The `finally` Block ALWAYS Runs!
 *    - Even if `try` contains a `return` statement, `finally` executes BEFORE
 *      the function actually exits!
 *    - If `finally` returns a value, it OVERRIDES the return value of `try`!
 * 
 * Gotcha 2: The Silent Swallow Anti-Pattern
 *    - `try { ... } catch {}` with no logging or recovery hides critical bugs.
 *      Always log, wrap, or rethrow unexpected exceptions.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Centralized Express.js Error Middleware:
 *     app.use((err, req, res, next) => res.status(err.statusCode || 500).json(...))
 * - React Error Boundaries: Catching render-time crashes so the whole page doesn't go white.
 * - Next.js Server Actions & Route Handlers error responses.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 19: Error Handling & Custom Error Hierarchies");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. TRY / CATCH / FINALLY MECHANICS
// ----------------------------------------------------------------------------
console.log("--- 1. TRY / CATCH / FINALLY EXECUTION ORDER ---");

function testTryCatchFinally(shouldThrow) {
    try {
        console.log(" [1] Inside 'try' block...");
        if (shouldThrow) {
            throw new Error("Simulated critical failure!");
        }
        console.log(" [2] 'try' completed successfully.");
        return "SUCCESS_RESULT";
    } catch (error) {
        console.log(" [3] Caught in 'catch' block:", error.message);
        return "ERROR_RESULT";
    } finally {
        // ALWAYS runs, even after returns! Ideal for cleanup (closing DB connection, releasing lock)
        console.log(" [4] 'finally' cleanup block executed.");
    }
}

console.log("Execution WITHOUT error:");
testTryCatchFinally(false);

console.log("\nExecution WITH error:");
testTryCatchFinally(true);

console.log();

// ----------------------------------------------------------------------------
// 2. DISPATCHING BUILT-IN STANDARD ERROR TYPES
// ----------------------------------------------------------------------------
console.log("--- 2. NATIVE JAVASCRIPT ERROR TYPES ---");

function inspectError(fn) {
    try {
        fn();
    } catch (error) {
        console.log(`Type: [${error.name}] => Message: ${error.message}`);
    }
}

// TypeError:
inspectError(() => {
    const user = null;
    // @ts-ignore
    user.getName();
});

// SyntaxError (Parsing invalid JSON):
inspectError(() => {
    JSON.parse("{invalid_json_format}");
});

// RangeError:
inspectError(() => {
    new Array(-5);
});

console.log();

// ----------------------------------------------------------------------------
// 3. ENTERPRISE CUSTOM ERROR HIERARCHY
// ----------------------------------------------------------------------------
console.log("--- 3. ENTERPRISE CUSTOM ERROR HIERARCHY ---");

// Base Application Error:
class BaseAppError extends Error {
    constructor(message, statusCode, errorCode, details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 Bad Request (Validation):
class ValidationError extends BaseAppError {
    constructor(fieldErrors) {
        super("Validation Failed", 400, "ERR_VALIDATION", fieldErrors);
    }
}

// 401 Unauthorized:
class AuthenticationError extends BaseAppError {
    constructor(message = "Authentication required") {
        super(message, 401, "ERR_UNAUTHORIZED");
    }
}

// 404 Not Found:
class NotFoundError extends BaseAppError {
    constructor(resource, id) {
        super(`${resource} with ID '${id}' not found`, 404, "ERR_NOT_FOUND");
    }
}

// Simulating Express Controller with Typed Catch Dispatch:
function handleUserProfileRequest(userId) {
    if (!userId) {
        throw new ValidationError([{ field: "userId", issue: "User ID cannot be empty" }]);
    }
    if (userId === "unknown") {
        throw new NotFoundError("UserProfile", userId);
    }
    return { id: userId, username: "haris_dev" };
}

function processRequest(id) {
    try {
        const result = handleUserProfileRequest(id);
        console.log("Request succeeded:", result);
    } catch (error) {
        // Checking error types via instanceof (similar to PHP multiple catches):
        if (error instanceof ValidationError) {
            console.log(`[HTTP 400] Validation Error:`, error.details);
        } else if (error instanceof NotFoundError) {
            console.log(`[HTTP 404] Not Found Error:`, error.message);
        } else {
            console.log(`[HTTP 500] Unexpected Internal Server Error:`, error.message);
        }
    }
}

processRequest(null);      // Triggers ValidationError
processRequest("unknown"); // Triggers NotFoundError
processRequest("101");     // Succeeds

console.log();

// ----------------------------------------------------------------------------
// 4. ES2022 ERROR CAUSE (ROOT CAUSE CHAINING)
// ----------------------------------------------------------------------------
console.log("--- 4. ES2022 ERROR CAUSE (CHAINING ROOT CAUSES) ---");

function queryDatabase() {
    // Low-level database failure:
    throw new Error("TCP Connection Timeout: Port 5432 unreachable");
}

function fetchUserAccount() {
    try {
        queryDatabase();
    } catch (dbError) {
        // Wrap low-level DB error inside a high-level domain error, preserving cause:
        throw new Error("Unable to retrieve user account from persistent storage", {
            cause: dbError
        });
    }
}

try {
    fetchUserAccount();
} catch (highLevelError) {
    console.log("High-level message:", highLevelError.message);
    // Accessing the underlying root cause:
    console.log("Underlying cause:  ", highLevelError.cause.message);
}

console.log();

// ----------------------------------------------------------------------------
// 5. ES2019 OPTIONAL CATCH BINDING
// ----------------------------------------------------------------------------
console.log("--- 5. ES2019 OPTIONAL CATCH BINDING ---");

// In ES2019, if you don't need the error object, you can omit '(error)':
function isValidJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch {
        // Notice: no (e) parameter required!
        return false;
    }
}

console.log("Is valid JSON ('{\"ok\":true}'):", isValidJson('{"ok":true}')); // true
console.log("Is valid JSON ('not_json'):     ", isValidJson('not_json'));      // false

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. ERROR HANDLING CHEAT SHEET ---");
console.table([
    { Feature: "throw new Error(msg)", Purpose: "Instantiates error object with full stack trace" },
    { Feature: "instanceof CustomError", Purpose: "Type-checking errors in single catch block (PHP style)" },
    { Feature: "new Error(msg, {cause})", Purpose: "ES2022 chaining low-level root cause to domain error" },
    { Feature: "try {} catch {}", Purpose: "ES2019 optional catch binding when error object is unused" },
    { Feature: "finally {}", Purpose: "Guaranteed cleanup block (runs even after return statements)" }
]);

console.log("Module 19 loaded and executed successfully.\n");

