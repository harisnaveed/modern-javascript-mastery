/**
 * ============================================================================
 * MODULE 17: Set, Map, WeakMap & WeakSet Collections
 * Specification: ECMAScript 2015 (ES6) / ES2024
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 09 (Objects), Module 15 (Prototypes)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript, developers had only TWO data structures for collections:
 *   - Plain Objects (`{}`) for key-value dictionaries.
 *   - Arrays (`[]`) for ordered lists.
 * 
 * WHY PLAIN OBJECTS AS MAPS FAILED:
 * A) String-Only Keys:
 *    - In plain objects, keys are ALWAYS coerced into strings or symbols.
 *    - If you used an object or DOM node as a key:
 *        var map = {};
 *        map[userA] = 10;
 *        map[userB] = 20; // userA and userB both coerce to "[object Object]"!
 *        // userB silently overwrote userA!
 * 
 * B) Prototype Pollution & Accidental Keys:
 *    - Plain objects inherit properties like `toString`, `valueOf`, and `constructor`
 *      from `Object.prototype`. Checking `'toString' in map` was true even if never set!
 * 
 * C) No Direct Size Property:
 *    - To know how many keys an object has, you had to run `Object.keys(obj).length`,
 *      an O(N) operation that iterates all properties.
 * 
 * WHY ARRAYS AS SETS FAILED:
 * - Checking if an array contains an item requires an O(N) linear search (`indexOf`).
 * - Deduplicating an array required complex, slow loops or filters.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, associative arrays serve as maps, and `SplObjectStorage` allows
 *   storing object keys.
 * - In modern JavaScript:
 *     - `Set`: A collection of UNIQUE values (any type).
 *     - `Map`: A collection of key-value pairs where keys can be ANY type (objects, functions, numbers).
 *     - `WeakMap` / `WeakSet`: Memory-safe collections whose keys are weakly held,
 *       allowing garbage collection when no other references exist.
 *
 *
 * 3. THE MODERN JAVASCRIPT COLLECTIONS
 * ----------------------------------------------------------------------------
 * - `Set`:
 *   - Methods: `.add(val)`, `.has(val)`, `.delete(val)`, `.clear()`, `.size`
 *   - Array Deduplication: `const unique = [...new Set(array)];`
 * 
 * - `Map`:
 *   - Methods: `.set(key, val)`, `.get(key)`, `.has(key)`, `.delete(key)`, `.clear()`, `.size`
 *   - Directly iterable: `for (const [key, val] of map)`
 * 
 * - `WeakMap` & `WeakSet`:
 *   - Keys MUST be Objects (primitives are forbidden).
 *   - Entries are held "weakly": If the key object has no other references in
 *     your app, the engine's Garbage Collector automatically purges the entry from RAM!
 *   - NOT iterable (no `.size`, no `.keys()`, no `for...of`).
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Object Reference Equality in Sets & Maps
 *    - `Set` and `Map` use the `SameValueZero` algorithm.
 *    - Two distinct object references with identical contents are NOT duplicates:
 *        set.add({ id: 1 }); set.add({ id: 1 }); // Size is 2! (Different memory addresses)
 * 
 * Gotcha 2: Why WeakMap Has No `.size` or Iteration
 *    - Because the Garbage Collector runs non-deterministically in the background,
 *      exposing `.size` or keys would make your code behave unpredictably depending
 *      on whether V8 has run garbage collection this millisecond or not!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React UI State: Deduplicating selected tags, IDs, or search filters.
 * - DOM Node Metadata via WeakMap: Storing custom listener or state data associated
 *   with DOM elements without causing memory leaks when elements are removed.
 * - Caching / Memoization with non-string keys: Using complex query objects as Map keys.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 17: Set, Map, WeakMap & WeakSet Collections");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SET: UNIQUE VALUE COLLECTIONS & FAST LOOKUPS
// ----------------------------------------------------------------------------
console.log("--- 1. SET: UNIQUENESS & DEDUPLICATION ---");

// Array with duplicate values:
const rawUserRoles = ["editor", "viewer", "editor", "admin", "viewer", "superadmin"];
console.log("Original array with duplicates:", rawUserRoles);

// One-liner array deduplication using Set and Spread:
const uniqueRoles = [...new Set(rawUserRoles)];
console.log("Deduplicated array (via Set):  ", uniqueRoles);

// Creating and mutating a Set:
const tagSet = new Set();
tagSet.add("javascript");
tagSet.add("react");
tagSet.add("nextjs");
tagSet.add("react"); // Duplicate: silently ignored!

console.log("Set size (duplicates ignored):", tagSet.size); // 3
console.log("Has 'react'?                  ", tagSet.has("react")); // true (O(1) instant lookup!)
console.log("Has 'angular'?                ", tagSet.has("angular")); // false

tagSet.delete("nextjs");
console.log("After deleting 'nextjs':      ", [...tagSet]);

console.log();

// ----------------------------------------------------------------------------
// 2. MAP: ARBITRARY KEYS & DIRECT ITERATION
// ----------------------------------------------------------------------------
console.log("--- 2. MAP: ARBITRARY KEY-VALUE STORAGE ---");

// In plain objects, these two objects would collide into "[object Object]".
// In Map, every object is a distinct, valid key:
const userAlice = { id: 101, name: "Alice" };
const userBob   = { id: 102, name: "Bob" };

const userPermissions = new Map();

// Using objects and functions as keys:
userPermissions.set(userAlice, ["READ", "WRITE"]);
userPermissions.set(userBob, ["READ"]);
userPermissions.set(404, "Not Found Status"); // Number as key

console.log("Alice's permissions:  ", userPermissions.get(userAlice));
console.log("Bob's permissions:    ", userPermissions.get(userBob));
console.log("Numeric key 404:      ", userPermissions.get(404));
console.log("Map size (O(1) lookup):", userPermissions.size); // 3

// Direct iteration with for...of (clean destructuring):
console.log("Iterating Map entries:");
for (const [key, value] of userPermissions) {
    const keyLabel = typeof key === "object" ? key.name : `Primitive (${key})`;
    console.log(` - Key: ${keyLabel} => Value:`, value);
}

console.log();

// ----------------------------------------------------------------------------
// 3. OBJECT VS MAP BENCHMARK COMPARISON
// ----------------------------------------------------------------------------
console.log("--- 3. OBJECT VS MAP CONVERSION ---");

// Converting an Object to a Map:
const appConfig = { host: "localhost", port: 3000, secure: true };
const configMap = new Map(Object.entries(appConfig));
console.log("Converted Object -> Map:", configMap.get("host"));

// Converting a Map back to an Object:
const restoredObject = Object.fromEntries(configMap);
console.log("Converted Map -> Object:", restoredObject);

console.log();

// ----------------------------------------------------------------------------
// 4. WEAKMAP: MEMORY-SAFE CACHING & ZERO MEMORY LEAKS
// ----------------------------------------------------------------------------
console.log("--- 4. WEAKMAP: GARBAGE-COLLECTABLE ASSOCIATIONS ---");

// WeakMap keys MUST be objects:
const visitCounts = new WeakMap();

let sessionUser = { username: "haris_visitor" };

// Attach metadata to sessionUser without modifying the object itself:
visitCounts.set(sessionUser, 1);
console.log("Session visits for user:  ", visitCounts.get(sessionUser)); // 1

visitCounts.set(sessionUser, 2);
console.log("Updated visits:           ", visitCounts.get(sessionUser)); // 2

// SIMULATING USER LOGOUT / DISPOSAL:
// If sessionUser is set to null, the object is dereferenced.
// In a normal Map, the object would stay trapped in memory forever (Memory Leak!).
// In a WeakMap, the entry will be automatically purged by the Garbage Collector!
sessionUser = null;
console.log("User dereferenced. WeakMap will release memory automatically.");

console.log();

// ----------------------------------------------------------------------------
// 5. WEAKSET: TRACKING OBJECT INSTANCES
// ----------------------------------------------------------------------------
console.log("--- 5. WEAKSET: TRACKING ACTIVE OBJECTS ---");

const activeConnections = new WeakSet();

let socketA = { socketId: "SOCK-1" };
let socketB = { socketId: "SOCK-2" };

activeConnections.add(socketA);
activeConnections.add(socketB);

console.log("Is socketA active? ", activeConnections.has(socketA)); // true

// Disconnecting socketA:
socketA = null; // Cleaned up from memory automatically!

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. COLLECTIONS COMPARISON CHEAT SHEET ---");
console.table([
    { Collection: "Set", KeyType: "Values only (any type)", Iterable: "Yes", HasSize: "Yes", MemoryBehavior: "Strong reference" },
    { Collection: "Map", KeyType: "Any type (objects, primitives)", Iterable: "Yes", HasSize: "Yes", MemoryBehavior: "Strong reference" },
    { Collection: "WeakMap", KeyType: "Objects ONLY", Iterable: "No", HasSize: "No", MemoryBehavior: "Weak (Auto Garbage Collected)" },
    { Collection: "WeakSet", KeyType: "Objects ONLY", Iterable: "No", HasSize: "No", MemoryBehavior: "Weak (Auto Garbage Collected)" }
]);

console.log("Module 17 loaded and executed successfully.\n");
