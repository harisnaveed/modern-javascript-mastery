/**
 * ============================================================================
 * MODULE 08: Array Aggregation, Searching & Immutability
 * Specification: ECMAScript 5.1 / ES6 / ES2019 / ES2023
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 07 (Array Iteration)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * A) Aggregation & Grouping Complexity:
 *    - In ES5, calculating a shopping cart total, counting frequencies, or
 *      grouping items by category required declaring mutable variables outside
 *      loops, pushing to objects, and managing state across iterations.
 * 
 * B) The Destructive Mutation Trap (.sort, .reverse, .splice):
 *    - JavaScript's native `.sort()`, `.reverse()`, and `.splice()` were designed
 *      in the 1990s to MUTATE the original array in place.
 *    - IN REACT & REDUX, THIS WAS CATASTROPHIC!
 *      If a component ran `state.items.sort()`, React saw the exact same array
 *      reference (`prevItems === nextItems`), failed to re-render the UI, and
 *      silently corrupted historical state.
 *    - Developers had to constantly remember to write: `[...items].sort()`.
 * 
 * C) The Number Sorting Bug:
 *    - By default, `.sort()` converts elements to STRINGS before sorting:
 *        [10, 5, 25, 100].sort(); // [10, 100, 25, 5] (Lexicographical sort!)
 *    - You must ALWAYS supply a comparator callback: `(a, b) => a - b`.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, arrays are value types (copy-on-write). Passing an array to a function
 *   does not mutate the caller's array unless explicitly passed by reference (`&$arr`).
 * - In JavaScript, arrays are OBJECTS passed by reference. Mutating an array inside
 *   a utility function mutates it everywhere in your application!
 * - ES2023 introduced non-mutating copy-methods (`toSorted`, `toReversed`, `toSpliced`,
 *   `with`) bringing JavaScript to a truly modern, immutable standard.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION: REDUCE & IMMUTABLE METHODS
 * ----------------------------------------------------------------------------
 * - `reduce()`: The ultimate aggregation Swiss Army Knife. Condenses an entire
 *   array into a single output: a number, string, object, or lookup map.
 * - Boolean checks: `some()` (at least one matches), `every()` (all match),
 *   `includes()` (exact primitive equality).
 * - ES2023 Immutable Methods:
 *     - `toSorted()`: Returns a sorted clone without touching the original.
 *     - `toReversed()`: Returns a reversed clone.
 *     - `toSpliced()`: Returns a clone with elements inserted/deleted.
 *     - `with()`: Returns a clone with one specific index replaced.
 * - Flattening: `flat()` (flattens nested arrays) and `flatMap()` (maps and flattens).
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Always Provide an `initialValue` to `reduce()`!
 *    - If omitted, `reduce()` sets accumulator to `array[0]` and starts at index 1.
 *    - IF THE ARRAY IS EMPTY and no initial value is passed, JavaScript throws:
 *      `TypeError: Reduce of empty array with no initial value`.
 *    - ALWAYS pass `0`, `[]`, or `{}` as the second parameter.
 * 
 * Gotcha 2: `slice()` vs `splice()`
 *    - `slice(start, end)`: Safe & non-mutating. Copies a slice of the array.
 *    - `splice(start, count, ...items)`: DESTRUCTIVE & mutating. Alters original array.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Shopping Cart Total & Tax Calculation:
 *     const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
 * - Normalizing Database Arrays into Fast O(1) Lookup Dictionaries:
 *     const userById = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
 * - React State Updates:
 *     // Updating an item at index 2 without mutating state:
 *     setTodos(prev => prev.with(2, { ...prev[2], done: true }));
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 08: Array Aggregation, Searching & Immutability");
console.log("==================================================================\n");

// Sample Dataset: Shopping Cart & Orders
const cart = [
    { id: 1, name: "Mechanical Keyboard", price: 120, qty: 1, category: "Hardware" },
    { id: 2, name: "USB-C Cable",         price: 15,  qty: 3, category: "Accessories" },
    { id: 3, name: "4K Monitor",          price: 450, qty: 2, category: "Hardware" },
    { id: 4, name: "Mousepad XXL",        price: 25,  qty: 1, category: "Accessories" }
];

// ----------------------------------------------------------------------------
// 1. REDUCE(): THE SWISS ARMY KNIFE OF AGGREGATIONS
// ----------------------------------------------------------------------------
console.log("--- 1. REDUCE: TOTALS & ACCUMULATIONS ---");

// A) Summing numeric values:
const totalPrice = cart.reduce((accumulator, item) => {
    return accumulator + (item.price * item.qty);
}, 0); // <-- Always specify initial value 0!

const totalItems = cart.reduce((count, item) => count + item.qty, 0);

console.log(`Cart Total: $${totalPrice} (${totalItems} total items)`);

// B) Grouping items by category (e.g. Hardware vs Accessories):
const groupedByCategory = cart.reduce((groups, item) => {
    const cat = item.category;
    // If category group doesn't exist yet, initialize it as empty array:
    if (!groups[cat]) {
        groups[cat] = [];
    }
    groups[cat].push(item.name);
    return groups;
}, {}); // Initial value: empty object {}

console.log("Grouped by category:", groupedByCategory);

// C) Normalizing an array into an ID lookup dictionary:
const itemsById = cart.reduce((lookup, item) => {
    lookup[item.id] = item;
    return lookup;
}, {});

console.log("Lookup item ID #3:", itemsById[3].name);

console.log();

// ----------------------------------------------------------------------------
// 2. BOOLEAN SEARCH: SOME(), EVERY(), INCLUDES()
// ----------------------------------------------------------------------------
console.log("--- 2. BOOLEAN CHECKS (SOME, EVERY, INCLUDES) ---");

// some(): True if AT LEAST ONE element matches condition:
const hasExpensiveItem = cart.some(item => item.price > 400);
console.log("Contains item over $400?  ", hasExpensiveItem); // true

// every(): True ONLY IF ALL elements match condition:
const allItemsInStock = cart.every(item => item.qty > 0);
console.log("Are all items in stock?   ", allItemsInStock);   // true

const isFreeShippingEligible = cart.every(item => item.price > 50);
console.log("Are all items over $50?   ", isFreeShippingEligible); // false

// includes(): Simple equality check for primitives:
const allowedRoles = ["admin", "superadmin", "editor"];
console.log("Is 'editor' allowed?      ", allowedRoles.includes("editor")); // true
console.log("Is 'guest' allowed?       ", allowedRoles.includes("guest"));  // false

console.log();

// ----------------------------------------------------------------------------
// 3. MUTATING SORT VS ES2023 NON-MUTATING TOSORTED()
// ----------------------------------------------------------------------------
console.log("--- 3. MUTATING VS IMMUTABLE SORTING ---");

const numbers = [40, 100, 1, 5, 25, 10];

// The Old Mutating Way (DANGEROUS IN REACT STATE):
console.log("Original numbers before sort:", numbers);
// Notice: numbers.sort() mutates the array in place!
// numbers.sort((a, b) => a - b);

// The Modern ES2023 Way: toSorted() leaves original untouched:
const sortedAscending = numbers.toSorted((a, b) => a - b);
const sortedDescending = numbers.toSorted((a, b) => b - a);

console.log("toSorted() Ascending:        ", sortedAscending);
console.log("toSorted() Descending:       ", sortedDescending);
console.log("Original numbers (UNTOUCHED):", numbers); // Original is safe!

// The string sorting gotcha:
const stringSortTrap = [10, 5, 20, 100];
console.log("Buggy default sort:          ", stringSortTrap.toSorted()); // [10, 100, 20, 5]
console.log("Fixed numerical sort:        ", stringSortTrap.toSorted((a, b) => a - b)); // [5, 10, 20, 100]

console.log();

// ----------------------------------------------------------------------------
// 4. ES2023 IMMUTABLE REVERSE, SPLICE, AND WITH()
// ----------------------------------------------------------------------------
console.log("--- 4. ES2023: TOREVERSED, TOSPLICED, AND WITH() ---");

const tags = ["javascript", "react", "nextjs", "nodejs"];

// A) toReversed():
const reversedTags = tags.toReversed();
console.log("toReversed():", reversedTags);
console.log("Original tags safe:", tags);

// B) toSpliced(): Delete or insert without mutating original:
// Syntax: toSpliced(startIndex, deleteCount, ...itemsToInsert)
const splicedTags = tags.toSpliced(1, 2, "vue", "angular");
console.log("toSpliced() (replaced react & nextjs):", splicedTags);
console.log("Original tags safe:", tags);

// C) with(): Replace an item at a specific index immutably:
// In React, this completely replaces:
//   const next = [...prev]; next[1] = "typescript"; setTags(next);
const updatedTags = tags.with(1, "typescript");
console.log("with(1, 'typescript'):", updatedTags);
console.log("Original tags safe:", tags);

console.log();

// ----------------------------------------------------------------------------
// 5. FLATTENING ARRAYS: FLAT() & FLATMAP()
// ----------------------------------------------------------------------------
console.log("--- 5. FLAT() & FLATMAP() ---");

// flat(): Flattens nested arrays:
const nestedCoords = [10, [20, 30], [40, [50, 60]]];
console.log("flat(1) (default 1 level):", nestedCoords.flat());
console.log("flat(Infinity) (deep):    ", nestedCoords.flat(Infinity));

// flatMap(): Maps each item to an array and flattens the result by 1 level:
const sentences = ["Hello world", "Learning modern JavaScript"];
const allWords = sentences.flatMap(sentence => sentence.split(" "));
console.log("flatMap() split words:", allWords);

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. AGGREGATION & IMMUTABILITY CHEAT SHEET ---");
console.table([
    { Method: "reduce()", Returns: "Single value", MutatesOriginal: "No", Purpose: "Calculate totals, group items, build objects" },
    { Method: "some()", Returns: "Boolean", MutatesOriginal: "No", Purpose: "Check if at least one matches condition" },
    { Method: "every()", Returns: "Boolean", MutatesOriginal: "No", Purpose: "Check if all elements match condition" },
    { Method: "toSorted()", Returns: "New sorted Array", MutatesOriginal: "NO (ES2023)", Purpose: "Sort without mutating state" },
    { Method: "toReversed()", Returns: "New reversed Array", MutatesOriginal: "NO (ES2023)", Purpose: "Reverse without mutating state" },
    { Method: "with(i, val)", Returns: "New Array", MutatesOriginal: "NO (ES2023)", Purpose: "Replace element at index immutably" },
    { Method: "flatMap()", Returns: "New Array", MutatesOriginal: "No", Purpose: "Map and flatten in a single pass" }
]);

console.log("Module 08 loaded and executed successfully.\n");

