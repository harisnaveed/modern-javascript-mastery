/**
 * ============================================================================
 * MODULE 14: The 'this' Keyword & Execution Context
 * Specification: ECMAScript Core Concept
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 03 (Arrow Functions), Module 11 (Scope & Hoisting)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In most object-oriented languages (PHP, Java, C++, Python), `$this` or `this`
 * is simple and predictable: it ALWAYS refers to the instance of the class
 * executing the method.
 * 
 * In JavaScript, `this` has notoriously caused more confusion than almost any
 * other feature. Why?
 * Because in JavaScript, **`this` is NOT bound to where the function is declared!**
 * (Except for arrow functions).
 * 
 * Instead, for regular functions, **`this` is determined dynamically by HOW and
 * WHERE the function is CALLED at runtime (the "Call-Site").**
 * 
 * THE HISTORICAL BUGS IN PRE-ES6:
 * A) Detaching Methods:
 *    - If you assigned an object's method to a variable:
 *        var fn = user.greet;
 *        fn(); // CRASH! 'this' was lost and pointed to window/undefined!
 * 
 * B) Passing Methods as Callbacks:
 *    - Passing an object method to an event listener or timer:
 *        button.addEventListener("click", user.handleClick);
 *      Inside `handleClick`, `this` was the `<button>` DOM element, NOT `user`!
 * 
 * C) Losing Context in Nested Functions:
 *    - In ES5, helper functions inside an object method defaulted back to
 *      the global object instead of the parent method's `this`.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, `$this` is locked to the class instance:
 *     class User {
 *         public function greet() { return $this->name; }
 *     }
 *   Calling `$this` outside an instantiated class throws a fatal PHP error:
 *   `Fatal error: Using $this when not in object context`.
 * - In JavaScript, standalone top-level functions still have a `this`!
 *
 *
 * 3. THE 4 RULES OF 'THIS' BINDING (HOW THE JS ENGINE RESOLVES 'THIS')
 * ----------------------------------------------------------------------------
 * To know what `this` points to, inspect the CALL-SITE and apply these 4 rules in order:
 * 
 * RULE 1: Default Binding (Standalone Function Call)
 *   - Called as `foo()`
 *   - Non-Strict Mode: `this` points to the Global Object (`globalThis` / `window`).
 *   - Strict Mode (`"use strict"`): `this` is `undefined`.
 * 
 * RULE 2: Implicit Binding (Object Method Call)
 *   - Called with context object preceding the dot: `user.greet()`
 *   - `this` points to the object immediately to the left of the dot (`user`).
 * 
 * RULE 3: Explicit Binding (`call`, `apply`, `bind`)
 *   - Explicitly forcing `this` using function prototype methods:
 *     - `fn.call(context, arg1, arg2)`: Executes immediately with comma args.
 *     - `fn.apply(context, [arg1, arg2])`: Executes immediately with array args.
 *     - `fn.bind(context, arg1, arg2)`: Does NOT execute immediately. Returns a
 *       brand new function with `this` permanently locked to `context`.
 * 
 * RULE 4: `new` Binding (Constructor Function Call)
 *   - Called with `new Foo()`
 *   - Creates a new empty object `{}` and binds `this` to that newly created object.
 * 
 * SPECIAL EXCEPTION: Arrow Functions (Lexical Binding)
 *   - Arrow functions BYPASS all 4 rules above!
 *   - They do NOT have their own `this`. They capture `this` from the enclosing
 *     lexical scope at the moment they are defined.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: The "Losing Implicit Binding" Trap
 *    - `const detached = user.greet; detached();` -> Falls back to Rule 1 (Default Binding)!
 * 
 * Gotcha 2: Hard Binding is Irreversible
 *    - Once a function is bound via `.bind(objA)`, calling `.call(objB)` or
 *      `.bind(objB)` on it CANNOT change its `this`!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Legacy React Class Components:
 *     constructor() {
 *         super();
 *         this.handleClick = this.handleClick.bind(this); // Explicit binding!
 *     }
 * - Node.js EventEmitters:
 *     emitter.on("data", function() {
 *         console.log(this); // 'this' points to the EventEmitter instance
 *     });
 * - Method Borrowing across utility libraries.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 14: The 'this' Keyword & Execution Context");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. RULE 1: DEFAULT BINDING (STANDALONE CALL)
// ----------------------------------------------------------------------------
console.log("--- 1. RULE 1: DEFAULT BINDING ---");

function showDefaultThis() {
    // In Node.js non-strict mode, 'this' is global. In strict mode, it is undefined:
    return this === undefined ? "undefined (Strict Mode)" : "global object (Loose Mode)";
}
console.log("Standalone call 'this':", showDefaultThis());

console.log();

// ----------------------------------------------------------------------------
// 2. RULE 2: IMPLICIT BINDING (OBJECT METHOD CALL)
// ----------------------------------------------------------------------------
console.log("--- 2. RULE 2: IMPLICIT BINDING ---");

const developer = {
    name: "Haris Ali",
    role: "Fullstack Architect",
    introduce() {
        return `Hello, I'm ${this.name}, working as a ${this.role}.`;
    }
};

// Called as developer.introduce() -> 'this' is developer:
console.log("Implicit binding:", developer.introduce());

// THE GOTCHA: Losing Implicit Binding by assigning to a variable:
const detachedIntroduce = developer.introduce;
try {
    // Calling detachedIntroduce() has NO object before the dot!
    // It reverts to Rule 1 (Default Binding):
    console.log(detachedIntroduce());
} catch (error) {
    console.log("Detached method lost 'this' error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 3. RULE 3: EXPLICIT BINDING (CALL, APPLY, BIND)
// ----------------------------------------------------------------------------
console.log("--- 3. RULE 3: EXPLICIT BINDING (CALL, APPLY, BIND) ---");

function printInvoice(taxRate, currencySymbol) {
    const subtotal = this.amount;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return `[Invoice #${this.invoiceId}] Subtotal: ${currencySymbol}${subtotal} | Total: ${currencySymbol}${total.toFixed(2)}`;
}

const invoiceA = { invoiceId: "INV-1001", amount: 200 };
const invoiceB = { invoiceId: "INV-1002", amount: 500 };

// A) .call(): Pass context as 1st argument, followed by comma-separated arguments:
console.log("Using .call(): ", printInvoice.call(invoiceA, 0.10, "$"));

// B) .apply(): Pass context as 1st argument, followed by arguments in an ARRAY:
console.log("Using .apply():", printInvoice.apply(invoiceB, [0.15, "€"]));

// C) .bind(): Returns a new function with 'this' locked permanently:
const boundInvoiceA = printInvoice.bind(invoiceA, 0.20, "£");
console.log("Using .bind(): ", boundInvoiceA()); // Invoked later!

// Proving hard-binding cannot be overridden:
console.log("Overriding .bind() fails:", boundInvoiceA.call(invoiceB)); // Still uses invoiceA!

console.log();

// ----------------------------------------------------------------------------
// 4. RULE 4: NEW BINDING (CONSTRUCTOR FUNCTIONS)
// ----------------------------------------------------------------------------
console.log("--- 4. RULE 4: 'NEW' BINDING ---");

function UserAccount(username, email) {
    // When invoked with 'new':
    // 1. A new object {} is created.
    // 2. 'this' is bound to that new object.
    // 3. Properties are assigned to 'this'.
    // 4. The new object is returned automatically.
    this.username = username;
    this.email = email;
    this.createdAt = new Date().toISOString().slice(0, 10);
}

const newUser = new UserAccount("haris_dev", "haris@dev.com");
console.log("Constructed user instance:", newUser);

console.log();

// ----------------------------------------------------------------------------
// 5. LEXICAL 'THIS' IN ARROW FUNCTIONS
// ----------------------------------------------------------------------------
console.log("--- 5. ARROW FUNCTIONS (LEXICAL 'THIS') ---");

const teamManager = {
    department: "Cloud Engineering",
    engineers: ["Haris", "Ayesha", "Usman"],

    // Traditional method has implicit 'this' = teamManager:
    announceTeam() {
        // Arrow function inside here inherits 'this' from announceTeam:
        this.engineers.forEach(engineer => {
            console.log(` - ${engineer} belongs to ${this.department}`);
        });
    }
};

teamManager.announceTeam();

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET: PRECEDENCE OF 'THIS' RULES
// ----------------------------------------------------------------------------
console.log("--- 6. 'THIS' RESOLUTION ORDER (PRECEDENCE) ---");
console.table([
    { Precedence: "1 (Highest)", Rule: "Arrow Function", Explanation: "Inherits 'this' from surrounding lexical scope at definition time" },
    { Precedence: "2",           Rule: "new Binding",    Explanation: "new Foo() -> 'this' is the freshly created empty object" },
    { Precedence: "3",           Rule: "Explicit Binding", Explanation: "fn.call(), fn.apply(), or fn.bind() manually sets 'this'" },
    { Precedence: "4",           Rule: "Implicit Binding", Explanation: "obj.fn() -> 'this' is the object before the dot" },
    { Precedence: "5 (Lowest)",  Rule: "Default Binding",  Explanation: "fn() -> 'this' is global object (loose) or undefined (strict)" }
]);

console.log("Module 14 loaded and executed successfully.\n");

