/**
 * ============================================================================
 * MODULE 37: Design Patterns in Modern JavaScript (React, Next.js & Node.js)
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL BACKGROUND
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript, the lack of standard module systems (`import`/`export`) 
 * and formal `class` constructs led to rampant global scope pollution, tight 
 * coupling, and unmaintainable spaghetti code. Developers relied on ad-hoc IIFEs 
 * (Immediately Invoked Function Expressions) and the "Revealing Module Pattern".
 *
 * As JavaScript matured into an enterprise fullstack language powering complex 
 * React UIs and Node.js microservices, adapting classic Gang of Four (GoF) 
 * Software Design Patterns became critical for writing testable, decoupled, 
 * and scalable codebases.
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - Laravel Architecture:
 *   Laravel is celebrated for its elegant design patterns:
 *   - Service Container & Singletons: `app()->singleton(DatabaseService::class)`
 *   - Model Factories: `User::factory()->create()`
 *   - Observers / Events: `UserObserver` listening to `created` / `updated`
 *   - Strategy Pattern: Payment gateways (Stripe, PayPal) implementing a shared interface.
 *
 * - Modern JavaScript Equivalents:
 *   - Node.js ESM modules are Singletons by default (cached in memory on first import).
 *   - Factory functions generate dynamic React components or API clients.
 *   - Pub-Sub / Observer powers Node's `EventEmitter` and state stores (Redux, Zustand).
 *   - Strategy pattern replaces rigid `switch` statements with dynamic handler maps.
 *   - Decorator / HOC wraps components or API routes with auth/logging wrappers.
 *
 *
 * 3. ESSENTIAL DESIGN PATTERNS COVERED
 * ----------------------------------------------------------------------------
 * 1. Singleton Pattern: Ensures exactly one instance exists across the application.
 * 2. Factory Pattern: Encapsulates object creation logic based on dynamic input.
 * 3. Observer / Pub-Sub Pattern: Decoupled one-to-many event notification system.
 * 4. Strategy Pattern: Swappable algorithms/providers without modifying client code.
 * 5. Decorator / Wrapper Pattern: Enhancing functions with cross-cutting concerns.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 37: Design Patterns in Modern JavaScript");
console.log("==================================================================\n");

// ============================================================================
// PATTERN 1: SINGLETON PATTERN
// ============================================================================
console.log("--- 1. SINGLETON PATTERN (GLOBAL STATE / CONNECTION POOL) ---");

/**
 * Ensures a class has only one instance and provides a global access point.
 * In Node.js, `require('./db')` is automatically a singleton due to module caching.
 * Here is the formal class-level implementation:
 */
class DatabaseConnectionPool {
  constructor() {
    if (DatabaseConnectionPool.instance) {
      return DatabaseConnectionPool.instance; // Return existing instance
    }
    this.connectionId = `conn_${Math.floor(Math.random() * 100000)}`;
    this.connectedAt = new Date().toISOString();
    DatabaseConnectionPool.instance = this; // Cache instance
  }

  query(sql) {
    return `[${this.connectionId}] Executed: "${sql}"`;
  }
}

const db1 = new DatabaseConnectionPool();
const db2 = new DatabaseConnectionPool();

console.log("db1 connection ID:", db1.connectionId);
console.log("db2 connection ID:", db2.connectionId);
console.log("Are both instances strictly identical?", db1 === db2); // true
console.log(db1.query("SELECT * FROM users WHERE active = 1"));


// ============================================================================
// PATTERN 2: FACTORY PATTERN
// ============================================================================
console.log("\n--- 2. FACTORY PATTERN (DYNAMIC OBJECT CREATION) ---");

/**
 * Creates objects without specifying the exact class of object that will be created.
 * Great for payment processors, notification channels, or dynamic UI cards.
 */
class StripeProcessor {
  process(amount) {
    return `💳 [Stripe] Charged $${amount} via Credit Card API`;
  }
}

class PayPalProcessor {
  process(amount) {
    return `🅿️ [PayPal] Processed $${amount} via PayPal Express Checkout`;
  }
}

class CryptoProcessor {
  process(amount) {
    return `🪙 [Crypto] Transferred $${amount} equivalent in USDT on Ethereum`;
  }
}

