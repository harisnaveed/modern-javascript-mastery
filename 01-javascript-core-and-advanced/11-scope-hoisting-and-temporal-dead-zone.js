/**
 * ============================================================================
 * MODULE 11: Scope, Hoisting & The Temporal Dead Zone (TDZ)
 * Specification: ECMAScript 2015 (ES6+)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 01 (Variable Declarations)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * To truly understand JavaScript, you must understand how the engine executes code.
 * The JavaScript engine (like V8 in Chrome and Node.js) does NOT simply read
 * code top-to-bottom in a single pass. It runs in two distinct phases:
 * 
 *   PHASE 1: Creation / Compilation Phase
 *     - The engine scans the code, allocates memory for variables and functions,
 *       and sets up the Lexical Environment and Scope Chains.
 *   PHASE 2: Execution Phase
 *     - The engine runs code line-by-line, assigns values, and executes functions.
 * 
 * THE OLD JAVASCRIPT HOISTING PROBLEM:
 * In pre-ES6, `var` declarations were hoisted during Phase 1 and automatically
 * initialized with the value `undefined`.
 * 
 * Because of this, developers could read a variable BEFORE its declaration line:
 *     console.log(myVar); // undefined (No error thrown!)
 *     var myVar = "Hello";
 * 
 * This silent `undefined` behavior caused critical bugs:
 * - Bugs failed silently instead of failing fast.
 * - Variables appeared to "exist" before they were initialized, producing subtle
 *   logic errors in conditional statements.
 * - Function declarations were hoisted with their full bodies, but function
 *   expressions were hoisted as `undefined`, causing baffling
 *   `TypeError: myFunc is not a function` errors!
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - PHP does NOT have variable hoisting! Accessing an unassigned or undeclared
 *   variable in PHP emits an immediate `Warning: Undefined variable $foo`.
 * - However, PHP DOES hoist global function declarations at compile time, meaning
 *   you can call `greet();` before `function greet() { ... }` in PHP.
 * - JavaScript's `let` and `const` bring JS closer to traditional backend languages:
 *   trying to read a variable before its declaration line throws an immediate,
 *   uncompromising `ReferenceError`.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION: TEMPORAL DEAD ZONE (TDZ)
 * ----------------------------------------------------------------------------
 * In modern JavaScript:
 * - `let`, `const`, and `class` declarations ARE still hoisted during Phase 1
 *   (the engine knows they exist in the scope).
 * - BUT they are NOT initialized with `undefined`!
 * - The region of execution between the start of the scope and the line where
 *   the variable is declared and initialized is known as the TEMPORAL DEAD ZONE (TDZ).
 * - Any attempt to read or write to the variable while it is in the TDZ throws
 *   a `ReferenceError: Cannot access 'x' before initialization`.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: The TDZ is TEMPORAL (Time-Based), Not Spatial (Location-Based)!
 *    - TDZ is governed by WHEN the code executes, not WHERE the code is written.
 *    - A function physically written ABOVE a `let` variable can safely access it,
 *      provided the function is CALLED after the `let` variable is initialized!
 * 
 * Gotcha 2: `typeof` is NOT Safe in the TDZ!
 *    - In ES5, `typeof undeclaredVariable` was guaranteed to return `"undefined"`.
 *    - In modern JS, `typeof tdzVariable` THROWS A REFERENCEERROR!
 * 
 * Gotcha 3: Variable Shadowing & Illegal Shadowing
 *    - An inner block variable can shadow an outer variable with the same name.
 *    - But you CANNOT shadow a `let` variable with a `var` within the same scope:
 *        let a = 1;
 *        { var a = 2; } // SyntaxError: Identifier 'a' has already been declared
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Ordering Component Logic: Understanding TDZ prevents ordering bugs where
 *   helper functions or custom hooks attempt to consume state before initialization.
 * - Preventing Circular Import Deadlocks in Next.js / Node.js:
 *   When Module A imports Module B and Module B imports Module A, variables
 *   accessed before module evaluation completes hit the TDZ!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 11: Scope, Hoisting & The Temporal Dead Zone (TDZ)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. THE 3 TYPES OF SCOPE IN JAVASCRIPT
// ----------------------------------------------------------------------------
console.log("--- 1. SCOPE HIERARCHY ---");

// A) Global Scope: Accessible everywhere
const globalAppVersion = "2.4.0";

function demonstrateScoping() {
    // B) Function / Local Scope: Accessible only within this function
    const functionScopedSecret = "JWT_SECRET_KEY_99";

    if (true) {
        // C) Block Scope: Confined strictly within this { ... } block
        const blockScopedToken = "TOKEN_XYZ";
        console.log("[Inside Block] Can access global:  ", globalAppVersion);
        console.log("[Inside Block] Can access function:", functionScopedSecret);
        console.log("[Inside Block] Can access block:   ", blockScopedToken);
    }

    // Attempting to access blockScopedToken outside its block:
    try {
        // @ts-ignore
        console.log(blockScopedToken);
    } catch (error) {
        console.log("[Inside Function] Block variable inaccessible:", error.message);
    }
}
demonstrateScoping();

console.log();

// ----------------------------------------------------------------------------
// 2. HOISTING: VAR VS LET VS FUNCTION DECLARATIONS
// ----------------------------------------------------------------------------
console.log("--- 2. HOISTING COMPARISON ---");

// A) Function Declaration Hoisting:
// Works perfectly! The entire function body was hoisted during the creation phase:
console.log("Invoking hoisted function:", calculateDiscount(100, 0.20));

function calculateDiscount(price, rate) {
    return price * (1 - rate);
}

// B) Function Expression Hoisting Trap (Old JavaScript Gotcha):
try {
    // @ts-ignore
    formatCurrency(50); // Throws TypeError: formatCurrency is not a function!
} catch (error) {
    console.log("Function expression hoisted as undefined error:", error.message);
}

var formatCurrency = function(amount) {
    return `$${amount.toFixed(2)}`;
};

// C) var Hoisting:
console.log("var before declaration evaluates to:", oldVar); // undefined (No error!)
var oldVar = "Initialized now";

console.log();

// ----------------------------------------------------------------------------
// 3. THE TEMPORAL DEAD ZONE (TDZ) IN ACTION
// ----------------------------------------------------------------------------
console.log("--- 3. THE TEMPORAL DEAD ZONE (TDZ) ---");

{
    // === TDZ for 'targetUser' STARTS HERE ===
    // Memory is allocated for 'targetUser', but it is uninitialized.

    // typeof is NOT safe in the TDZ:
    try {
        // @ts-ignore
        console.log(typeof targetUser);
    } catch (error) {
        console.log("typeof on TDZ variable caught error:", error.message);
    }

    try {
        // @ts-ignore
        console.log(targetUser); // ReferenceError!
    } catch (error) {
        console.log("Reading variable in TDZ caught error:", error.message);
    }

    // === TDZ ENDS HERE when the declaration line is reached ===
    let targetUser = "Haris Ali";
    console.log("After initialization, targetUser is:", targetUser);
}

console.log();

// ----------------------------------------------------------------------------
// 4. TDZ IS TEMPORAL (TIME-BASED), NOT SPATIAL
// ----------------------------------------------------------------------------
console.log("--- 4. TDZ IS TIME-BASED, NOT LOCATION-BASED ---");

// Notice: printAge() is physically written ABOVE 'userAge'!
function printAge() {
    // This function reads userAge.
    // It works ONLY IF called after userAge is initialized:
    return `User age is: ${userAge}`;
}

// At this point in time, userAge is still in the TDZ!
try {
    printAge(); // Throws ReferenceError!
} catch (error) {
    console.log("Calling printAge() before userAge initialization error:", error.message);
}

// Now we initialize userAge:
let userAge = 25;

// Now calling the exact same function succeeds because userAge has exited TDZ!
console.log("Calling printAge() AFTER initialization:", printAge());

console.log();

// ----------------------------------------------------------------------------
// 5. VARIABLE SHADOWING
// ----------------------------------------------------------------------------
console.log("--- 5. VARIABLE SHADOWING & SCOPE CHAIN ---");

const theme = "dark"; // Outer scope

function renderTheme() {
    const theme = "light"; // Inner scope shadows outer scope
    console.log("Inner function theme:", theme); // "light"

    if (true) {
        const theme = "high-contrast"; // Block shadows function scope
        console.log("Inner block theme:   ", theme); // "high-contrast"
    }

    console.log("Back to function theme:", theme); // "light"
}

renderTheme();
console.log("Global theme unchanged:    ", theme); // "dark"

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET: HOISTING & TDZ
// ----------------------------------------------------------------------------
console.log("--- 6. HOISTING & TDZ MATRIX ---");
console.table([
    { Declaration: "function fn() {}", Hoisted: "YES (Definition + Body)", InitialValue: "The function itself", TDZ: "NO" },
    { Declaration: "var x = 1",        Hoisted: "YES (Declaration only)",  InitialValue: "undefined",            TDZ: "NO" },
    { Declaration: "let x = 1",        Hoisted: "YES (Declaration only)",  InitialValue: "Uninitialized",       TDZ: "YES (Throws ReferenceError)" },
    { Declaration: "const x = 1",      Hoisted: "YES (Declaration only)",  InitialValue: "Uninitialized",       TDZ: "YES (Throws ReferenceError)" },
    { Declaration: "class MyClass {}", Hoisted: "YES (Declaration only)",  InitialValue: "Uninitialized",       TDZ: "YES (Throws ReferenceError)" }
]);

console.log("Module 11 loaded and executed successfully.\n");

