/**
 * ============================================================================
 * MODULE 01: Variable Declarations & Scoping (var vs let vs const)
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Basic programming understanding
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript (ES5 and earlier, 1995–2015), developers had only ONE
 * keyword to declare variables: `var`.
 * 
 * This design caused severe issues in large-scale applications:
 * 
 * A) Function-Scoping vs Block-Scoping:
 *    - In languages like C, Java, or C++, any block `{ ... }` (if statements,
 *      for loops, while loops) creates a private scope.
 *    - In old JavaScript, `var` ignored `{}` blocks completely! It was scoped
 *      only to the enclosing function. Variables in `for` loops leaked directly
 *      into the outer function or global namespace.
 * 
 * B) Variable Redeclaration:
 *    - With `var`, you could accidentally declare the exact same variable twice
 *      in the same scope without any error or warning. In large codebases, one
 *      developer would unwittingly overwrite another developer's variable.
 * 
 * C) Hoisting with `undefined`:
 *    - `var` declarations were hoisted to the top of the function and initialized
 *      to `undefined`. Accessing a variable before declaring it did not throw an
 *      error—it silently evaluated to `undefined`, hiding critical bugs.
 * 
 * D) The Asynchronous Loop Problem:
 *    - Inside `for (var i = 0; i < 3; i++)`, callbacks like `setTimeout` or event
 *      listeners closed over the single shared mutable `i`. By the time the
 *      callback ran, `i` was already 3 for all iterations!
 * 
 * E) Global Object Pollution:
 *    - In browser environments, top-level `var name = "Haris"` attached itself
 *      directly to `window.name`, risking conflicts with native browser APIs.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - PHP Variables: In PHP, variables `$x` are function-scoped (or global if outside),
 *   much like JavaScript's `var`. Variables declared inside an `if ($condition) { $x = 10; }`
 *   remain accessible outside the `if` block in PHP.
 * - `let` and `const` in JS bring true C/Java-style BLOCK scope, meaning variables
 *   die the moment the curly brace `}` closes.
 * - PHP Constants: In PHP, `define('SITE_URL', '...')` or `const MAX = 100` defines
 *   an immutable identifier. In JS, `const` locks the *binding* (variable reference),
 *   not the underlying value if it is an object or array (details below).
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION (ES6: let & const)
 * ----------------------------------------------------------------------------
 * ES6 introduced two new declaration keywords:
 * - `let`: Declares a reassignable, block-scoped variable.
 * - `const`: Declares a read-only reference (block-scoped). Must be initialized
 *   at declaration time.
 * 
 * Both `let` and `const`:
 * 1. Are strictly block-scoped (confined to `{}`).
 * 2. Disallow redeclaration within the same scope.
 * 3. Reside in the "Temporal Dead Zone" (TDZ) before their declaration line,
 *    throwing a ReferenceError instead of silently returning `undefined`.
 * 4. Do NOT attach to the global object (`window` or `globalThis`).
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `const` is NOT Immutable Data!
 *    - `const` prevents *reassigning the variable binding*.
 *    - It does NOT freeze the internal contents of an object or array.
 *    - Example: `const user = { name: "Haris" }; user.name = "Ali";` is 100% valid!
 *    - To make values immutable, use `Object.freeze()` (covered in Module 09).
 * 
 * Gotcha 2: The Temporal Dead Zone (TDZ):
 *    - `let` and `const` are actually hoisted by the engine, but they are NOT
 *      initialized. The region of code between the start of the block and the
 *      declaration line is the TDZ. Accessing them inside TDZ throws a ReferenceError.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Rule of thumb in modern React/Node: **Use `const` by default 95% of the time.**
 * - Only use `let` when you explicitly need reassignment (e.g., accumulators,
 *   loops, or variable values that change based on conditional logic).
 * - **NEVER use `var`** in modern codebases. Using `var` in React can cause
 *   stale closure bugs, variable leaking across re-renders, and race conditions.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 01: Variable Declarations (var vs let vs const)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SCOPING: Function Scope (var) vs Block Scope (let & const)
// ----------------------------------------------------------------------------
console.log("--- 1. SCOPING COMPARISON ---");

function testScoping() {
    if (true) {
        var leakedVar = "I leak outside this if-block!";
        let blockLet = "I am trapped inside this if-block.";
        const blockConst = "I am also trapped inside.";
        
        console.log("[Inside block] let:", blockLet);
        console.log("[Inside block] const:", blockConst);
    }

    // var is accessible here because it is function-scoped!
    console.log("[Outside block] var:", leakedVar);

    // Accessing let or const here throws ReferenceError:
    try {
        console.log(blockLet);
    } catch (error) {
        console.log("[Outside block] let caught error:", error.message);
    }
}
testScoping();

console.log();

// ----------------------------------------------------------------------------
// 2. REDECLARATION & REASSIGNMENT
// ----------------------------------------------------------------------------
console.log("--- 2. REDECLARATION & REASSIGNMENT ---");

// A) Old JS allowed accidental redeclaration:
var score = 100;
var score = 200; // Silently overwrites! Dangerous in large teams.
console.log("var score redeclared:", score);

// B) Modern JS forbids redeclaration in the same scope:
let modernScore = 100;
// let modernScore = 200; // SyntaxError: Identifier 'modernScore' has already been declared

// But reassignment is completely fine with let:
modernScore = 250;
console.log("let modernScore reassigned:", modernScore);

// C) const forbids both redeclaration AND reassignment:
const MAX_ATTEMPTS = 5;
console.log("const MAX_ATTEMPTS:", MAX_ATTEMPTS);
try {
    // Attempting reassignment:
    // @ts-ignore
    MAX_ATTEMPTS = 10;
} catch (error) {
    console.log("const reassignment error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 3. THE "CONST WITH OBJECTS / ARRAYS" GOTCHA
// ----------------------------------------------------------------------------
console.log("--- 3. CONST MUTABILITY (OBJECTS & ARRAYS) ---");

const developer = {
    name: "Haris",
    role: "Fullstack Engineer",
    skills: ["JavaScript", "PHP"]
};

console.log("Original developer:", developer);

// VALID: Mutating properties of a const object is permitted!
developer.role = "Senior Fullstack Engineer";
developer.skills.push("React");
console.log("Mutated developer properties:", developer);

// INVALID: Reassigning the variable reference is forbidden!
try {
    // @ts-ignore
    developer = { name: "Someone Else" };
} catch (error) {
    console.log("Reassigning entire const object error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 4. THE CLASSIC ASYNCHRONOUS LOOP BUG: var vs let
// ----------------------------------------------------------------------------
console.log("--- 4. THE ASYNC LOOP PROBLEM (var vs let) ---");

// When using var, the variable 'i' is shared across all iterations.
// By the time asynchronous code runs, the loop has already completed!
console.log("Running var loop with simulated async callback...");
for (var i = 0; i < 3; i++) {
    // We capture 'i' in a timeout
    setTimeout(function() {
        // Uncomment to see it prints 3, 3, 3:
        // console.log("var loop callback index:", i);
    }, 10);
}
// Note: outside the loop, i is 3!
console.log("After loop, leaked var i is:", i);

// With let, EVERY iteration gets its own fresh lexical binding!
console.log("Running let loop with simulated async callback...");
for (let j = 0; j < 3; j++) {
    setTimeout(function() {
        // Each callback remembers its own distinct 'j' (0, 1, 2)
        // console.log("let loop callback index:", j);
    }, 10);
}

console.log();

// ----------------------------------------------------------------------------
// 5. TEMPORAL DEAD ZONE (TDZ)
// ----------------------------------------------------------------------------
console.log("--- 5. TEMPORAL DEAD ZONE (TDZ) ---");

// var hoisting behavior:
console.log("Hoisted var before declaration:", hoistedVar); // undefined
var hoistedVar = "Defined now";

// let/const TDZ behavior:
try {
    // Accessing before initialization throws ReferenceError
    // @ts-ignore
    console.log(hoistedLet);
    let hoistedLet = "Won't reach here";
} catch (error) {
    console.log("Accessing let in TDZ caught error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 6. BEST PRACTICE SUMMARY TABLE
// ----------------------------------------------------------------------------
console.log("--- 6. BEST PRACTICE CHEAT SHEET ---");
console.table([
    { Keyword: "const", Scope: "Block {}", Reassignable: "No",  Redeclarable: "No", TDZ: "Yes", RecommendedUsage: "Default choice for 95% of variables" },
    { Keyword: "let",   Scope: "Block {}", Reassignable: "Yes", Redeclarable: "No", TDZ: "Yes", RecommendedUsage: "Counters, loops, conditionally mutated values" },
    { Keyword: "var",   Scope: "Function", Reassignable: "Yes", Redeclarable: "Yes", TDZ: "No",  RecommendedUsage: "NEVER in modern JavaScript" }
]);

console.log("Module 01 loaded and executed successfully.\n");