class PaymentProcessorFactory {
  static create(method) {
    switch (method.toLowerCase()) {
      case "stripe":
        return new StripeProcessor();
      case "paypal":
        return new PayPalProcessor();
      case "crypto":
        return new CryptoProcessor();
      default:
        throw new Error(`Unsupported payment method: "${method}"`);
    }
  }
}

const clientPaymentMethod = "stripe";
const processor = PaymentProcessorFactory.create(clientPaymentMethod);
console.log(processor.process(250));


// ============================================================================
// PATTERN 3: OBSERVER / PUB-SUB PATTERN
// ============================================================================
console.log("\n--- 3. OBSERVER / PUB-SUB PATTERN (EVENT-DRIVEN ARCHITECTURE) ---");

/**
 * Allows multiple subscriber objects to listen to events published by a central broker.
 * This is the architectural backbone of Redux, Zustand, and Node.js EventEmitters.
 */
class EventBus {
  constructor() {
    this.subscribers = new Map();
  }

  // Subscribe to an event topic
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);

    // Return an unsubscribe cleanup function (like React useEffect!)
    return () => {
      this.subscribers.get(event).delete(callback);
    };
  }

  // Publish event payload to all active subscribers
  publish(event, data) {
    if (!this.subscribers.has(event)) return;
    for (const callback of this.subscribers.get(event)) {
      callback(data);
    }
  }
}

const appBus = new EventBus();

// Subscriber A: Analytics Service
const unsubscribeAnalytics = appBus.subscribe("ORDER_PLACED", (order) => {
  console.log(`📊 [Analytics] Tracked purchase: Order #${order.id} for $${order.total}`);
});

// Subscriber B: Email Notification Service
const unsubscribeEmail = appBus.subscribe("ORDER_PLACED", (order) => {
  console.log(`📧 [Email Service] Confirmation email sent to ${order.customerEmail}`);
});

// Trigger the event
appBus.publish("ORDER_PLACED", { id: 9812, total: 199.99, customerEmail: "haris@example.com" });

// Unsubscribe Email Service and publish again
unsubscribeEmail();
console.log("Unsubscribed Email Service. Triggering second order:");
appBus.publish("ORDER_PLACED", { id: 9813, total: 49.50, customerEmail: "ayesha@example.com" });


// ============================================================================
// PATTERN 4: STRATEGY PATTERN
// ============================================================================
console.log("\n--- 4. STRATEGY PATTERN (REPLACING SWITCH/IF STATEMENTS) ---");

/**
 * Encapsulates a family of algorithms into interchangeable objects.
 * Perfect for shipping calculations, discount codes, or authentication strategies.
 */
const shippingStrategies = {
  standard: (weightKg) => weightKg * 5.0 + 10,
  express: (weightKg) => weightKg * 12.0 + 25,
  overnight: (weightKg) => weightKg * 25.0 + 50,
  free: () => 0,
};

function calculateShippingCost(strategyKey, weightKg) {
  const strategy = shippingStrategies[strategyKey];
  if (!strategy) {
    throw new Error(`Unknown shipping strategy: ${strategyKey}`);
  }
  return strategy(weightKg);
}

console.log("Standard Shipping (10kg):", `$${calculateShippingCost("standard", 10)}`);
console.log("Express Shipping (10kg): ", `$${calculateShippingCost("express", 10)}`);
console.log("Overnight Shipping (10kg):", `$${calculateShippingCost("overnight", 10)}`);


// ============================================================================
// PATTERN 5: DECORATOR / FUNCTION WRAPPER PATTERN
// ============================================================================
console.log("\n--- 5. DECORATOR / WRAPPER PATTERN (CROSS-CUTTING CONCERNS) ---");

/**
 * Dynamically wraps behavior (like execution timing, auth checking, or caching)
 * around an existing function without modifying its source code.
 */
function withTiming(fn, functionName) {
  return function (...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`⏱️ [Timing Decorator] "${functionName}" executed in ${(end - start).toFixed(4)}ms`);
    return result;
  };
}

function computePrimeFactors(n) {
  const factors = [];
  let divisor = 2;
  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

const timedPrimeCalculator = withTiming(computePrimeFactors, "computePrimeFactors");
const factors = timedPrimeCalculator(360360);
console.log("Prime factors of 360360:", factors);

console.log("\nModule 37 loaded and executed successfully.");

