/**
 * ============================================================================
 * MODULE 09: Objects & Modern Object Methods
 * Specification: ECMAScript 2015 (ES6) / ES2017 / ES2019
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 05 (Destructuring), Module 06 (Spread/Rest)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * A) Verbose Object Literals:
 *    - In ES5, object creation was plagued by redundant identifiers:
 *        var user = { name: name, age: age, greet: function() { ... } };
 * 
 * B) Dynamic Property Names Were Clunky:
 *    - You could not define a dynamic key directly inside an object literal.
 *    - You had to create the object first, then assign with square brackets:
 *        var obj = {};
 *        obj["dynamic_" + id] = "value";
 * 
 * C) The `for...in` Prototype Pollution Hazard:
 *    - Iterating object keys using `for (var key in obj)` traversed not just
 *      the object's own properties, but also all inherited prototype properties!
 *    - Developers were forced to add defensive checks on every iteration:
 *        if (obj.hasOwnProperty(key)) { ... }
 * 
 * D) Lack of Functional Object Utilities:
 *    - Transforming an object (e.g., filtering out keys, converting keys to
 *      uppercase) required manual loops. ES5 had no native way to turn an
 *      object into key-value pairs and back again.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - JavaScript objects serve the same role as PHP associative arrays:
 *     JavaScript:  `const user = { name: "Haris", role: "Dev" };`
 *     PHP:         `$user = ["name" => "Haris", "role" => "Dev"];`
 * - Direct PHP method equivalents:
 *     `Object.keys(obj)`        <==> `array_keys($arr)`
 *     `Object.values(obj)`      <==> `array_values($arr)`
 *     `Object.entries(obj)`     <==> Converting associative array to list of [$k, $v]
 *     `Object.fromEntries(arr)` <==> `array_combine()` / building associative array
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION: ENHANCED OBJECT LITERALS & STATIC METHODS
 * ----------------------------------------------------------------------------
 * 1. Enhanced Object Literals:
 *    - Property Shorthand: `{ name, age }` when variable name matches key.
 *    - Method Shorthand: `{ greet() { ... } }` omitting the `function` keyword.
 *    - Computed Property Names: `{ [dynamicExpression]: value }` inside the literal.
 * 
 * 2. Modern Static Object Methods:
 *    - `Object.keys()`: Returns array of own enumerable string keys.
 *    - `Object.values()`: Returns array of own property values.
 *    - `Object.entries()`: Returns array of `[key, value]` pairs.
 *    - `Object.fromEntries()`: Converts `[key, value]` pairs back into an object!
 *    - `Object.freeze()`: Makes an object read-only (shallow).
 *    - `Object.seal()`: Prevents adding/deleting keys, but allows editing existing values.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `Object.freeze()` is SHALLOW!
 *    - `Object.freeze(user)` prevents changing `user.name`.
 *    - But if `user.address` is an object, `user.address.city` CAN STILL BE MUTATED!
 *    - Solution: Implement a recursive `deepFreeze()` helper.
 * 
 * Gotcha 2: Object.freeze() in Strict Mode
 *    - In non-strict mode, mutating a frozen object fails silently.
 *    - In strict mode (`"use strict"` or inside ES modules), it throws a `TypeError`.
 * 
 * Gotcha 3: `freeze` vs `seal`
 *    - `Object.freeze()`: Read-only. Cannot add, delete, or modify properties.
 *    - `Object.seal()`: Cannot add or delete properties, but CAN modify existing values.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React Dynamic Form Handling (Computed Properties):
 *     const handleChange = (e) => {
 *         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
 *     };
 * - Filtering / Transforming API Payloads:
 *     // Remove all null or undefined properties before sending to backend:
 *     const cleanPayload = Object.fromEntries(
 *         Object.entries(formState).filter(([_, val]) => val != null)
 *     );
 * - Freezing Initial Redux State or Environment Configurations.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 09: Objects & Modern Object Methods");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. ENHANCED OBJECT LITERALS: SHORTHAND & COMPUTED PROPERTIES
// ----------------------------------------------------------------------------
console.log("--- 1. ENHANCED OBJECT LITERALS ---");

const username = "haris_fullstack";
const email = "haris@dev.com";
const roleKey = "user_role";

const user = {
    // 1. Property Shorthand (instead of username: username):
    username,
    email,

    // 2. Computed Property Name (evaluated dynamically):
    [roleKey]: "Lead Engineer",
    [`meta_${Date.now()}`]: "GeneratedAtRuntime",

    // 3. Method Shorthand (instead of greet: function() {}):
    greet() {
        return `Hello, I'm @${this.username} (${this[roleKey]})`;
    }
};

console.log("Created user with shorthand & computed keys:", user);
console.log("Invoking method shorthand:", user.greet());

console.log();

// ----------------------------------------------------------------------------
// 2. OBJECT.KEYS, OBJECT.VALUES, OBJECT.ENTRIES
// ----------------------------------------------------------------------------
console.log("--- 2. OBJECT REFLECTION: KEYS, VALUES, ENTRIES ---");

const productInventory = {
    macbook: 12,
    iphone: 45,
    ipad: 18,
    airpods: 80
};

// Object.keys(): Array of property names:
const productList = Object.keys(productInventory);
console.log("Object.keys():  ", productList); // ['macbook', 'iphone', 'ipad', 'airpods']

// Object.values(): Array of property values:
const stockCounts = Object.values(productInventory);
console.log("Object.values():", stockCounts); // [12, 45, 18, 80]
const totalStock = stockCounts.reduce((sum, count) => sum + count, 0);
console.log("Total units in stock:", totalStock);

// Object.entries(): Array of [key, value] pairs:
const inventoryPairs = Object.entries(productInventory);
console.log("Object.entries():", inventoryPairs);

console.log();

// ----------------------------------------------------------------------------
// 3. OBJECT.FROMENTRIES: THE REVERSE OF ENTRIES()
// ----------------------------------------------------------------------------
console.log("--- 3. OBJECT TRANSFORMATION PIPELINES (FROM-ENTRIES) ---");

// Real-world scenario: We receive a user query with dirty/empty parameters.
// We want to: 1) Convert to entries, 2) Filter out null/empty strings, 3) Rebuild object.
const rawSearchQuery = {
    category: "Laptops",
    brand: "Apple",
    minPrice: "",        // Empty string - should be stripped
    maxPrice: "2500",
    inStockOnly: "true",
    couponCode: null    // Null - should be stripped
};

const cleanSearchQuery = Object.fromEntries(
    Object.entries(rawSearchQuery).filter(([key, value]) => {
        return value !== "" && value !== null && value !== undefined;
    })
);

console.log("Raw query with empty fields:  ", rawSearchQuery);
console.log("Clean query (fromEntries):    ", cleanSearchQuery);

// Another transformation: Double the stock of all products:
const boostedInventory = Object.fromEntries(
    Object.entries(productInventory).map(([item, count]) => [item, count * 2])
);
console.log("Boosted inventory:            ", boostedInventory);

console.log();

// ----------------------------------------------------------------------------
// 4. OBJECT.FREEZE VS OBJECT.SEAL
// ----------------------------------------------------------------------------
console.log("--- 4. OBJECT.FREEZE VS OBJECT.SEAL ---");

// A) Object.seal():
// - Cannot add new properties.
// - Cannot delete properties.
// - CAN modify existing writable properties!
const sealedConfig = {
    theme: "dark",
    version: 1
};
Object.seal(sealedConfig);

sealedConfig.theme = "light";    // ALLOWED: modifying existing property
// @ts-ignore
sealedConfig.newProp = "test";   // SILENTLY IGNORED (or throws in strict mode)
// @ts-ignore
delete sealedConfig.version;     // SILENTLY IGNORED

console.log("Sealed config (theme updated, but no additions/deletions):", sealedConfig);

// B) Object.freeze():
// - Completely read-only! Cannot add, delete, or modify any property.
const frozenConfig = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    nested: { env: "production" } // Nested object!
};
Object.freeze(frozenConfig);

// @ts-ignore
frozenConfig.timeout = 10000;    // Ignored!
console.log("Frozen timeout unchanged:", frozenConfig.timeout); // 5000

// THE SHALLOW GOTCHA:
frozenConfig.nested.env = "staging"; // MUTATION SUCCEEDS on nested object!
console.log("Frozen nested object (MUTATED!):", frozenConfig.nested.env); // "staging"

console.log();

// ----------------------------------------------------------------------------
// 5. DEEP FREEZE UTILITY (TRUE IMMUTABILITY)
// ----------------------------------------------------------------------------
console.log("--- 5. RECURSIVE DEEP FREEZE IMPLEMENTATION ---");

function deepFreeze(obj) {
    // Retrieve all property names defined on obj:
    const propNames = Reflect.ownKeys(obj);

    // Freeze properties before freezing self:
    for (const name of propNames) {
        const value = obj[name];
        if ((typeof value === "object" || typeof value === "function") && value !== null) {
            deepFreeze(value); // Recursively freeze nested objects
        }
    }

    return Object.freeze(obj);
}

const immutableAppConfig = deepFreeze({
    appName: "EnterpriseCloud",
    database: {
        host: "db.internal",
        credentials: { maxConnections: 50 }
    }
});

// Attempting to mutate nested property:
try {
    "use strict";
    // @ts-ignore
    immutableAppConfig.database.credentials.maxConnections = 100;
} catch (error) {
    console.log("Caught deep freeze mutation error:", error.message);
}

console.log("Deep frozen config protected:", immutableAppConfig.database.credentials);

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. OBJECT UTILITIES CHEAT SHEET ---");
console.table([
    { Method: "Object.keys(obj)", Returns: "string[]", Purpose: "Get all property names" },
    { Method: "Object.values(obj)", Returns: "any[]", Purpose: "Get all property values" },
    { Method: "Object.entries(obj)", Returns: "[k, v][]", Purpose: "Get key-value pairs for transformations" },
    { Method: "Object.fromEntries(pairs)", Returns: "object", Purpose: "Reconstruct object from key-value pairs" },
    { Method: "Object.freeze(obj)", Returns: "object", Purpose: "Shallow read-only lock (no edits/adds/deletes)" },
    { Method: "Object.seal(obj)", Returns: "object", Purpose: "Lock structure (edits allowed, no adds/deletes)" }
]);

console.log("Module 09 loaded and executed successfully.\n");

