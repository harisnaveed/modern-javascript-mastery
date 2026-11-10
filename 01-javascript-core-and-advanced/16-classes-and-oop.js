/**
 * ============================================================================
 * MODULE 16: Classes & Object-Oriented JavaScript
 * Specification: ECMAScript 2015 (ES6) / ES2022 (Private Fields)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 14 (The 'this' Keyword), Module 15 (Prototypes)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6, writing object-oriented JavaScript was notoriously awkward:
 * 
 *     function Person(name) { this.name = name; }
 *     Person.prototype.greet = function() { ... };
 * 
 *     function Employee(name, title) {
 *         Person.call(this, name); // Super constructor hack
 *         this.title = title;
 *     }
 *     Employee.prototype = Object.create(Person.prototype);
 *     Employee.prototype.constructor = Employee;
 * 
 * Major Pain Points:
 * - Every framework (Backbone, Dojo, Prototype.js) invented its own class macro.
 * - Developers coming from PHP, Java, or C# found constructor functions confusing.
 * - True private variables did not exist on objects without closures.
 * 
 * ES6 introduced `class` syntax to standardize OOP across JavaScript, while
 * preserving the speed and efficiency of JavaScript's prototype engine under the hood.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - ES6 class syntax maps almost 1:1 with PHP:
 *     JavaScript:                     PHP:
 *     `class Dog extends Animal`      `class Dog extends Animal`
 *     `constructor(name) { ... }`     `public function __construct($name) { ... }`
 *     `super(name);`                  `parent::__construct($name);`
 *     `static create() { ... }`       `public static function create() { ... }`
 *     `#privateField = 10;`           `private $privateField = 10;`
 *
 *
 * 3. THE MODERN JAVASCRIPT CLASS ARCHITECTURE
 * ----------------------------------------------------------------------------
 * - `class ClassName`: Declares a class.
 * - `constructor()`: Special method invoked during `new ClassName()`.
 * - Instance Methods: Clean methods declared directly inside the class body.
 * - Getters and Setters: `get property()` and `set property(val)`.
 * - Inheritance (`extends` & `super`): Subclassing parent classes.
 * - `static` methods: Methods called directly on the class, not instances.
 * - ES2022 Private Class Fields (`#field`): Enforced by the JS runtime engine.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: `super()` MUST Be Called Before `this`!
 *    - In a derived class constructor, accessing `this` before calling `super()`
 *      throws a `ReferenceError: Must call super constructor in derived class`.
 * 
 * Gotcha 2: Classes are NOT Hoisted!
 *    - Unlike function declarations, classes live in the Temporal Dead Zone (TDZ).
 *    - You CANNOT instantiate a class before its declaration line!
 * 
 * Gotcha 3: Classes Automatically Run in Strict Mode
 *    - The entire class body is implicitly `"use strict"`.
 * 
 * Gotcha 4: True Private Fields (`#`) vs TypeScript `private`
 *    - TypeScript's `private` keyword is compile-time only (erased in JS output).
 *    - ES2022 `#fieldName` is NATIVE runtime privacy (accessing it outside throws SyntaxError).
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Custom Application Errors in Express / Next.js:
 *     class NotFoundError extends AppError { ... }
 * - Backend Service Architecture (Nest.js, Express, Microservices):
 *     class PaymentGateway { ... }
 *     class DatabasePool { ... }
 * - Domain-Driven Design (DDD) domain models.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 16: Classes & Object-Oriented JavaScript");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. BASIC CLASS DECLARATION, CONSTRUCTOR & METHODS
// ----------------------------------------------------------------------------
console.log("--- 1. BASIC CLASS ARCHITECTURE ---");

class User {
    // Constructor initializes instance state:
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.loginCount = 0;
    }

    // Prototype method (shared by all instances):
    login() {
        this.loginCount++;
        return `@${this.username} logged in successfully. (Total logins: ${this.loginCount})`;
    }

    // Another prototype method:
    getProfile() {
        return {
            username: this.username,
            email: this.email,
            active: true
        };
    }
}

const userHaris = new User("haris_dev", "haris@dev.com");
console.log(userHaris.login());
console.log(userHaris.login());
console.log("Profile data:", userHaris.getProfile());

console.log();

// ----------------------------------------------------------------------------
// 2. GETTERS, SETTERS & DATA VALIDATION
// ----------------------------------------------------------------------------
console.log("--- 2. GETTERS & SETTERS (VALIDATION LAYER) ---");

class Product {
    constructor(title, initialPrice) {
        this.title = title;
        // Use an internal naming convention for backing variable:
        this._price = initialPrice;
    }

    // Getter acts like a property: product.price
    get price() {
        return `$${this._price.toFixed(2)}`;
    }

    // Setter validates assignments: product.price = 50
    set price(newPrice) {
        if (typeof newPrice !== "number" || newPrice <= 0) {
            console.log(`[Error] Invalid price: ${newPrice}. Price must be greater than 0.`);
            return;
        }
        this._price = newPrice;
    }
}

const laptop = new Product("MacBook Pro", 1999);
console.log("Current price via getter: ", laptop.price); // $1999.00

laptop.price = 2200; // Triggers setter successfully
console.log("Updated price:            ", laptop.price); // $2200.00

laptop.price = -50;  // Rejected by validation logic!
console.log("Price after rejected edit:", laptop.price); // Remains $2200.00

console.log();

// ----------------------------------------------------------------------------
// 3. INHERITANCE (EXTENDS & SUPER)
// ----------------------------------------------------------------------------
console.log("--- 3. INHERITANCE (EXTENDS & SUPER) ---");

class AdminUser extends User {
    constructor(username, email, permissions = []) {
        // MUST call super() before accessing 'this':
        super(username, email);
        this.permissions = permissions;
        this.role = "SUPERADMIN";
    }

    // Method overriding with super call:
    login() {
        // Call parent login method first:
        const baseMessage = super.login();
        return `[ADMIN ALERT] ${baseMessage} [Privileges: ${this.permissions.join(", ")}]`;
    }

    hasPermission(permission) {
        return this.permissions.includes(permission);
    }
}

const admin = new AdminUser("admin_haris", "admin@internal.net", ["DELETE_USER", "DATABASE_MIGRATE"]);
console.log(admin.login());
console.log("Can migrate database? ", admin.hasPermission("DATABASE_MIGRATE"));
console.log("Can format servers?   ", admin.hasPermission("FORMAT_SERVERS"));

console.log();

// ----------------------------------------------------------------------------
// 4. STATIC METHODS & PROPERTIES
// ----------------------------------------------------------------------------
console.log("--- 4. STATIC UTILITY METHODS ---");

class MathUtils {
    // Static properties exist on the class itself, not on instances:
    static PI = 3.14159;

    // Static method: Utility helper
    static calculateCircleArea(radius) {
        return (this.PI * radius * radius).toFixed(2);
    }

    // Factory method (alternative constructor):
    static createFromDiameter(diameter) {
        return Number(this.calculateCircleArea(diameter / 2));
    }
}

// Call directly on the class (no 'new MathUtils()' required):
console.log("Static property PI:         ", MathUtils.PI);
console.log("Area of circle (radius 5):  ", MathUtils.calculateCircleArea(5));
console.log("Area from diameter (10):    ", MathUtils.createFromDiameter(10));

console.log();

// ----------------------------------------------------------------------------
// 5. ES2022 PRIVATE CLASS FIELDS & METHODS (#)
// ----------------------------------------------------------------------------
console.log("--- 5. ES2022 NATIVE PRIVATE FIELDS (#) ---");

class SecureWallet {
    // Private field declarations starting with '#'
    #balance = 0;
    #pin;

    constructor(initialDeposit, pinCode) {
        this.#balance = initialDeposit;
        this.#pin = pinCode;
        this.owner = "Haris Ali"; // Public property
    }

    // Private method: Can only be called inside this class
    #validatePin(enteredPin) {
        return this.#pin === enteredPin;
    }

    withdraw(amount, enteredPin) {
        if (!this.#validatePin(enteredPin)) {
            return "[Security Warning] Unauthorized! Invalid PIN.";
        }
        if (amount > this.#balance) {
            return "[Error] Insufficient funds.";
        }
        this.#balance -= amount;
        return `Withdrawal approved. Dispensing $${amount}. Remaining balance: $${this.#balance}`;
    }

    checkBalance(enteredPin) {
        if (!this.#validatePin(enteredPin)) return "Access Denied.";
        return `Current Balance: $${this.#balance}`;
    }
}

const myWallet = new SecureWallet(5000, 1234);

console.log("Public owner property:", myWallet.owner);
console.log(myWallet.checkBalance(1234));
console.log(myWallet.withdraw(1500, 1234));
console.log(myWallet.withdraw(100, 9999)); // Wrong PIN

// HARD RUNTIME PRIVACY:
// Attempting to access myWallet.#balance outside throws a hard SyntaxError:
// console.log(myWallet.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class

console.log();

// ----------------------------------------------------------------------------
// 6. REAL-WORLD BACKEND USE CASE: CUSTOM APPLICATION ERROR CLASS
// ----------------------------------------------------------------------------
console.log("--- 6. CUSTOM APPLICATION ERROR HIERARCHY ---");

class AppHttpError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
}

class ResourceNotFoundError extends AppHttpError {
    constructor(resource, id) {
        super(`${resource} with ID '${id}' was not found.`, 404, "ERR_NOT_FOUND");
    }
}

// Simulating error handling in Express/Next.js:
try {
    throw new ResourceNotFoundError("UserAccount", "USR-9901");
} catch (error) {
    if (error instanceof AppHttpError) {
        console.log(`[HTTP ${error.statusCode}] Error Code: ${error.errorCode}`);
        console.log(`[Message]: ${error.message}`);
    }
}

console.log();

// ----------------------------------------------------------------------------
// 7. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 7. ES6+ CLASS CHEAT SHEET ---");
console.table([
    { Feature: "constructor()", Purpose: "Initializes new instance upon 'new ClassName()'" },
    { Feature: "extends", Purpose: "Sets up prototypal inheritance between parent and child" },
    { Feature: "super()", Purpose: "Calls parent constructor; must be called before 'this'" },
    { Feature: "static", Purpose: "Attaches utility method directly to class, not instances" },
    { Feature: "get / set", Purpose: "Defines computed property accessors and mutation guards" },
    { Feature: "#privateField", Purpose: "ES2022 true runtime engine-enforced private encapsulation" }
]);

console.log("Module 16 loaded and executed successfully.\n");

