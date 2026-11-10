/**
 * ============================================================================
 * MODULE 06: Spread & Rest Operators (...)
 * Specification: ECMAScript 2015 (ES6) for Arrays; ES2018 (ES9) for Objects
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 05 (Destructuring)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * Prior to ES6, combining, copying, and manipulating collections was cumbersome:
 * 
 * A) Combining and Copying Arrays:
 *    - To merge arrays, developers used `arr1.concat(arr2)`.
 *    - To copy an array, they used `arr.slice()`.
 *    - Inserting elements in the middle of another array required tedious
 *      combinations of `slice()` and `concat()`.
 * 
 * B) Cloning and Merging Objects:
 *    - Pre-ES6 had no native object spread. Developers relied on libraries like
 *      Underscore or Lodash (`_.extend`), or the ES6 `Object.assign({}, obj1, obj2)`.
 *    - If a developer forgot the empty target `{}`: `Object.assign(obj1, obj2)`,
 *      `obj1` was permanently mutated in place, causing critical data bugs!
 * 
 * C) Variadic Functions (Arbitrary Number of Arguments):
 *    - Functions that accepted an unknown number of arguments had to read the
 *      pseudo-array `arguments` object.
 *    - Because `arguments` was NOT a real Array (it lacked `.map()`, `.filter()`,
 *      `.reduce()`), developers had to convert it manually with a hack:
 *        var args = Array.prototype.slice.call(arguments);
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP 5.6+, the variadic splat operator `...$args` was introduced:
 *     function sum(...$numbers) { return array_sum($numbers); }
 * - In PHP 7.4+, array unpacking was added: `[$x, ...$array, $y]`.
 * - In JavaScript, the exact same three dots (`...`) serve two distinct roles:
 *     1. SPREAD: Unpacks / expands items.
 *     2. REST: Gathers / condenses items.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION: SPREAD vs REST
 * ----------------------------------------------------------------------------
 * The symbol is identical (`...`), but the behavior depends on the context:
 * 
 * - SPREAD OPERATOR (Expands values):
 *   Used on the RHS (right-hand side) of an assignment, inside array literals `[...]`,
 *   inside object literals `{...}`, or in function call arguments `fn(...args)`.
 * 
 * - REST OPERATOR (Collects values):
 *   Used on the LHS (left-hand side) of destructuring, or in function signatures
 *   `function fn(...args)` to capture remaining values into an array.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Shallow Copy vs Deep Copy (CRITICAL FOR REACT!)
 *    - Both array spread `[...arr]` and object spread `{ ...obj }` create a
 *      SHALLOW copy.
 *    - Top-level primitive properties are duplicated.
 *    - Nested objects and arrays are copied BY REFERENCE!
 *    - Modifying a nested object inside a spread clone WILL mutate the original!
 *    - Solution for deep cloning: Use the modern standard `structuredClone()`.
 * 
 * Gotcha 2: Rest Parameter Must Be the Last Element
 *    - `function test(first, ...rest) {}` -> Valid.
 *    - `function test(...rest, last) {}` -> SyntaxError: Rest parameter must be last.
 * 
 * Gotcha 3: Object Property Overwrite Order
 *    - The spread order determines priority! Properties on the right overwrite
 *      properties on the left:
 *        const merged = { ...defaults, ...overrides }; // Overrides win!
 *        const reversed = { ...overrides, ...defaults }; // Defaults win!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React State Updates (Immutability):
 *     // Updating an object in state:
 *     setUser(prev => ({ ...prev, role: "Admin" }));
 *     // Appending an item to an array in state:
 *     setTodos(prev => [...prev, newTodo]);
 * - Prop Forwarding in React Components:
 *     function CustomInput({ label, error, ...htmlInputProps }) {
 *         return <input {...htmlInputProps} />;
 *     }
 * - Node.js Express query and body composition.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 06: Spread & Rest Operators (...)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SPREAD OPERATOR WITH ARRAYS
// ----------------------------------------------------------------------------
console.log("--- 1. ARRAY SPREAD: CLONING & COMBINING ---");

const frontendStack = ["React", "Next.js", "Tailwind CSS"];
const backendStack = ["Node.js", "Express", "PostgreSQL"];

// A) Merging arrays seamlessly:
const fullStack = [...frontendStack, "TypeScript", ...backendStack];
console.log("Combined full stack:", fullStack);

// B) Immutably cloning an array:
const originalNumbers = [10, 20, 30];
const clonedNumbers = [...originalNumbers];
clonedNumbers.push(40);

console.log("Original numbers (unchanged):", originalNumbers); // [10, 20, 30]
console.log("Cloned numbers (mutated):    ", clonedNumbers);   // [10, 20, 30, 40]

// C) Spreading in function arguments (Math.max expects individual numbers):
const ratings = [4.8, 4.2, 4.9, 3.8, 5.0];
// Old ES5 way: Math.max.apply(null, ratings);
// Modern ES6 way:
console.log("Highest rating:", Math.max(...ratings)); // 5.0

console.log();

// ----------------------------------------------------------------------------
// 2. SPREAD OPERATOR WITH OBJECTS
// ----------------------------------------------------------------------------
console.log("--- 2. OBJECT SPREAD: CLONING & OVERRIDING ---");

const defaultSettings = {
    theme: "light",
    fontSize: 14,
    showNotifications: true,
    autoSave: false
};

const userCustomPreferences = {
    theme: "dark",
    autoSave: true
};

// Merging with property override:
// Properties in userCustomPreferences overwrite matching properties in defaultSettings:
const finalConfig = {
    ...defaultSettings,
    ...userCustomPreferences,
    lastUpdated: "2026-11-10" // Adding a new property simultaneously
};

console.log("Final merged configuration:", finalConfig);

// Notice what happens if order is reversed:
const brokenOrderConfig = {
    ...userCustomPreferences,
    ...defaultSettings // defaultSettings will overwrite user's custom preferences!
};
console.log("Reversed order (defaults win): theme =", brokenOrderConfig.theme); // "light"

console.log();

// ----------------------------------------------------------------------------
// 3. THE SHALLOW COPY GOTCHA (AND STRUCTUREDCLONE SOLUTION)
// ----------------------------------------------------------------------------
console.log("--- 3. SHALLOW COPY VS DEEP CLONING ---");

const originalUser = {
    name: "Haris",
    skills: ["JavaScript", "React"], // Nested array
    address: { city: "Wah Cantt", country: "Pakistan" } // Nested object
};

// Shallow copy via spread:
const shallowClone = { ...originalUser };

// Mutating top-level primitive: SAFE (does NOT affect original)
shallowClone.name = "Ali";

// Mutating nested object: DANGEROUS! Affects original because it shares the same reference!
shallowClone.address.city = "Islamabad";
shallowClone.skills.push("PHP");

console.log("Original user city after shallow edit:", originalUser.address.city); // Islamabad (MUTATED!)
console.log("Original user skills after shallow edit:", originalUser.skills);     // ['JavaScript', 'React', 'PHP'] (MUTATED!)

// SOLUTION: Modern JavaScript native deep clone (Node v17+ / Modern Browsers):
const deepClone = structuredClone(originalUser);
deepClone.address.city = "Lahore";
deepClone.skills.push("Go");

console.log("\nDeep clone city:    ", deepClone.address.city);        // Lahore
console.log("Original user city: ", originalUser.address.city);     // Islamabad (Protected!)

console.log();

// ----------------------------------------------------------------------------
// 4. REST PARAMETERS IN FUNCTIONS (REPLACING 'ARGUMENTS')
// ----------------------------------------------------------------------------
console.log("--- 4. REST PARAMETERS IN FUNCTIONS ---");

// The modern way to accept any number of arguments:
function calculateCartTotal(discountPercent, ...itemPrices) {
    console.log(`Discount applied: ${discountPercent * 100}%`);
    console.log(`Received ${itemPrices.length} items (as a true Array):`, itemPrices);

    // itemPrices is an authentic Array, so we can use .reduce():
    const subtotal = itemPrices.reduce((sum, price) => sum + price, 0);
    const finalTotal = subtotal * (1 - discountPercent);
    return finalTotal.toFixed(2);
}

const total = calculateCartTotal(0.10, 19.99, 49.99, 99.00, 5.50);
console.log("Final discounted cart total: $" + total);

console.log();

// ----------------------------------------------------------------------------
// 5. REST IN OBJECT & ARRAY DESTRUCTURING
// ----------------------------------------------------------------------------
console.log("--- 5. REST IN DESTRUCTURING ---");

// Splitting an array into head and tail:
const [firstItem, secondItem, ...tailItems] = ["HTML", "CSS", "JS", "React", "Next"];
console.log("Head:", { firstItem, secondItem });
console.log("Tail (Rest):", tailItems);

// Stripping unwanted properties from an object:
const rawUserFromDb = {
    id: 99,
    username: "haris_dev",
    email: "haris@dev.com",
    passwordHash: "x$98234#hash",
    jwtToken: "eyJhbGciOi..."
};

// Extract private fields and gather remaining public fields into cleanUser:
const { passwordHash, jwtToken, ...cleanUser } = rawUserFromDb;
console.log("Sanitized user safe for client response:", cleanUser);

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET: SPREAD VS REST
// ----------------------------------------------------------------------------
console.log("--- 6. SPREAD VS REST QUICK COMPARISON ---");
console.table([
    { Concept: "Spread", Syntax: "...iterable", Role: "Unpacks elements into individuals", Location: "RHS of assignment, function calls, literals" },
    { Concept: "Rest",   Syntax: "...identifier", Role: "Gathers multiple elements into one array", Location: "LHS of destructuring, function parameters" },
    { Concept: "Cloning", Syntax: "{ ...obj }", Role: "Shallow copy (level 1 only)", Location: "Use structuredClone() for deep objects" },
    { Concept: "Merging", Syntax: "{ ...a, ...b }", Role: "Combines objects with right-side priority", Location: "Order dictates which key overwrites which" }
]);

console.log("Module 06 loaded and executed successfully.\n");

