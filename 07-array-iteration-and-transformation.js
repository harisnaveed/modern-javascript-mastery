/**
 * ============================================================================
 * MODULE 07: Array Iteration & Transformation
 * Specification: ECMAScript 5.1 / ES6 / ES2023
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 03 (Arrow Functions), Module 05 (Destructuring)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In early JavaScript, processing lists of data required imperative `for` loops:
 * 
 *     var names = [];
 *     for (var i = 0; i < users.length; i++) {
 *         if (users[i].isActive) {
 *             names.push(users[i].name);
 *         }
 *     }
 * 
 * Why this was problematic:
 * A) Off-by-one errors (`i <= length` crashing or accessing undefined).
 * B) Boilerplate code: manually managing indices, counters, and array lengths.
 * C) Imperative vs Declarative: Instead of describing WHAT we want (e.g., "give
 *    me the active user names"), imperative code forces us to describe HOW the
 *    computer must advance its CPU counter step by step.
 * D) Mutations Everywhere: Constant `.push()` calls to mutable arrays, making
 *    code harder to test and reason about in UI frameworks like React.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, developers often write:
 *     $filtered = array_filter($users, fn($u) => $u['active']);
 *     $names    = array_map(fn($u) => $u['name'], $filtered);
 * - In JavaScript, methods live on the array prototype itself, enabling fluid,
 *   readable method chaining:
 *     users.filter(u => u.active).map(u => u.name);
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION: DECLARATIVE ARRAY METHODS
 * ----------------------------------------------------------------------------
 * Modern JS provides specialized methods for every common collection task:
 * - `forEach()`: For side-effects (logging, updating DOM, sending analytics).
 * - `map()`: 1-to-1 transformation. Always returns a new array of identical length.
 * - `filter()`: Selection. Returns a new array containing items that match a condition.
 * - `find()`: Returns the first matching item, or `undefined`.
 * - `findIndex()`: Returns the index of the first match, or `-1`.
 * - `findLast()` & `findLastIndex()` (ES2023): Scans the array in reverse.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `forEach()` CANNOT be broken or stopped!
 *    - `break` or `continue` throws a SyntaxError inside `forEach()`.
 *    - `return` simply exits the current callback iteration, not the loop!
 *    - If you need early exit, use modern `for...of`, `some()`, or `find()`.
 * 
 * Gotcha 2: The `map()` Missing Return Trap
 *    - If you use curly braces in `map()` and forget `return`:
 *        arr.map(x => { x * 2 }); // [undefined, undefined, ...]
 *    - Solution: Use implicit return: `arr.map(x => x * 2)`
 * 
 * Gotcha 3: `find()` vs `filter()`
 *    - `filter()` ALWAYS returns an array (empty `[]` if no matches).
 *    - `find()` returns a single item or `undefined`.
 *    - Don't write `items.filter(x => x.id === id)[0]`; use `items.find(x => x.id === id)`!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Rendering lists in React (THE #1 most used pattern in React):
 *     {products.map(product => (
 *         <ProductCard key={product.id} {...product} />
 *     ))}
 * - E-commerce filtering (Search, Price, Category):
 *     const visible = products.filter(p => p.price <= max && p.inStock);
 * - Express Route Handlers (finding record by ID):
 *     const user = users.find(u => u.id === Number(req.params.id));
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 07: Array Iteration & Transformation");
console.log("==================================================================\n");

// Sample Dataset: E-Commerce Catalog
const products = [
    { id: 101, name: "MacBook Pro 16", price: 2499, category: "Laptop", inStock: true, rating: 4.9 },
    { id: 102, name: "Dell XPS 15",     price: 1899, category: "Laptop", inStock: false, rating: 4.5 },
    { id: 103, name: "iPhone 15 Pro",   price: 999,  category: "Phone",  inStock: true, rating: 4.8 },
    { id: 104, name: "Samsung S24",     price: 899,  category: "Phone",  inStock: true, rating: 4.6 },
    { id: 105, name: "Sony WH-1000XM5", price: 399,  category: "Audio",  inStock: true, rating: 4.7 },
    { id: 106, name: "AirPods Max",     price: 549,  category: "Audio",  inStock: false, rating: 4.3 }
];

// ----------------------------------------------------------------------------
// 1. FOREACH: SIDE-EFFECTS (NO RETURN VALUE)
// ----------------------------------------------------------------------------
console.log("--- 1. FOREACH (SIDE-EFFECTS ONLY) ---");

// forEach is meant for side-effects (e.g. logging, notifications):
products.forEach((product, index) => {
    // Note: forEach returns undefined. Do NOT try to store its result.
    console.log(`[Item ${index + 1}] ${product.name} - $${product.price} (${product.inStock ? "In Stock" : "Out of Stock"})`);
});

console.log();

// ----------------------------------------------------------------------------
// 2. MAP: 1-TO-1 TRANSFORMATION (THE REACT WORKHORSE)
// ----------------------------------------------------------------------------
console.log("--- 2. MAP (TRANSFORMING INTO A NEW ARRAY) ---");

// Example A: Extracting a simplified array of product names:
const productNames = products.map(product => product.name);
console.log("Extracted product names:", productNames);

// Example B: Transforming into formatted display objects (with discount applied):
const discountedCatalog = products.map(product => ({
    id: product.id,
    title: product.name,
    originalPrice: `$${product.price}`,
    salePrice: `$${(product.price * 0.9).toFixed(2)}`, // 10% discount
    category: product.category
}));
console.log("Transformed catalog (first 2 items):", discountedCatalog.slice(0, 2));

console.log();

// ----------------------------------------------------------------------------
// 3. FILTER: SUBSET SELECTION
// ----------------------------------------------------------------------------
console.log("--- 3. FILTER (SELECTING MATCHING ELEMENTS) ---");

// Filter only products that are in stock AND cost less than $1000:
const budgetInStock = products.filter(product => product.inStock && product.price < 1000);
console.log("Budget in-stock items:", budgetInStock.map(p => `${p.name} ($${p.price})`));

// Filtering by category:
const audioGear = products.filter(p => p.category === "Audio");
console.log("Audio gear count:", audioGear.length);

console.log();

// ----------------------------------------------------------------------------
// 4. FIND & FINDINDEX: SINGLE RECORD LOOKUP
// ----------------------------------------------------------------------------
console.log("--- 4. FIND & FINDINDEX ---");

const searchId = 103;

// find returns the first object that satisfies the predicate:
const foundProduct = products.find(p => p.id === searchId);
console.log(`find(id === ${searchId}):`, foundProduct ? foundProduct.name : "Not found");

// findIndex returns the array index (or -1 if missing):
const targetIndex = products.findIndex(p => p.id === searchId);
console.log(`findIndex(id === ${searchId}): index`, targetIndex);

// When an item doesn't exist:
const missingProduct = products.find(p => p.id === 9999);
console.log("find(missing):", missingProduct); // undefined (Safe to check with ! or ?.)

console.log();

// ----------------------------------------------------------------------------
// 5. ES2023 MODERN METHODS: FINDLAST & FINDLASTINDEX
// ----------------------------------------------------------------------------
console.log("--- 5. ES2023: FINDLAST & FINDLASTINDEX ---");

const logs = [
    { action: "LOGIN",  userId: 1, timestamp: "10:00" },
    { action: "UPDATE", userId: 1, timestamp: "10:05" },
    { action: "LOGIN",  userId: 2, timestamp: "10:10" },
    { action: "UPDATE", userId: 1, timestamp: "10:15" },
    { action: "LOGOUT", userId: 1, timestamp: "10:20" }
];

// In old JS, finding the last update required cloning the array, reversing it, and find().
// In ES2023, findLast searches directly from right to left:
const lastUser1Update = logs.findLast(log => log.userId === 1 && log.action === "UPDATE");
console.log("Last update for User 1:", lastUser1Update);

const lastLoginIndex = logs.findLastIndex(log => log.action === "LOGIN");
console.log("Last login event was at index:", lastLoginIndex);

console.log();

// ----------------------------------------------------------------------------
// 6. PIPELINING / METHOD CHAINING (THE MODERN FUNCTIONAL PARADIGM)
// ----------------------------------------------------------------------------
console.log("--- 6. METHOD CHAINING PIPELINE ---");

// Real-world scenario: Search input is "pro", user wants top-rated in-stock items formatted for display:
const searchQuery = "pro";

const searchResults = products
    // Step 1: Filter matching name & stock
    .filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        product.inStock
    )
    // Step 2: Transform into display strings
    .map(product => `⭐ ${product.rating} | ${product.name} — $${product.price}`);

console.log(`Search results for "${searchQuery}":`);
searchResults.forEach(result => console.log(" ", result));

console.log();

// ----------------------------------------------------------------------------
// 7. CHEAT SHEET: ITERATION METHODS
// ----------------------------------------------------------------------------
console.log("--- 7. METHOD COMPARISON CHEAT SHEET ---");
console.table([
    { Method: "forEach()", Returns: "undefined", UseCase: "Side effects (logging, analytics)", MutatesOriginal: "No" },
    { Method: "map()", Returns: "New Array (same length)", UseCase: "Transforming every element (e.g. JSX lists)", MutatesOriginal: "No" },
    { Method: "filter()", Returns: "New Array (0 to N items)", UseCase: "Selecting subset by boolean condition", MutatesOriginal: "No" },
    { Method: "find()", Returns: "Element or undefined", UseCase: "First matching item (e.g. find by ID)", MutatesOriginal: "No" },
    { Method: "findIndex()", Returns: "Number (index or -1)", UseCase: "Locating position of element", MutatesOriginal: "No" },
    { Method: "findLast()", Returns: "Element or undefined", UseCase: "Last matching item from end of array", MutatesOriginal: "No" }
]);

console.log("Module 07 loaded and executed successfully.\n");

