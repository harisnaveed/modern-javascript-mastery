/**
 * ============================================================================
 * MODULE 15: Prototypes & Prototypal Inheritance
 * Specification: ECMAScript Core Concept
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 14 (The 'this' Keyword)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * When Brendan Eich created JavaScript in 1995, he chose NOT to implement
 * classical class-based inheritance like Java or C++. Instead, he implemented
 * **Prototypal Inheritance** (inspired by the Self programming language).
 * 
 * In pre-ES6, creating reusable models and hierarchies required verbose wiring:
 * 
 *     function Animal(name) { this.name = name; }
 *     Animal.prototype.eat = function() { console.log("Eating"); };
 * 
 *     function Dog(name, breed) {
 *         Animal.call(this, name); // Super constructor
 *         this.breed = breed;
 *     }
 *     // Manually linking prototype chain:
 *     Dog.prototype = Object.create(Animal.prototype);
 *     Dog.prototype.constructor = Dog; // Fixing constructor reference!
 * 
 * WHY LEARN PROTOTYPES TODAY?
 * ES6 introduced the `class` keyword, but **ES6 classes are merely syntactic
 * sugar over this exact prototype engine!**
 * Understanding prototypes unlocks the internal architecture of V8, memory
 * optimization, polyfilling, and object delegation.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - Classical Inheritance (PHP / Java):
 *   Classes are blueprints. When you run `$user = new User()`, PHP copies the
 *   blueprint into a separate instance in memory. Classes inherit from classes.
 * - Prototypal Inheritance (JavaScript):
 *   There are NO blueprints! Objects inherit directly from other live OBJECTS!
 *   It is a **Delegation System**: If an object doesn't have a property, it asks
 *   its prototype. If its prototype doesn't have it, it asks the next prototype,
 *   all the way up the chain to `Object.prototype`.
 *
 *
 * 3. THE PROTOTYPE CHAIN MECHANICS
 * ----------------------------------------------------------------------------
 * - `[[Prototype]]`: The internal hidden slot on every object pointing to its parent prototype.
 * - `Object.getPrototypeOf(obj)`: The official standard method to read `[[Prototype]]`.
 * - `Function.prototype`: A property that exists ONLY on functions, used to assign
 *   the `[[Prototype]]` to instances created with `new Function()`.
 * - The Chain:
 *     `dog -> Dog.prototype -> Animal.prototype -> Object.prototype -> null`
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `Object.hasOwn()` vs `in` Operator
 *    - `'eat' in dog` returns `true` (scans the entire prototype chain).
 *    - `Object.hasOwn(dog, 'eat')` returns `false` (checks ONLY own properties).
 * 
 * Gotcha 2: Memory Efficiency of Prototypes
 *    - If you define a method inside `function User() { this.greet = ... }`,
 *      creating 10,000 users duplicates 10,000 identical functions in RAM!
 *    - If defined on `User.prototype.greet`, all 10,000 users share 1 single function.
 * 
 * Gotcha 3: The Prototype Pollution Security Hazard
 *    - In Node.js backend apps, merging untrusted user JSON into `Object.prototype`
 *      pollutes every object in the runtime! Always validate or use `Object.create(null)`.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Performance Optimization: Shared method caching in backend domain services.
 * - High-speed dictionaries: `Object.create(null)` creates an object with NO
 *   prototype, completely immune to prototype pollution and hash collisions.
 * - Polyfills for modern JavaScript runtimes.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 15: Prototypes & Prototypal Inheritance");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. CONSTRUCTOR FUNCTIONS & THE PROTOTYPE PROPERTY
// ----------------------------------------------------------------------------
console.log("--- 1. CONSTRUCTOR FUNCTIONS & SHARED PROTOTYPES ---");

function User(username, role) {
    // Instance-specific properties (allocated per instance):
    this.username = username;
    this.role = role;
}

// Attaching methods to User.prototype (allocated ONCE in memory, shared by all instances):
User.prototype.getDetails = function() {
    return `User: @${this.username} | Role: ${this.role}`;
};

const userA = new User("haris_dev", "Admin");
const userB = new User("ayesha_dev", "Editor");

console.log(userA.getDetails());
console.log(userB.getDetails());

// PROOF OF SHARED MEMORY:
// Both instances share the exact same function reference in memory:
console.log("Do userA and userB share the same getDetails function? ", userA.getDetails === userB.getDetails); // true!

console.log();

// ----------------------------------------------------------------------------
// 2. TRAVERSING THE PROTOTYPE CHAIN
// ----------------------------------------------------------------------------
console.log("--- 2. THE PROTOTYPE CHAIN (LOOKUP DELEGATION) ---");

// Let's trace userA up the entire prototype chain:
const step1 = Object.getPrototypeOf(userA);
console.log("1. userA prototype:           ", step1 === User.prototype); // true

const step2 = Object.getPrototypeOf(step1);
console.log("2. User.prototype prototype:  ", step2 === Object.prototype); // true

const step3 = Object.getPrototypeOf(step2);
console.log("3. Object.prototype prototype:", step3); // null (The end of the chain!)

// Why does userA.toString() work if we never created it?
// Because it traverses: userA -> User.prototype -> Object.prototype.toString()!
console.log("Inherited Object.toString():  ", userA.toString());

console.log();

// ----------------------------------------------------------------------------
// 3. OBJECT.CREATE(): PURE PROTOTYPAL INHERITANCE (NO CONSTRUCTORS)
// ----------------------------------------------------------------------------
console.log("--- 3. OBJECT.CREATE (PROTOTYPE LINKING WITHOUT CONSTRUCTORS) ---");

const vehicle = {
    type: "Generic Vehicle",
    honk() {
        return `[${this.type}] Beep beep!`;
    }
};

// Object.create(vehicle) sets 'vehicle' as the prototype of 'car':
const electricCar = Object.create(vehicle);
electricCar.type = "Tesla Model 3"; // Property shadowing
electricCar.batteryLevel = "85%";

console.log(electricCar.honk()); // Delegates to vehicle.honk()
console.log("Own battery property:", electricCar.batteryLevel);

console.log();

// ----------------------------------------------------------------------------
// 4. CHECKING OWN PROPERTIES VS INHERITED: OBJECT.HASOWN()
// ----------------------------------------------------------------------------
console.log("--- 4. OBJECT.HASOWN() VS 'IN' OPERATOR ---");

// electricCar has its own 'batteryLevel', but 'honk' is inherited:
console.log("'batteryLevel' in electricCar (in operator):     ", 'batteryLevel' in electricCar); // true
console.log("'honk' in electricCar (in operator):             ", 'honk' in electricCar);         // true

// Object.hasOwn() (ES2022 Modern standard, replacing old hasOwnProperty):
console.log("Object.hasOwn(electricCar, 'batteryLevel'):      ", Object.hasOwn(electricCar, 'batteryLevel')); // true
console.log("Object.hasOwn(electricCar, 'honk'):              ", Object.hasOwn(electricCar, 'honk'));         // false (Inherited!)

console.log();

// ----------------------------------------------------------------------------
// 5. PROTOTYPE POLLUTION DEFENSE: OBJECT.CREATE(NULL)
// ----------------------------------------------------------------------------
console.log("--- 5. DICTIONARIES WITH OBJECT.CREATE(NULL) ---");

// A normal object inherits Object.prototype (e.g. toString, hasOwnProperty):
const normalObj = {};
console.log("Normal object has 'toString'? ", "toString" in normalObj); // true

// A pure dictionary with NO prototype (immune to prototype pollution):
const secureDict = Object.create(null);
secureDict.admin = "Haris";

console.log("Secure dict has 'toString'?   ", "toString" in secureDict); // false
console.log("Secure dict value:            ", secureDict.admin);         // Haris

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. PROTOTYPE TERMINOLOGY CHEAT SHEET ---");
console.table([
    { Term: "[[Prototype]]", Meaning: "Internal hidden link pointing to object's parent prototype" },
    { Term: "Object.getPrototypeOf(obj)", Meaning: "Standard method to retrieve [[Prototype]]" },
    { Term: "Constructor.prototype", Meaning: "Object linked to instances created with 'new Constructor()'" },
    { Term: "Object.create(proto)", Meaning: "Creates an object with explicitly specified prototype" },
    { Term: "Object.hasOwn(obj, prop)", Meaning: "Returns true only if prop is directly on obj (not inherited)" }
]);

console.log("Module 15 loaded and executed successfully.\n");

