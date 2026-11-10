/**
 * ============================================================================
 * MODULE 20: JSON Serialization, Parsing & Deep Cloning
 * Specification: ECMAScript 5.1 / HTML Standard (structuredClone)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 09 (Objects), Module 19 (Error Handling)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In the early web, data was exchanged using verbose XML documents. In the 2000s,
 * Douglas Crockford specified JSON (JavaScript Object Notation) as a lightweight,
 * human-readable text format modeled directly after JavaScript object syntax.
 * 
 * ES5 added native `JSON.stringify()` and `JSON.parse()` to the runtime engine.
 * 
 * THE HISTORICAL GOTCHAS OF JSON:
 * A) The "Fake Deep Clone" Hack:
 *    - For years, JavaScript developers used:
 *        var clone = JSON.parse(JSON.stringify(original));
 *    - This hack had severe hidden flaws:
 *      1. It completely STRIPPED functions, `undefined`, and `Symbol` keys.
 *      2. It converted `Date` objects into plain strings (never restoring them).
 *      3. It converted `NaN` and `Infinity` to `null`.
 *      4. It CRASHED with `TypeError: Converting circular structure to JSON` if
 *         any object referenced itself!
 * 
 * B) Data Loss in JSON.stringify:
 *    - In objects: `{ a: undefined, b: () => {} }` stringifies to `{}`!
 *    - In arrays: `[undefined, () => {}]` stringifies to `[null, null]`!
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP:
 *     $jsonString = json_encode($data);
 *     $arrayData  = json_decode($jsonString, true); // true = associative array
 * - In JavaScript:
 *     const jsonString = JSON.stringify(data);
 *     const objectData = JSON.parse(jsonString);
 *
 *
 * 3. ADVANCED JSON CAPABILITIES
 * ----------------------------------------------------------------------------
 * - `JSON.stringify(value, replacer, space)`:
 *   - `replacer`: A function or array that filters and transforms keys
 *     (ideal for stripping sensitive passwords or credit cards).
 *   - `space`: Indentation formatting for pretty-printing (e.g., `2` or `4`).
 *   - `.toJSON()` hook: Custom classes can declare a `.toJSON()` method to
 *     dictate exactly how their instances should serialize!
 * 
 * - `JSON.parse(text, reviver)`:
 *   - `reviver`: Intercepts key-value pairs during parsing to restore complex
 *     types (e.g., transforming ISO date strings back into authentic `Date` objects).
 * 
 * - The Modern Deep Clone Standard: `structuredClone()`:
 *   - Native global function (Node.js 17+ and all modern browsers).
 *   - Clones circular references, `Date`, `RegExp`, `Map`, `Set`, and `TypedArrays`.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Always Wrap `JSON.parse()` in a `try...catch`!
 *    - Invalid JSON throws a fatal `SyntaxError`.
 * 
 * Gotcha 2: Next.js Server-to-Client Boundary Rule
 *    - Any prop passed from a Next.js Server Component to a Client Component
 *      MUST be JSON-serializable! Passing functions or class instances throws an error.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Sending API Payloads: `fetch(url, { body: JSON.stringify(data) })`
 * - Storing Data in Browser Storage: `localStorage.setItem("user", JSON.stringify(profile))`
 * - Deep cloning nested state before mutations: `structuredClone(state)`
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 20: JSON Serialization, Parsing & Deep Cloning");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. JSON.STRINGIFY: PRETTY PRINTING & REPLACER FILTERING
// ----------------------------------------------------------------------------
console.log("--- 1. JSON.STRINGIFY WITH REPLACER & PRETTY PRINTING ---");

const userAccount = {
    id: 101,
    username: "haris_dev",
    email: "haris@dev.com",
    passwordHash: "x$993#secret_hash", // Sensitive!
    apiKey: "ak_live_88392019",         // Sensitive!
    role: "Senior Fullstack Architect",
    tags: ["javascript", "react", "nextjs"]
};

// A) Basic pretty printing (indentation = 2 spaces):
console.log("Pretty Printed JSON (first 4 lines):");
console.log(JSON.stringify(userAccount, null, 2).split("\n").slice(0, 4).join("\n") + "\n  ...");

// B) Using an Array Replacer to whitelist ONLY safe public fields:
const publicJson = JSON.stringify(userAccount, ["id", "username", "role"]);
console.log("\nWhitelisted public JSON:", publicJson);

// C) Using a Function Replacer to mask sensitive fields:
const maskedJson = JSON.stringify(userAccount, (key, value) => {
    if (key === "passwordHash" || key === "apiKey") {
        return "******** [REDACTED]";
    }
    return value;
}, 2);
console.log("\nMasked sensitive JSON:\n", maskedJson);

console.log();

// ----------------------------------------------------------------------------
// 2. THE .TOJSON() METHOD HOOK ON CLASSES
// ----------------------------------------------------------------------------
console.log("--- 2. CUSTOM SERIALIZATION VIA .TOJSON() ---");

class SecureCustomer {
    constructor(name, creditCardNumber, balance) {
        this.name = name;
        this.creditCardNumber = creditCardNumber;
        this.balance = balance;
    }

    // JSON.stringify automatically calls .toJSON() if present:
    toJSON() {
        return {
            customerName: this.name,
            maskedCard: `****-****-****-${this.creditCardNumber.slice(-4)}`,
            balanceFormatted: `$${this.balance.toFixed(2)}`
        };
    }
}

const customer = new SecureCustomer("Haris Ali", "4532119988224567", 1250.5);
console.log("Class serialized with custom toJSON():");
console.log(JSON.stringify(customer, null, 2));

console.log();

// ----------------------------------------------------------------------------
// 3. JSON.PARSE WITH A REVIVER (DATE RESTORATION)
// ----------------------------------------------------------------------------
console.log("--- 3. JSON.PARSE WITH REVIVER (RESTORING DATES) ---");

const serverPayloadJson = JSON.stringify({
    orderId: "ORD-9901",
    total: 399.99,
    createdAt: new Date("2026-11-10T12:00:00Z") // Serializes to ISO string
});

// Without reviver: 'createdAt' is just a string!
const rawParsed = JSON.parse(serverPayloadJson);
console.log("Raw parsed createdAt type:       ", typeof rawParsed.createdAt); // string
console.log("Can call rawParsed.createdAt.getFullYear()? NO (it's a string!)");

// With reviver function: Automatically re-hydrating ISO strings to Date instances:
const dateReviver = (key, value) => {
    // ISO date format regex test:
    const isIsoDate = typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
    return isIsoDate ? new Date(value) : value;
};

const hydratedPayload = JSON.parse(serverPayloadJson, dateReviver);
console.log("Hydrated parsed createdAt type:  ", typeof hydratedPayload.createdAt); // object
console.log("Is real Date instance?           ", hydratedPayload.createdAt instanceof Date); // true
console.log("Calling Date method getFullYear():", hydratedPayload.createdAt.getFullYear()); // 2026

console.log();

// ----------------------------------------------------------------------------
// 4. STRUCTUREDCLONE() VS JSON.PARSE(JSON.STRINGIFY())
// ----------------------------------------------------------------------------
console.log("--- 4. MODERN DEEP CLONING: STRUCTUREDCLONE() ---");

const complexState = {
    title: "Project Alpha",
    deadline: new Date("2026-12-31"),
    tags: new Set(["urgent", "enterprise"]),
    metadata: new Map([["priority", "P1"]])
};

// Attempting old JSON trick:
const jsonClone = JSON.parse(JSON.stringify(complexState));
console.log("Old JSON Trick on Set: ", jsonClone.tags); // {} (DATA LOST! Set became empty object!)
console.log("Old JSON Trick on Date:", typeof jsonClone.deadline); // string (Date lost!)

// Modern standard structuredClone():
const modernDeepClone = structuredClone(complexState);
console.log("structuredClone on Set: ", modernDeepClone.tags instanceof Set); // true! (Set preserved!)
console.log("structuredClone on Date:", modernDeepClone.deadline instanceof Date); // true! (Date preserved!)

// Circular reference test:
const circularObj = { name: "Root" };
// @ts-ignore
circularObj.self = circularObj; // Circular link!

try {
    JSON.stringify(circularObj);
} catch (e) {
    console.log("JSON.stringify circular error:    ", e.message);
}

// structuredClone handles circular references effortlessly:
const safeCircularClone = structuredClone(circularObj);
console.log("structuredClone circular handled? ", safeCircularClone.self === safeCircularClone); // true!

console.log();

// ----------------------------------------------------------------------------
// 5. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 5. JSON & SERIALIZATION CHEAT SHEET ---");
console.table([
    { Utility: "JSON.stringify(val, replacer, space)", Purpose: "Serializes data to JSON string with filtering and indent" },
    { Utility: "JSON.parse(str, reviver)", Purpose: "Deserializes JSON string into JS objects with type restoration" },
    { Utility: ".toJSON() method", Purpose: "Class hook to control exact serialization output" },
    { Utility: "structuredClone(obj)", Purpose: "Native deep clone preserving Dates, Sets, Maps, and circular links" }
]);

console.log("Module 20 loaded and executed successfully.\n");

