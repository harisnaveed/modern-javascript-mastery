/**
 * ============================================================================
 * MODULE 27: Modern JavaScript Gems (ES2020 to ES2024)
 * Specification: ECMAScript 2020, 2021, 2022, 2023, 2024 & Intl Standards
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 08 (Arrays), Module 09 (Objects)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * For years, JavaScript developers loaded heavy external NPM libraries (such as
 * Lodash, Moment.js, Ramda, and big-integer) to solve simple language omissions:
 * 
 * - Grouping an array of items required writing complex, error-prone `reduce()` loops.
 * - Numbers larger than 9 quadrillion suffered silent IEEE 754 precision corruption.
 * - Replacing multiple occurrences in a string required regex `replace(/foo/g, "bar")`,
 *   which broke if the search query contained special regex symbols (`.` or `$`).
 * - Accessing the last element of an array required `array[array.length - 1]`.
 * - Formatting dates and currencies required 300KB Moment.js bundles.
 * 
 * The ECMAScript committee (TC39) systematically eliminated the need for these
 * external libraries by introducing powerful modern language gems.
 *
 *
 * 2. THE MODERN GEMS COVERED IN THIS MODULE
 * ----------------------------------------------------------------------------
 * 1. `Object.groupBy()` & `Map.groupBy()` (ES2024):
 *    - Replaces custom `reduce()` grouping loops with an ultra-fast native standard!
 * 2. `Array.prototype.at()` & `String.prototype.at()` (ES2022):
 *    - Relative indexing supporting negative numbers (`arr.at(-1)`).
 * 3. `String.prototype.replaceAll()` (ES2021):
 *    - Replaces all occurrences without tricky regex escaping.
 * 4. `BigInt` (ES2020):
 *    - Arbitrary-precision integers that never overflow beyond `Number.MAX_SAFE_INTEGER`.
 * 5. `Symbol` (ES6):
 *    - Guaranteed globally unique primitive values for collision-proof object keys.
 * 6. Native `Intl` API:
 *    - Standardized internationalization for currencies, relative time, and numbers.
 *
 *
 * 3. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Mixing BigInt with Regular Numbers
 *    - You CANNOT write `10n + 5`. JavaScript throws:
 *      `TypeError: Cannot mix BigInt and other types, use explicit conversions`.
 * 
 * Gotcha 2: `Object.groupBy()` Prototype
 *    - `Object.groupBy()` returns an object with a `null` prototype
 *      (`Object.create(null)`). It has no `.toString()` or `.hasOwnProperty()`,
 *      making it 100% immune to prototype pollution!
 * 
 * Gotcha 3: Symbols are Skipped by JSON.stringify
 *    - If an object has a `Symbol` key, `JSON.stringify(obj)` completely omits it.
 *
 *
 * 4. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Next.js Multi-Currency E-Commerce: Formatting prices dynamically with `Intl.NumberFormat`.
 * - Grouping orders by status in admin dashboards with `Object.groupBy()`.
 * - Handling 64-bit Twitter / Discord / Database Snowflake IDs with `BigInt`.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 27: Modern JavaScript Gems (ES2020 to ES2024)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. ES2024 OBJECT.GROUPBY() & MAP.GROUPBY()
// ----------------------------------------------------------------------------
console.log("--- 1. ES2024 OBJECT.GROUPBY (NATIVE DATA GROUPING) ---");

const inventory = [
    { name: "MacBook Pro", category: "Hardware", price: 2499 },
    { name: "USB-C Cable", category: "Accessories", price: 19 },
    { name: "Dell Monitor", category: "Hardware", price: 450 },
    { name: "Mousepad", category: "Accessories", price: 25 },
    { name: "Ergonomic Chair", category: "Furniture", price: 350 }
];

// In ES2024, grouping by category is a single clean line:
if (typeof Object.groupBy === "function") {
    const groupedByCategory = Object.groupBy(inventory, item => item.category);
    console.log("Grouped by Category (Object.groupBy):");
    console.log(groupedByCategory);

    // Grouping by price threshold:
    const groupedByAffordability = Object.groupBy(inventory, item => 
        item.price > 100 ? "expensive" : "affordable"
    );
    console.log("Grouped by Affordability:", Object.keys(groupedByAffordability));
} else {
    console.log("Object.groupBy requires Node v21+");
}

console.log();

// ----------------------------------------------------------------------------
// 2. ES2022 ARRAY & STRING .AT() (NEGATIVE INDEXING)
// ----------------------------------------------------------------------------
console.log("--- 2. ES2022 .AT() RELATIVE INDEXING ---");

const teamMembers = ["Haris", "Ayesha", "Usman", "Fatima", "Zain"];

// Old way to get last element:
console.log("Old verbose way: ", teamMembers[teamMembers.length - 1]); // Zain

// Modern ES2022 way with negative indices:
console.log("Modern .at(-1) (last):       ", teamMembers.at(-1)); // Zain
console.log("Modern .at(-2) (second last):", teamMembers.at(-2)); // Fatima
console.log("Modern .at(0)  (first):      ", teamMembers.at(0));  // Haris

// Also works on Strings:
const documentExtension = "report.final.backup.pdf";
console.log("String .at(-3):              ", documentExtension.at(-3)); // 'p'

console.log();

// ----------------------------------------------------------------------------
// 3. ES2021 STRING.REPLACEALL()
// ----------------------------------------------------------------------------
console.log("--- 3. ES2021 STRING.REPLACEALL() ---");

const dirtyText = "User input: +1 555-0199 / office: +1 555-0144 / fax: +1 555-0188";

// Old way required complex regex with /g flag:
// const regexReplaced = dirtyText.replace(/\+1/g, "US");

// Modern ES2021 clean string replacement:
const cleanText = dirtyText.replaceAll("+1", "USA");
console.log("Original text:   ", dirtyText);
console.log("replaceAll text: ", cleanText);

console.log();

// ----------------------------------------------------------------------------
// 4. BIGINT: HANDLING ARBITRARY-PRECISION INTEGERS
// ----------------------------------------------------------------------------
console.log("--- 4. BIGINT (PRECISION BEYOND 64-BIT IEEE FLOATS) ---");

// Standard JavaScript numbers lose precision past 9,007,199,254,740,991:
const maxSafe = Number.MAX_SAFE_INTEGER;
console.log("MAX_SAFE_INTEGER:      ", maxSafe);
console.log("maxSafe + 1:           ", maxSafe + 1); // 9007199254740992
console.log("maxSafe + 2 (CORRUPTED):", maxSafe + 2); // 9007199254740992 (Notice: calculation failed!)

// BigInt (appended with 'n' or BigInt()):
const bigA = 9007199254740991n;
console.log("\nBigInt safe + 1n:      ", bigA + 1n); // 9007199254740992n
console.log("BigInt safe + 2n:      ", bigA + 2n); // 9007199254740993n (Exact arithmetic!)

// Essential for 64-bit Twitter/Discord Snowflake IDs:
const tweetId = 1855609384729104829n;
console.log("Snowflake Database ID: ", tweetId.toString());

console.log();

// ----------------------------------------------------------------------------
// 5. SYMBOL: GUARANTEED UNIQUE KEYS
// ----------------------------------------------------------------------------
console.log("--- 5. SYMBOL: COLLISION-PROOF PRIMITIVES ---");

const symA = Symbol("session_id");
const symB = Symbol("session_id");

// Symbols with identical descriptions are NEVER equal:
console.log("Are symA and symB equal?  ", symA === symB); // false!

// Using Symbols as hidden / collision-proof object properties:
const internalStatus = Symbol("internal_status");
const userSession = {
    username: "haris_dev",
    [internalStatus]: "AUTHENTICATED_SECURE"
};

console.log("Direct access with Symbol:", userSession[internalStatus]);
console.log("Object.keys() skips Symbol:", Object.keys(userSession)); // ['username'] (Hidden from loops!)

console.log();

// ----------------------------------------------------------------------------
// 6. NATIVE INTL API: INTERNATIONALIZATION WITHOUT MOMENT.JS
// ----------------------------------------------------------------------------
console.log("--- 6. INTL API: PROFESSIONAL LOCALIZATION ---");

const revenue = 145920.75;

// Currency Formatting:
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const eurFormatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const pkrFormatter = new Intl.NumberFormat("ur-PK", { style: "currency", currency: "PKR" });

console.log("US Dollar (en-US):  ", usdFormatter.format(revenue));
console.log("Euro (de-DE):       ", eurFormatter.format(revenue));
console.log("Pakistani Rupee:    ", pkrFormatter.format(revenue));

// Relative Time Formatting ("5 minutes ago", "in 2 days"):
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
console.log("Relative Time (-1 day):  ", rtf.format(-1, "day"));     // "yesterday"
console.log("Relative Time (+3 hours):", rtf.format(3, "hour"));     // "in 3 hours"
console.log("Relative Time (-15 mins):", rtf.format(-15, "minute")); // "15 minutes ago"

console.log();

// ----------------------------------------------------------------------------
// 7. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 7. MODERN GEMS CHEAT SHEET ---");
console.table([
    { Feature: "Object.groupBy()", Spec: "ES2024", Benefit: "Replaces manual reduce() loops for data grouping" },
    { Feature: "array.at(-1)", Spec: "ES2022", Benefit: "Negative indexing for last elements without .length - 1" },
    { Feature: "string.replaceAll()", Spec: "ES2021", Benefit: "Replaces all occurrences without regex global flags" },
    { Feature: "BigInt (123n)", Spec: "ES2020", Benefit: "Exact arbitrary precision for 64-bit IDs and finance" },
    { Feature: "Intl API", Spec: "Modern Standard", Benefit: "Zero-dependency currency, date, and relative time formatting" }
]);

console.log("Module 27 loaded and executed successfully.\n");

