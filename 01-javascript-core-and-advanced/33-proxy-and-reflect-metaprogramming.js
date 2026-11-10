/**
 * ============================================================================
 * MODULE 33: Proxy & Reflect (Metaprogramming & Reactivity Engines)
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 09 (Objects), Module 14 (The 'this' Keyword)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6, intercepting object property access or modifications required
 * `Object.defineProperty(obj, prop, { get, set })`.
 * 
 * WHY OBJECT.DEFINEPROPERTY WAS DEEPLY FLAWED:
 * A) Could Not Detect New Properties:
 *    - `Object.defineProperty` had to be run on properties that ALREADY existed!
 *    - If a developer added a brand new property: `user.newField = 10`, JavaScript
 *      could NOT intercept or detect it.
 *    - This was why Vue 2 forced developers to write `Vue.set(user, 'newField', 10)`.
 * 
 * B) Could Not Intercept Property Deletions:
 *    - Calling `delete user.field` bypassed all getters and setters silently.
 * 
 * C) Broken on Arrays:
 *    - Modifying array lengths or calling `.push()` could not be tracked cleanly.
 * 
 * ES6 introduced **`Proxy`** and **`Reflect`** to unlock true Metaprogramming.
 * A Proxy wraps a target object and intercepts fundamental internal operations
 * of the JavaScript engine!
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, magic methods allow intercepting access:
 *     `__get()`, `__set()`, `__isset()`, `__unset()`, `__call()`.
 * - JavaScript's `Proxy` works with the exact same mental model, but provides
 *   13 internal "Traps" covering property lookups, assignments, deletions,
 *   prototype modifications, and function invocations.
 *
 *
 * 3. WHAT POWERS MODERN REACTIVITY & IMMUTABILITY?
 * ----------------------------------------------------------------------------
 * Proxy is the secret engine powering modern frontend tools:
 * 1. **Vue 3 Reactivity**: Uses Proxies to track which component reads which state.
 * 2. **Immer.js (Redux Toolkit / Zustand)**:
 *    - In Redux Toolkit, you write "mutative" code: `state.user.name = "Ali";`
 *    - How is state still immutable? An Immer Proxy intercepts the assignment,
 *      records the draft change, and produces a brand new immutable state tree!
 * 3. **Prisma & ORMs**: Proxies intercept database property access to enable
 *    transparent lazy-loading of relational queries.
 *
 *
 * 4. THE PROXY & REFLECT TWINS
 * ----------------------------------------------------------------------------
 * - `new Proxy(target, handler)`:
 *   - `target`: The original object being wrapped.
 *   - `handler`: An object containing "Traps" (`get`, `set`, `has`, `deleteProperty`).
 * 
 * - `Reflect`:
 *   - A built-in object providing default implementations for all 13 proxy traps.
 *   - Always use `Reflect.get()` and `Reflect.set()` inside your traps to ensure
 *     proper prototype inheritance and correct `this` binding (the `receiver`).
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Automatic Data Validation & Type Safety at runtime.
 * - Reactive state tracking and audit logging.
 * - Negative array indexing (`array[-1]`) emulation.
 * - Secure API mock wrappers.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 33: Proxy & Reflect (Metaprogramming & Reactivity)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. RUNTIME TYPE & SCHEMA VALIDATION PROXY
// ----------------------------------------------------------------------------
console.log("--- 1. RUNTIME SCHEMA VALIDATION PROXY ---");

const rawUserData = {
    username: "haris_dev",
    age: 25,
    email: "haris@dev.com"
};

// Define traps to guard the object:
const validationHandler = {
    // Intercept property assignments (obj.prop = value):
    set(target, property, value, receiver) {
        if (property === "age") {
            if (typeof value !== "number" || !Number.isInteger(value)) {
                throw new TypeError(`[Validation Error] 'age' must be an integer! Got: ${typeof value}`);
            }
            if (value < 18 || value > 120) {
                throw new RangeError(`[Validation Error] 'age' must be between 18 and 120! Got: ${value}`);
            }
        }

        if (property === "email") {
            if (typeof value !== "string" || !value.includes("@")) {
                throw new TypeError(`[Validation Error] Invalid email format: '${value}'`);
            }
        }

        console.log(`[Proxy: set] Validated property '${property}' =>`, value);
        // Delegate to Reflect to perform the actual assignment safely:
        return Reflect.set(target, property, value, receiver);
    }
};

const userProxy = new Proxy(rawUserData, validationHandler);

// Valid modifications:
userProxy.age = 26;
userProxy.email = "haris_updated@dev.com";

// Invalid modifications (intercepted and rejected!):
try {
    // @ts-ignore
    userProxy.age = "twenty-five";
} catch (error) {
    console.log("Caught validation error:", error.message);
}

try {
    userProxy.age = 15; // Below age limit
} catch (error) {
    console.log("Caught validation error:", error.message);
}

console.log();

// ----------------------------------------------------------------------------
// 2. NEGATIVE ARRAY INDEXING USING PROXY (PYTHON-STYLE ARR[-1])
// ----------------------------------------------------------------------------
console.log("--- 2. PYTHON-STYLE NEGATIVE ARRAY INDEXING ---");

function createSmartArray(...elements) {
    const targetArray = [...elements];

    return new Proxy(targetArray, {
        get(target, prop, receiver) {
            // Check if accessing a numeric index:
            if (typeof prop === "string" && !isNaN(Number(prop))) {
                let index = Number(prop);
                // Convert negative index (e.g. -1 becomes target.length - 1):
                if (index < 0) {
                    index = target.length + index;
                }
                return Reflect.get(target, index, receiver);
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}

const smartList = createSmartArray("JavaScript", "React", "Next.js", "Node.js");

console.log("smartList[0]  (first):      ", smartList[0]);   // JavaScript
console.log("smartList[-1] (last):       ", smartList[-1]);  // Node.js
console.log("smartList[-2] (second-last):", smartList[-2]);  // Next.js

console.log();

// ----------------------------------------------------------------------------
// 3. REACTIVE STATE ENGINE (SIMULATING VUE 3 / MOBX REACTIVITY)
// ----------------------------------------------------------------------------
console.log("--- 3. REACTIVE STATE ENGINE (SIMULATING VUE 3 REACTIVITY) ---");

function createReactiveState(initialState, onStateChangeCallback) {
    return new Proxy(initialState, {
        get(target, prop, receiver) {
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            const oldValue = target[prop];
            const success = Reflect.set(target, prop, value, receiver);

            if (success && oldValue !== value) {
                // Notify observers that state changed!
                onStateChangeCallback(prop, oldValue, value);
            }
            return success;
        }
    });
}

const appState = createReactiveState(
    { theme: "light", unreadNotifications: 0 },
    (key, oldVal, newVal) => {
        console.log(`[Reactivity Engine] Key '${key}' changed from '${oldVal}' to '${newVal}'! Triggering UI re-render...`);
    }
);

appState.theme = "dark";
appState.unreadNotifications = 5;

console.log();

// ----------------------------------------------------------------------------
// 4. SUMMARY CHEAT SHEET
// ----------------------------------------------------------------------------
console.log("--- 4. PROXY TRAPS CHEAT SHEET ---");
console.table([
    { Trap: "get(target, prop, receiver)", TriggersWhen: "Reading a property: obj.x or obj['x']" },
    { Trap: "set(target, prop, val, receiver)", TriggersWhen: "Writing a property: obj.x = 10" },
    { Trap: "has(target, prop)", TriggersWhen: "Checking membership: 'x' in obj" },
    { Trap: "deleteProperty(target, prop)", TriggersWhen: "Deleting a property: delete obj.x" },
    { Trap: "apply(target, thisArg, args)", TriggersWhen: "Calling a function: fn(...args)" }
]);

console.log("Module 33 loaded and executed successfully.\n");

