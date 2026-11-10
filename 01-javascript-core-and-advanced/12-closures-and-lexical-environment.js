/**
 * ============================================================================
 * MODULE 12: Closures & Lexical Environments
 * Specification: ECMAScript Core Concept
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 11 (Scope & Hoisting)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript, the language lacked:
 * - Classes
 * - Private fields (`#privateField`)
 * - Native module system (`import` / `export`)
 * 
 * Every variable created in a `<script>` tag risked leaking into the global
 * `window` object, causing catastrophic collisions between libraries (e.g., jQuery,
 * Prototype, MooTools all competing for `$`).
 * 
 * To solve this, early JavaScript architects relied on **Closures** and the
 * **Module Pattern (IIFE)** as the ONLY mechanism for data privacy, state
 * encapsulation, and namespace protection.
 * 
 * WHAT IS A CLOSURE?
 * A closure is a function that retains access to variables from its outer
 * (enclosing) lexical scope, EVEN AFTER the outer function has finished executing
 * and has been removed from the Call Stack!
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, closures do NOT automatically capture the outer scope!
 *   You must explicitly specify which variables to import via `use`:
 *     $tax = 0.15;
 *     $calc = function($amount) use ($tax) { return $amount * (1 + $tax); };
 * - In JavaScript, closures are native, implicit, and automatic:
 *   Every function permanently remembers the scope in which it was born.
 *
 *
 * 3. UNDER THE HOOD: HOW CLOSURES WORK IN MEMORY
 * ----------------------------------------------------------------------------
 * 1. When `outerFunction()` is called, the JavaScript engine allocates a
 *    new Execution Context and Lexical Environment on the Heap.
 * 2. When `outerFunction()` finishes, its execution frame pops off the Call Stack.
 * 3. In most languages (like C), local stack variables are immediately deleted.
 * 4. BUT in JavaScript, if an `innerFunction` references variables from that outer
 *    scope, the Garbage Collector (GC) detects active references and KEEPS that
 *    Lexical Environment alive in heap memory!
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: The "Stale Closure" Trap (THE #1 REACT HOOKS BUG!)
 *    - A closure captures variables AT THE TIME IT WAS CREATED.
 *    - In React `useEffect`, `useCallback`, or `setTimeout`, if a callback captures
 *      a piece of state and isn't recreated when that state updates, the closure
 *      remains stuck with the old ("stale") value!
 * 
 * Gotcha 2: Unintentional Memory Leaks
 *    - Because closures prevent garbage collection of referenced variables,
 *      holding onto a closure that references a massive array or DOM element
 *      keeps that entire structure in RAM indefinitely.
 * 
 * Gotcha 3: Closures Share References, Not Copies
 *    - Closures do not take a static "snapshot" copy of a variable—they hold a
 *      live reference to the variable itself! If the outer variable changes,
 *      the closure sees the updated value.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - **React Hooks (`useState`, `useEffect`, `useRef`)**:
 *   The entire React Hooks architecture is built on closures! React maintains
 *   a linked list of hook records inside the component Fiber, and each render
 *   closes over the current state index.
 * - **Function Factories & Middleware**:
 *   Express middleware generators: `authorizeRole("ADMIN")` returns `(req, res, next) => ...`
 * - **Memoization & Caching**: Caching expensive database or API calls in memory.
 * - **Rate Limiting & Debouncing**: Remembering timers and call counts across invocations.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 12: Closures & Lexical Environments");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. CLASSIC CLOSURE: PRIVATE STATE ENCAPSULATION
// ----------------------------------------------------------------------------
console.log("--- 1. PRIVATE STATE ENCAPSULATION (DATA PRIVACY) ---");

function createBankAccount(initialBalance, accountHolder) {
    // 'balance' and 'holder' are private local variables!
    // They cannot be directly read or modified from the outside.
    let balance = initialBalance;
    const holder = accountHolder;
    const transactionHistory = [];

    return {
        deposit(amount) {
            if (amount <= 0) return "Invalid deposit amount.";
            balance += amount;
            transactionHistory.push(`Deposited: +$${amount}`);
            return `Deposit successful. New balance: $${balance}`;
        },
        withdraw(amount) {
            if (amount > balance) return "Insufficient funds!";
            balance -= amount;
            transactionHistory.push(`Withdrew: -$${amount}`);
            return `Withdrawal successful. Remaining balance: $${balance}`;
        },
        getBalance() {
            return `Account [${holder}]: $${balance}`;
        },
        getHistory() {
            return [...transactionHistory]; // Return shallow copy to preserve privacy
        }
    };
}

const harisAccount = createBankAccount(1000, "Haris Ali");

// Note: createBankAccount has FINISHED executing and popped off the Call Stack.
// Yet harisAccount methods still have full access to 'balance' via closure:
console.log(harisAccount.getBalance());
console.log(harisAccount.deposit(500));
console.log(harisAccount.withdraw(200));
console.log(harisAccount.getBalance());

// Proving True Privacy:
// @ts-ignore
console.log("Direct access to private 'balance':", harisAccount.balance); // undefined!

console.log();

// ----------------------------------------------------------------------------
// 2. FUNCTION FACTORIES (CUSTOM CONFIGURATION GENERATORS)
// ----------------------------------------------------------------------------
console.log("--- 2. FUNCTION FACTORIES ---");

// A higher-order function that generates specialized discount calculators:
function createDiscountCalculator(discountTier, percentage) {
    // 'discountTier' and 'percentage' are closed over by the returned function:
    return function(orderTotal) {
        const savings = orderTotal * percentage;
        const finalPrice = orderTotal - savings;
        return `[Tier: ${discountTier}] Original: $${orderTotal} | Saved: $${savings.toFixed(2)} | Total: $${finalPrice.toFixed(2)}`;
    };
}

const silverDiscount = createDiscountCalculator("SILVER", 0.05); // 5%
const goldDiscount   = createDiscountCalculator("GOLD", 0.15);   // 15%
const vipDiscount    = createDiscountCalculator("VIP", 0.25);    // 25%

console.log(silverDiscount(200));
console.log(goldDiscount(200));
console.log(vipDiscount(200));

console.log();

// ----------------------------------------------------------------------------
// 3. MEMOIZATION (PERFORMANCE CACHING VIA CLOSURE)
// ----------------------------------------------------------------------------
console.log("--- 3. MEMOIZATION CACHE ---");

function memoizeHeavyCalculation(expensiveFn) {
    // 'cache' object is held permanently in closure:
    const cache = {};

    return function(n) {
        if (n in cache) {
            console.log(`[Cache Hit] Returning cached result for input: ${n}`);
            return cache[n];
        }

        console.log(`[Computing...] Running expensive calculation for input: ${n}`);
        const result = expensiveFn(n);
        cache[n] = result;
        return result;
    };
}

// Simulated expensive square calculation:
const slowSquare = n => {
    // Artificial workload
    let sum = 0;
    for (let i = 0; i < 1e6; i++) sum += i;
    return n * n;
};

const fastSquare = memoizeHeavyCalculation(slowSquare);

console.log("Call 1:", fastSquare(9));  // Computes
console.log("Call 2:", fastSquare(9));  // Instant Cache Hit!
console.log("Call 3:", fastSquare(12)); // Computes
console.log("Call 4:", fastSquare(12)); // Instant Cache Hit!

console.log();

// ----------------------------------------------------------------------------
// 4. THE "STALE CLOSURE" DEMONSTRATION (CRITICAL FOR REACT)
// ----------------------------------------------------------------------------
console.log("--- 4. THE STALE CLOSURE PHENOMENON ---");

function simulateStaleClosure() {
    let count = 0;

    // This closure captures 'count' at the moment of definition (count = 0):
    function logCount() {
        console.log(`[Closure Snapshot] Count is: ${count}`);
    }

    count = 5; // count is mutated later

    // Returns both the logger and an updater:
    return {
        log: logCount,
        increment() { count++; }
    };
}

const counter = simulateStaleClosure();
// In this case, closures hold a reference, so it logs 5:
counter.log(); // 5

// BUT in asynchronous code with captured values (like React useEffect):
let currentReactState = "Initial State";

// Timer captures currentReactState snapshot at time T=0:
setTimeout(() => {
    // If this timer callback closed over an immutable snapshot, it would stay "Initial State":
    // console.log("Async log:", currentReactState);
}, 50);

currentReactState = "Updated State"; // State changes at T=1

console.log();

// ----------------------------------------------------------------------------
// 5. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 5. CLOSURE ARCHITECTURE CHEAT SHEET ---");
console.table([
    { Concept: "Lexical Environment", WhatItIs: "The internal engine map of local identifiers and their values" },
    { Concept: "Closure", WhatItIs: "Function + its Lexical Environment bundle, preserved across stack lifecycles" },
    { Concept: "Data Privacy", WhatItIs: "Hiding internal state from outside tampering (pre-ES2022 private fields)" },
    { Concept: "Function Factory", WhatItIs: "Configuring a template function with presets and returning specialized variants" },
    { Concept: "Stale Closure", WhatItIs: "Holding onto outdated variable references inside async or memoized callbacks" }
]);

console.log("Module 12 loaded and executed successfully.\n");

