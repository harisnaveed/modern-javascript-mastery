/**
 * ============================================================================
 * MODULE 04: Default Parameters & The Falsy Trap
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 01 (Variables), Module 03 (Arrow Functions)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript (ES5 and earlier), functions could not define default
 * parameter values in their signature.
 * 
 * To provide fallbacks, developers relied on the Logical OR (`||`) idiom:
 * 
 *     function setVolume(level) {
 *         level = level || 50; // Intended: default to 50 if omitted
 *         return level;
 *     }
 * 
 * THE NOTORIOUS "FALSY TRAP" BUG:
 * In JavaScript, the following values are "falsy":
 *   - `0`
 *   - `""` (empty string)
 *   - `false`
 *   - `null`
 *   - `undefined`
 *   - `NaN`
 * 
 * Because `||` checks for *any falsy value*, if a user called:
 *     setVolume(0); // Intended: mute sound to zero
 * 
 * The evaluation became `0 || 50`, which evaluated to `50`! The user was
 * completely unable to set the volume to zero!
 * 
 * Similarly, setting an empty string prefix:
 *     function greet(prefix) { prefix = prefix || "Mr."; }
 *     greet(""); // Evaluated to "Mr." instead of preserving the empty string!
 * 
 * The ES5 Workaround was verbose and ugly:
 *     level = (typeof level !== 'undefined') ? level : 50;
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, default parameters have always existed in the function signature:
 *     function setVolume($level = 50, $muted = false) { ... }
 * - ES6 brings JavaScript into alignment with PHP, C#, and Python by allowing
 *   default values directly within the parameter declaration.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION (ES6: Default Parameters)
 * ----------------------------------------------------------------------------
 * In ES6, you assign defaults directly in the function signature:
 * 
 *     function setVolume(level = 50) { return level; }
 * 
 * CRITICAL RULE:
 * The default value is triggered **ONLY if the argument is `undefined`** (or omitted).
 * Passing `0`, `""`, `false`, or `NaN` is treated as a valid value and will NOT
 * trigger the default!
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `undefined` vs `null`
 *    - `setVolume(undefined)` -> triggers default (returns 50).
 *    - `setVolume(null)` -> does NOT trigger default (returns null).
 *    - Remember: `null` is an intentional assignment of "no value".
 * 
 * Gotcha 2: Lazy Evaluation (Evaluated at Call-Time, Not Definition-Time)
 *    - In some languages (like Python with mutable defaults), default values are
 *      evaluated once when the function is defined.
 *    - In JavaScript, default expressions are evaluated fresh EVERY TIME the
 *      function is invoked. You can call functions or generate timestamps/UUIDs
 *      directly inside the default expression!
 * 
 * Gotcha 3: Parameters Can Reference Preceding Parameters
 *    - Later parameters can use earlier parameters in their default expression:
 *        function calculateBox(width = 10, height = width * 2) { ... }
 *    - However, earlier parameters CANNOT reference later parameters (TDZ error):
 *        function bad(width = height, height = 20) { ... } // ReferenceError!
 * 
 * Gotcha 4: Destructuring Defaults with Fallback Object (`= {}`)
 *    - When destructuring an options object:
 *        function setup({ host = 'localhost', port = 8080 } = {})
 *    - The `= {}` at the end prevents a `TypeError: Cannot destructure property
 *      of undefined` if the function is called with zero arguments: `setup()`.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React Component Props:
 *     function AlertModal({ isOpen = false, type = "info", onClose = () => {} })
 * - Next.js / Express API Route Handlers (Pagination):
 *     async function getPosts(page = 1, limit = 20, sortBy = "created_at")
 * - Utility functions and service configurations.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 04: Default Parameters & The Falsy Trap");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. THE OLD ES5 "FALSY TRAP" VS ES6 DEFAULTS
// ----------------------------------------------------------------------------
console.log("--- 1. THE FALSY TRAP BUG IN ES5 VS ES6 ---");

// The broken ES5 approach using logical OR (||):
function setVolumeOld(level) {
    level = level || 50;
    return level;
}

console.log("ES5 setVolumeOld(undefined):", setVolumeOld(undefined)); // 50 (expected)
console.log("ES5 setVolumeOld(0) [BUG!]: ", setVolumeOld(0));         // 50 (BUG! Should be 0)

// The modern ES6 approach:
function setVolumeModern(level = 50) {
    return level;
}

console.log("ES6 setVolumeModern(undefined):", setVolumeModern(undefined)); // 50 (expected)
console.log("ES6 setVolumeModern(0) [FIXED!]:", setVolumeModern(0));         // 0 (correct!)
console.log("ES6 setVolumeModern():         ", setVolumeModern());          // 50 (correct!)

console.log();

// ----------------------------------------------------------------------------
// 2. UNDEFINED VS NULL BEHAVIOR
// ----------------------------------------------------------------------------
console.log("--- 2. UNDEFINED VS NULL IN DEFAULT PARAMETERS ---");

function createUser(name = "Anonymous Guest", role = "Viewer") {
    return { name, role };
}

// Omitted arguments:
console.log("Omitted args:      ", createUser());

// Explicit undefined triggers the default:
console.log("Explicit undefined:", createUser(undefined, "Admin"));

// Explicit null does NOT trigger default (null is preserved as a value):
console.log("Explicit null:     ", createUser(null, null));

console.log();

// ----------------------------------------------------------------------------
// 3. LAZY EVALUATION & DYNAMIC DEFAULT EXPRESSIONS
// ----------------------------------------------------------------------------
console.log("--- 3. LAZY EVALUATION (DYNAMIC CALL-TIME EVALUATION) ---");

let callCount = 0;
function generateRequestId() {
    callCount++;
    return `REQ-${Date.now()}-${callCount}`;
}

// generateRequestId() is called ONLY when requestId is omitted:
function logApiRequest(endpoint, requestId = generateRequestId()) {
    console.log(`[API Log] Request: ${endpoint} | Tracking ID: ${requestId}`);
}

logApiRequest("/api/users");
logApiRequest("/api/products");
logApiRequest("/api/checkout", "CUSTOM-TRACK-999"); // Custom ID overrides default

console.log();

// ----------------------------------------------------------------------------
// 4. DEPENDING ON PRECEDING PARAMETERS
// ----------------------------------------------------------------------------
console.log("--- 4. PARAMETERS REFERENCING EARLIER PARAMETERS ---");

function createTaxInvoice(price, taxRate = 0.15, taxAmount = price * taxRate, total = price + taxAmount) {
    return {
        basePrice: price,
        taxRate: `${taxRate * 100}%`,
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2)
    };
}

console.log("Invoice 1 (auto-calculated tax & total):", createTaxInvoice(100));
console.log("Invoice 2 (custom tax rate 20%):        ", createTaxInvoice(100, 0.20));

// Gotcha: Earlier parameters cannot reference later parameters:
function invalidOrder(a = b, b = 10) {
    return a + b;
}
try {
    invalidOrder();
} catch (error) {
    console.log("Earlier param referencing later param error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 5. COMBINING DEFAULT PARAMETERS WITH OBJECT DESTRUCTURING
// ----------------------------------------------------------------------------
console.log("--- 5. DESTRUCTURING DEFAULTS WITH EMPTY OBJECT FALLBACK ---");

/**
 * Notice two levels of defaults here:
 * 1. Internal property defaults: method = "GET", headers = {}, timeout = 5000
 * 2. Outer object default: `= {}`
 * 
 * If `= {}` is omitted and the caller runs `request("/api")`, JavaScript will
 * throw: "TypeError: Cannot destructure property of undefined"!
 */
