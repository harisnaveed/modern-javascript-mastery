/**
 * ============================================================================
 * MODULE 10: Optional Chaining (?.) & Nullish Coalescing (??)
 * Specification: ECMAScript 2020 (ES11) & ES2021 (Logical Assignment)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 04 (Default Parameters), Module 09 (Objects)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * A) The Universal JavaScript Error:
 *    - `TypeError: Cannot read properties of undefined (reading 'x')` has
 *      crashed more web apps than almost any other bug in web history.
 *    - In ES5, safely accessing a deeply nested property required exhausting
 *      guard chains using logical AND (`&&`):
 *        var city = (user && user.address && user.address.geo && user.address.geo.city)
 *                   ? user.address.geo.city : "Unknown";
 *    - This was tedious, error-prone, and visually polluted codebases.
 * 
 * B) The Falsy Trap with Default Values (`||`):
 *    - When providing fallbacks, developers historically used the OR operator (`||`):
 *        var speed = config.speed || 100;
 *    - If `config.speed` was intentionally set to `0` (stationary), JavaScript
 *      treated `0` as falsy and wrongly forced `speed` to `100`!
 *    - The same bug occurred with boolean `false` and empty string `""`.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP 7.0, the Null Coalescing Operator (`??`) was added:
 *     $port = $config['port'] ?? 8080;
 * - In PHP 8.0, the Nullsafe Operator (`?->`) was introduced:
 *     $country = $user?->address?->country;
 * - In ECMAScript 2020, JavaScript natively implemented identical semantics:
 *     `?.` for safe chained property and method access.
 *     `??` for strict nullish fallback (checking only null and undefined).
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION (ES2020: ?. and ??)
 * ----------------------------------------------------------------------------
 * - Optional Chaining (`?.`):
 *   Safely reads deeply nested properties without having to validate each
 *   reference. If any link in the chain is `null` or `undefined`, the expression
 *   short-circuits and immediately evaluates to `undefined`.
 *   - Property access: `obj?.prop`
 *   - Dynamic property: `obj?.[expr]`
 *   - Method call: `obj?.method?.()`
 * 
 * - Nullish Coalescing (`??`):
 *   Returns the right-hand operand ONLY when the left-hand operand is `null` or
 *   `undefined`. It safely preserves valid falsy values: `0`, `false`, `""`, `NaN`.
 * 
 * - Logical Assignment Operators (ES2021):
 *   `a ??= b` (Assigns `b` to `a` only if `a` is null or undefined).
 *   `a ||= b` (Assigns `b` to `a` if `a` is falsy).
 *   `a &&= b` (Assigns `b` to `a` if `a` is truthy).
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Optional Chaining Short-Circuits Completely
 *    - In `a?.b(computeSomething())`, if `a` is nullish, `computeSomething()`
 *      is NEVER executed.
 * 
 * Gotcha 2: Cannot Use `?.` on the Left-Hand Side of Assignment
 *    - `user?.name = "Haris";` -> SyntaxError: Invalid left-hand side in assignment.
 *    - Optional chaining is for READING data, not WRITING.
 * 
 * Gotcha 3: The Golden Pair (`?.` combined with `??`)
 *    - `const city = user?.address?.geo?.city ?? "Default City";`
 *    - Safely traverses nested properties AND provides a clean fallback.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React JSX Rendering of Async API Data:
 *     <h1>{user?.profile?.name ?? "Anonymous Guest"}</h1>
 *     <p>{order?.items?.[0]?.productName ?? "No items found"}</p>
 * - Optional Event Handlers in Component Props:
 *     // Safely calls onClick if parent passed it; does nothing if omitted:
 *     props.onClick?.();
 * - API Options and Config Parsing:
 *     const timeout = options.timeout ?? 5000;
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 10: Optional Chaining (?.) & Nullish Coalescing (??)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. OPTIONAL CHAINING: PROPERTY, ARRAY & METHOD ACCESS
// ----------------------------------------------------------------------------
console.log("--- 1. OPTIONAL CHAINING DEEP ACCESS ---");

const customerA = {
    id: 101,
    name: "Haris Ali",
    address: {
        city: "Wah Cantt",
        zip: 47040
    },
    orders: [
        { orderId: "ORD-99", total: 250 }
    ],
    getGreeting() {
        return `Hello, ${this.name}!`;
    }
};

const customerB = {
    id: 102,
    name: "Unregistered Visitor"
    // address is omitted (undefined)
    // orders is omitted (undefined)
    // getGreeting is omitted (undefined)
};

// A) Safe Property Access:
console.log("Customer A City:", customerA?.address?.city); // "Wah Cantt"
console.log("Customer B City:", customerB?.address?.city); // undefined (No crash!)

// B) Safe Dynamic Property / Array Indexing:
console.log("Customer A First Order:", customerA?.orders?.[0]?.orderId); // "ORD-99"
console.log("Customer B First Order:", customerB?.orders?.[0]?.orderId); // undefined (No crash!)

// C) Safe Optional Function / Method Calls:
console.log("Customer A Greeting:", customerA?.getGreeting?.()); // "Hello, Haris Ali!"
console.log("Customer B Greeting:", customerB?.getGreeting?.()); // undefined (No crash!)

console.log();

// ----------------------------------------------------------------------------
// 2. NULLISH COALESCING (??) VS LOGICAL OR (||)
// ----------------------------------------------------------------------------
console.log("--- 2. NULLISH COALESCING (??) VS LOGICAL OR (||) ---");

// Here is a game configuration object with valid zero/false settings:
const gameSettings = {
    volume: 0,             // 0 is valid (mute)
    enableMusic: false,    // false is valid (disabled)
    playerName: "",        // empty string is valid (blank name)
    difficulty: null,      // null means unconfigured
    serverPort: undefined  // undefined means unconfigured
};

console.log("Comparison Table of Fallbacks:");
console.table([
    {
        Setting: "volume (0)",
        Value: gameSettings.volume,
        LogicalOR: gameSettings.volume || 100,           // Overwrites 0 to 100 (BUG!)
        NullishCoalescing: gameSettings.volume ?? 100    // Preserves 0 (CORRECT!)
    },
    {
        Setting: "enableMusic (false)",
        Value: gameSettings.enableMusic,
        LogicalOR: gameSettings.enableMusic || true,        // Overwrites false to true (BUG!)
        NullishCoalescing: gameSettings.enableMusic ?? true // Preserves false (CORRECT!)
    },
    {
        Setting: "playerName ('')",
        Value: `"${gameSettings.playerName}"`,
        LogicalOR: gameSettings.playerName || "Anonymous",        // Overwrites "" to "Anonymous"
        NullishCoalescing: gameSettings.playerName ?? "Anonymous" // Preserves ""
    },
    {
        Setting: "difficulty (null)",
        Value: "null",
        LogicalOR: gameSettings.difficulty || "Normal",
        NullishCoalescing: gameSettings.difficulty ?? "Normal" // Both fallback to "Normal"
    },
    {
        Setting: "serverPort (undefined)",
        Value: "undefined",
        LogicalOR: gameSettings.serverPort || 8080,
        NullishCoalescing: gameSettings.serverPort ?? 8080 // Both fallback to 8080
    }
]);

console.log();

// ----------------------------------------------------------------------------
// 3. COMBINING ?. AND ?? (THE MODERN INDUSTRY STANDARD)
// ----------------------------------------------------------------------------
console.log("--- 3. COMBINING OPTIONAL CHAINING WITH NULLISH COALESCING ---");

function displayUserProfile(apiPayload) {
    // Safely reads deep hierarchy AND provides clean defaults for UI:
    const displayName = apiPayload?.user?.profile?.nickname ?? "Guest User";
    const avatarUrl   = apiPayload?.user?.profile?.avatar?.url ?? "/images/default-avatar.png";
    const points      = apiPayload?.user?.stats?.score ?? 0;
    const isVerified  = apiPayload?.user?.badges?.verified ?? false;

    console.log("UI Profile Rendered:", { displayName, avatarUrl, points, isVerified });
}

// Full data:
displayUserProfile({
    user: {
        profile: { nickname: "HarisPro", avatar: { url: "/img/haris.jpg" } },
        stats: { score: 1450 },
        badges: { verified: true }
    }
});

// Empty / Missing / Null payload:
displayUserProfile(null);
displayUserProfile({ user: {} });

console.log();

// ----------------------------------------------------------------------------
// 4. SHORT-CIRCUIT EVALUATION DEMONSTRATION
// ----------------------------------------------------------------------------
console.log("--- 4. SHORT-CIRCUIT EVALUATION ---");

let executionCounter = 0;
function expensiveCalculation() {
    executionCounter++;
    return "Calculated Value";
}

const nullishObject = null;

// Because nullishObject is null, the function expensiveCalculation() is NEVER called!
const result = nullishObject?.process(expensiveCalculation());
console.log("Result of optional call:", result);
console.log("Expensive function execution count:", executionCounter); // 0 (Saved CPU!)

console.log();

// ----------------------------------------------------------------------------
// 5. ES2021 LOGICAL ASSIGNMENT OPERATORS (??=, ||=, &&=)
// ----------------------------------------------------------------------------
console.log("--- 5. ES2021 LOGICAL ASSIGNMENT OPERATORS ---");

const appState = {
    title: "Dashboard",
    retryLimit: null,     // Unconfigured
    activeFilter: 0,      // Valid zero
    userNotes: ""         // Valid empty string
};

// Nullish Assignment (??=): Assigns ONLY if current value is null or undefined:
appState.retryLimit ??= 3; // Assigned because it was null!
appState.activeFilter ??= 10; // NOT assigned because 0 is not nullish!

console.log("After ??= assignment:", {
    retryLimit: appState.retryLimit,     // 3
    activeFilter: appState.activeFilter  // 0 (preserved!)
});

// Logical OR Assignment (||=): Assigns if current value is falsy:
appState.userNotes ||= "No notes recorded."; // Assigned because "" is falsy!
console.log("After ||= assignment userNotes:", appState.userNotes);

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. OPERATOR SUMMARY CHEAT SHEET ---");
console.table([
    { Operator: "a?.b", Name: "Optional Chaining", Behavior: "Stops and returns undefined if 'a' is null/undefined" },
    { Operator: "a?.[key]", Name: "Dynamic Optional Chaining", Behavior: "Safely accesses dynamic key or array index" },
    { Operator: "a?.()", Name: "Optional Call", Behavior: "Calls function only if it exists and is callable" },
    { Operator: "a ?? b", Name: "Nullish Coalescing", Behavior: "Returns 'b' only if 'a' is null or undefined" },
    { Operator: "a || b", Name: "Logical OR", Behavior: "Returns 'b' if 'a' is ANY falsy value (0, false, '')" },
    { Operator: "a ??= b", Name: "Nullish Assignment", Behavior: "Assigns 'b' to 'a' only if 'a' is null/undefined" }
]);

console.log("Module 10 loaded and executed successfully.\n");

