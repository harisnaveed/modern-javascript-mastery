/**
 * ============================================================================
 * MODULE 03: Arrow Functions & Lexical 'this'
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 01 (Variables), Module 02 (Template Literals)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * Prior to ES6, every function was created using the `function` keyword:
 * 
 * A) Verbosity for Small Callbacks:
 *    - Passing a quick 1-line callback to array methods or timers was noisy:
 *        numbers.map(function(num) { return num * 2; });
 * 
 * B) The Dreaded `this` Binding Problem (The Biggest Headache in ES5):
 *    - In traditional JavaScript, every `function` keyword declared its OWN
 *      dynamic `this` binding based on HOW the function was called at runtime.
 *    - Inside asynchronous callbacks (e.g., `setTimeout`, AJAX calls, or event
 *      listeners), the function was executed in a different execution context.
 *      As a result, `this` defaulted to the global object (`window` or `global`),
 *      or `undefined` in strict mode!
 *    - Developers were forced to write awkward workarounds everywhere:
 *        var self = this; // or: var that = this;
 *        setTimeout(function() {
 *            console.log(self.name); // Using cached closure reference
 *        }, 1000);
 *      Or explicitly bind the context:
 *        setTimeout(function() { ... }.bind(this), 1000);
 * 
 * C) The `arguments` Object:
 *    - Traditional functions had a weird, array-like (but not a real Array)
 *      `arguments` object that was confusing to manipulate.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP 7.4+, short arrow functions were introduced:
 *     $multiplier = 2;
 *     $doubled = array_map(fn($n) => $n * $multiplier, $numbers);
 * - In older PHP, anonymous functions required explicit `use ($var)` clauses
 *   to access outer scope variables.
 * - In modern JavaScript, arrow functions automatically capture the outer scope
 *   and bind `this` lexically—no `use ($var)` or `.bind(this)` required.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION (ES6: Arrow Functions)
 * ----------------------------------------------------------------------------
 * Arrow functions (`=>`) provide a concise syntax and lexical `this` binding:
 * 1. Concise Syntax:
 *    - Parameter parenthesis optional for a single parameter: `x => x * 2`
 *    - Implicit return when omitting curly braces: `(a, b) => a + b`
 * 2. Lexical `this` Binding:
 *    - Arrow functions DO NOT have their own `this`. They capture `this` from
 *      the surrounding execution context at the moment they are defined.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Returning Object Literals Implicitly
 *    - In JS, `{}` represents both a function body block AND an object literal.
 *    - If you write: `const getUser = () => { name: "Haris" };`, the engine
 *      interprets `{ name: ... }` as a code block with a label, returning `undefined`!
 *    - Solution: Wrap the object in parentheses: `const getUser = () => ({ name: "Haris" });`
 * 
 * Gotcha 2: Arrow Functions CANNOT be Constructors
 *    - They do not have a `[[Construct]]` internal method or a `prototype` property.
 *    - Calling `new ArrowFunc()` throws a `TypeError: ArrowFunc is not a constructor`.
 * 
 * Gotcha 3: No `arguments` Object
 *    - Arrow functions do not have an `arguments` keyword.
 *    - Use modern rest parameters instead: `(...args) => { console.log(args); }`
 * 
 * Gotcha 4: When NOT to Use Arrow Functions
 *    - Never use arrow functions as object methods when the method needs to
 *      access object properties via `this`:
 *        const user = { name: "Haris", greet: () => `Hello ${this.name}` }; // FAILS!
 *    - Never use them as prototype methods or DOM event listeners where `this`
 *      is expected to be the triggering element.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React Functional Components:
 *     const UserCard = ({ name, email }) => <div>...</div>;
 * - Inline Event Handlers in JSX:
 *     <button onClick={() => deleteUser(user.id)}>Delete</button>
 * - Array operations inside JSX render:
 *     {products.map(p => <ProductItem key={p.id} {...p} />)}
 * - Express.js / Node.js route handlers:
 *     app.get("/api/users", (req, res) => res.json(users));
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 03: Arrow Functions & Lexical 'this'");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SYNTAX COMPARISON & EVOLUTION
// ----------------------------------------------------------------------------
console.log("--- 1. SYNTAX COMPARISON ---");

// Traditional Function Declaration:
function addTraditional(a, b) {
    return a + b;
}

// Arrow Function (explicit block body with return):
const addExplicit = (a, b) => {
    return a + b;
};

// Arrow Function (concise body with implicit return):
const addConcise = (a, b) => a + b;

console.log("Traditional:", addTraditional(10, 20));
console.log("Arrow (explicit):", addExplicit(10, 20));
console.log("Arrow (concise):", addConcise(10, 20));

// Single parameter (parentheses are optional):
const square = n => n * n;
console.log("Square of 5:", square(5));

// Zero parameters (empty parentheses required):
const getTimestamp = () => Date.now();
console.log("Current timestamp:", getTimestamp());

console.log();

// ----------------------------------------------------------------------------
// 2. THE OBJECT LITERAL RETURN GOTCHA
// ----------------------------------------------------------------------------
console.log("--- 2. RETURNING OBJECT LITERALS ---");

// INCORRECT (SyntaxError / Parsing Confusion):
// If you write: const makeUserBroken = (id, name) => { id: id, name: name };
// JavaScript parses the '{' as a code block and 'id:' as a label, throwing a SyntaxError!
// Or with a single property: `(x) => { count: x }` parses as a label and returns undefined.
const makeSingleProp = (count) => { count: count };
console.log("Broken object return (label statement):", makeSingleProp(42)); // returns undefined!

// CORRECT: Wrap object in parentheses ({ ... }) so JS treats it as an expression:
const makeUserCorrect = (id, name) => ({ id: id, name: name });
console.log("Correct object return:", makeUserCorrect(1, "Haris")); // { id: 1, name: "Haris" }

console.log();

// ----------------------------------------------------------------------------
// 3. THE 'THIS' BINDING PROBLEM: TRADITIONAL VS ARROW
// ----------------------------------------------------------------------------
console.log("--- 3. THE 'THIS' BINDING PROBLEM ---");

// Scenario: A timer or callback inside a class/object.
// In ES5, developers used 'var self = this':
const oldStyleTimer = {
    teamName: "Cloud Engineering",
    members: ["Haris", "Ayesha", "Usman"],
    
    printMembersOldWay: function() {
        var self = this; // Preserving reference before entering callback
        
        console.log(`[ES5] Team: ${this.teamName}`);
        this.members.forEach(function(member) {
            // In here, 'this' is lost! 'this.teamName' would be undefined.
            // So we must use 'self.teamName':
            console.log(` - ${member} (Team: ${self.teamName})`);
        });
    }
};
oldStyleTimer.printMembersOldWay();

console.log();

// In ES6, arrow functions retain 'this' lexically from printMembersModern:
const modernStyleTimer = {
    teamName: "AI Architecture",
    members: ["Zain", "Fatima", "Bilal"],
    
    printMembersModern: function() {
        console.log(`[ES6] Team: ${this.teamName}`);
        // The arrow function inherits 'this' directly from printMembersModern:
        this.members.forEach(member => {
            console.log(` - ${member} (Team: ${this.teamName})`);
        });
    }
};
modernStyleTimer.printMembersModern();

console.log();

// ----------------------------------------------------------------------------
// 4. WHEN NOT TO USE ARROW FUNCTIONS (OBJECT METHODS)
// ----------------------------------------------------------------------------
console.log("--- 4. WHEN NOT TO USE ARROW FUNCTIONS ---");

const profile = {
    username: "haris_dev",
    
    // BAD: Arrow function as an object method
    // 'this' is NOT 'profile'! It points to the outer lexical scope (module or global).
    badGreet: () => {
        return `Hello from @${this ? this.username : "undefined"}`;
    },
    
    // GOOD: ES6 Method Shorthand (preserves dynamic object 'this')
    goodGreet() {
        return `Hello from @${this.username}`;
    }
};

console.log("Arrow method (broken 'this'):", profile.badGreet());
console.log("Standard method (correct 'this'):", profile.goodGreet());

console.log();

// ----------------------------------------------------------------------------
// 5. NO 'ARGUMENTS' OBJECT & NO 'NEW' CONSTRUCTOR
// ----------------------------------------------------------------------------
console.log("--- 5. ARGUMENTS & CONSTRUCTOR CONSTRAINTS ---");

// A) No 'arguments' object in arrow functions:
const modernSum = (...numbers) => {
    // We use Rest parameters (...numbers) instead of the old 'arguments' keyword:
    return numbers.reduce((total, n) => total + n, 0);
};
console.log("Rest parameter sum (10 + 20 + 30 + 40):", modernSum(10, 20, 30, 40));

// B) Cannot use arrow functions as constructors with 'new':
const Developer = (name) => {
    this.name = name;
};

try {
    // @ts-ignore
    const dev = new Developer("Haris");
} catch (error) {
    console.log("Attempting 'new ArrowFunction()' caught error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. ARROW FUNCTION DECISION MATRIX ---");
console.table([
    { Feature: "this Binding", TraditionalFunction: "Dynamic (depends on caller)", ArrowFunction: "Lexical (inherits from parent)" },
    { Feature: "Can use 'new'?", TraditionalFunction: "Yes (acts as constructor)", ArrowFunction: "No (throws TypeError)" },
    { Feature: "Has 'arguments'?", TraditionalFunction: "Yes (array-like object)", ArrowFunction: "No (use ...rest params)" },
    { Feature: "Syntax length", TraditionalFunction: "Verbose (function keyword)", ArrowFunction: "Concise (=> with implicit return)" },
    { Feature: "Ideal for Methods?", TraditionalFunction: "Yes (object methods)", ArrowFunction: "No (use for callbacks & handlers)" }
]);

console.log("Module 03 loaded and executed successfully.\n");