function apiRequest(url, { method = "GET", headers = {}, timeout = 5000 } = {}) {
    console.log(`Connecting to ${url} [${method}] with timeout ${timeout}ms.`);
}

// Call with full options:
apiRequest("/api/posts", { method: "POST", timeout: 10000 });

// Call with partial options:
apiRequest("/api/posts", { method: "DELETE" });

// Call with ZERO options (made possible by '= {}'):
apiRequest("/api/posts");

console.log();

// ----------------------------------------------------------------------------
// 6. REAL-WORLD REACT COMPONENT PROPS PATTERN
// ----------------------------------------------------------------------------
console.log("--- 6. REACT COMPONENT PROPS MOCKUP ---");

// This is how modern React components handle default props without deprecated defaultProps:
function Button({
    label = "Click Here",
    variant = "primary",
    isDisabled = false,
    onClick = () => console.log("Default button click handler triggered")
} = {}) {
    console.log("Rendering <Button /> with props:", { label, variant, isDisabled });
    onClick();
}

Button();
Button({ label: "Submit Form", variant: "success" });

console.log();

// ----------------------------------------------------------------------------
// 7. SUMMARY & CHEAT SHEET
// ----------------------------------------------------------------------------
console.log("--- 7. SUMMARY TABLE: DEFAULT PARAMETER BEHAVIOR ---");
console.table([
    { ArgumentPassed: "Omitted (not provided)", DefaultTriggered: "YES", FinalValue: "Default value" },
    { ArgumentPassed: "undefined",              DefaultTriggered: "YES", FinalValue: "Default value" },
    { ArgumentPassed: "0 (Zero)",               DefaultTriggered: "NO",  FinalValue: "0" },
    { ArgumentPassed: "'' (Empty String)",      DefaultTriggered: "NO",  FinalValue: "''" },
    { ArgumentPassed: "false",                  DefaultTriggered: "NO",  FinalValue: "false" },
    { ArgumentPassed: "null",                   DefaultTriggered: "NO",  FinalValue: "null" },
    { ArgumentPassed: "NaN",                    DefaultTriggered: "NO",  FinalValue: "NaN" }
]);

console.log("Module 04 loaded and executed successfully.\n");

