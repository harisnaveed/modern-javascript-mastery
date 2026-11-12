/**
 * ============================================================================
 * MODULE 02: Closures, Lexical Scoping, and Data Encapsulation
 * ============================================================================
 * 
 * 1. THE CORE DEFINITION & MENTAL MODEL (Prompt 2 Clarity)
 * ----------------------------------------------------------------------------
 * A CLOSURE is formed when an inner function remembers and retains access to 
 * variables from its outer lexical scope, even AFTER the outer function has 
 * finished executing and its execution context has been popped off the Call Stack.
 * 
 * In simple terms:
 *   Closure = Function + Its Remembered Lexical Environment.
 * 
 * 2. WHAT IS LEXICAL SCOPE?
 * ----------------------------------------------------------------------------
 * "Lexical" means "relating to text or words".
 * Lexical scoping means variable accessibility is determined purely by WHERE 
 * functions and blocks are physically WRITTEN in your source code, not where 
 * they are called at runtime.
 * 
 * In JavaScript, there are 3 main scopes:
 * 1. Global Scope: Accessible everywhere in the program.
 * 2. Function Scope: Accessible only inside the enclosing function.
 * 3. Block Scope (let & const): Accessible only inside the enclosing { ... } block.
 * 
 * 3. STEP-BY-STEP BREAKDOWN OF HOW A CLOSURE IS CREATED:
 * ----------------------------------------------------------------------------
 * Step 1: `outerFunction()` is called. Its Execution Context is pushed to the Call Stack.
 * Step 2: Local variable `count = 0` is allocated in memory.
 * Step 3: `innerFunction()` is declared inside outerFunction. It references `count`.
 * Step 4: `outerFunction()` returns `innerFunction` and finishes executing.
 * Step 5: `outerFunction`'s stack frame is destroyed (popped off the Call Stack).
 * Step 6: Ordinarily, local variables would be garbage collected. BUT the JS Engine
 *         detects that the returned `innerFunction` still references `count`.
 *         Therefore, the JS Engine moves `count` to the HEAP, bundled into a "Closure Scope".
 * Step 7: When you call `myFunc()`, it accesses that preserved `count` variable!
 * 
 * 4. PHP / LARAVEL ANALOGY (Explicit vs Automatic Closure)
 * ----------------------------------------------------------------------------
 * In PHP (Laravel):
 *   $tax = 0.15;
 *   $calc = function ($amount) use ($tax) { // MUST explicitly specify 'use ($tax)'
 *       return $amount * $tax;
 *   };
 * 
 * In JavaScript:
 *   const tax = 0.15;
 *   const calc = (amount) => amount * tax; // Automatically closes over 'tax'!
 * 
 * In JS, every function created inside another function automatically forms a closure
 * over all accessible identifiers in its lexical parent scope.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 02: Closures, Lexical Scope & Data Encapsulation");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: LEXICAL SCOPING & SCOPE CHAIN
// ============================================================================
console.log("--- 1. LEXICAL SCOPING & SCOPE CHAIN ---");

const globalApp = "React & Next.js Masterclass"; // 1. Global Scope

function outerScope() {
  const outerCity = "Wah Cantt"; // 2. Function Scope

  function innerScope() {
    const innerStreet = "The Mall Road"; // 3. Block/Local Scope

    // The scope chain searches inside-out: inner -> outer -> global
    console.log(`Global: ${globalApp}`);
    console.log(`Outer:  ${outerCity}`);
    console.log(`Inner:  ${innerStreet}`);
  }

  innerScope();
}

outerScope();

// ============================================================================
// SECTION 2: THE ANATOMY OF A CLOSURE (Step-by-Step Counter)
// ============================================================================
console.log("\n--- 2. STEP-BY-STEP CLOSURE EXECUTION ---");

function createCounter(initialValue = 0) {
  // This variable lives in createCounter's lexical environment
  let count = initialValue;

  // The inner function closes over 'count'
  function increment() {
    count++;
    return count;
  }

  return increment;
}

// 1. Call outer function: execution context created, returns inner function
const counterA = createCounter(0);
const counterB = createCounter(100); // Each closure instance has its own independent memory!

console.log("Counter A (Call 1):", counterA()); // 1
console.log("Counter A (Call 2):", counterA()); // 2
console.log("Counter A (Call 3):", counterA()); // 3

console.log("Counter B (Call 1 - Independent!):", counterB()); // 101
console.log("Counter B (Call 2):", counterB()); // 102
console.log("Counter A (Call 4 - Still holds its own count):", counterA()); // 4

// ============================================================================
// SECTION 3: REAL-WORLD USE CASE 1 — PRIVATE DATA ENCAPSULATION
// ============================================================================
console.log("\n--- 3. PRIVATE STATE & ENCAPSULATION (Bank Account) ---");

/**
 * Emulating Private Object Properties in JavaScript using Closures.
 * The variable 'balance' is completely hidden from the outside world.
 */
function createBankAccount(initialDeposit) {
  let balance = initialDeposit; // Truly private variable!

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      console.log(`[Bank] Deposited: $${amount} | New Balance: $${balance}`);
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log(`[Bank] Declined: Insufficient funds for $${amount}`);
        return false;
      }
      balance -= amount;
      console.log(`[Bank] Withdrew: $${amount} | Remaining: $${balance}`);
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const myAccount = createBankAccount(1000);

myAccount.deposit(500);   // Balance: 1500
myAccount.withdraw(200);  // Balance: 1300
myAccount.withdraw(2000); // Declined

// Attempting to directly manipulate or read balance:
console.log("Direct property access (account.balance):", myAccount.balance); // undefined!
console.log("Verified Private Balance via getBalance():", myAccount.getBalance()); // 1300

// ============================================================================
// SECTION 4: REAL-WORLD USE CASE 2 — FUNCTION FACTORIES
// ============================================================================
console.log("\n--- 4. FUNCTION FACTORIES (Preset Function Generators) ---");

function createTaxCalculator(taxRate) {
  // Returns a specialized function that remembers the specific 'taxRate'
  return function calculateTotal(subtotal) {
    const taxAmount = subtotal * taxRate;
    return subtotal + taxAmount;
  };
}

const calculateStandardTax = createTaxCalculator(0.10); // 10%
const calculateLuxuryTax = createTaxCalculator(0.25);   // 25%

console.log("Standard Tax on $100:", calculateStandardTax(100)); // $110
console.log("Luxury Tax on $100:  ", calculateLuxuryTax(100));   // $125

// ============================================================================
// SECTION 5: HOW CLOSURES POWER REACT FUNCTIONAL COMPONENTS
// ============================================================================
console.log("\n--- 5. HOW CLOSURES POWER REACT EVENT HANDLERS ---");

/**
 * Mental Model of React Component Rendering:
 * Every time a React component renders, it calls the component function.
 * That function creates fresh local variables and closures for that specific render!
 */
function simulateReactRender(componentFunction, stateValue) {
  console.log(`\n--- Simulating React Render Pass with State = ${stateValue} ---`);
  return componentFunction(stateValue);
}

function MockCounterComponent(count) {
  // Event handler created during this render closes over current 'count'
  function handleButtonClick() {
    console.log(`[React Handler] Closed over count during this render: ${count}`);
  }

  return {
    renderUI: `<h1>Count is: ${count}</h1>`,
    click: handleButtonClick
  };
}

// Render 1: count is 0
const render1 = simulateReactRender(MockCounterComponent, 0);
render1.click(); // Logs: count = 0

// Render 2: user clicked increase, state is now 1
const render2 = simulateReactRender(MockCounterComponent, 1);
render2.click(); // Logs: count = 1

console.log("\n✅ Module 02 Execution Verified: All closure and lexical scoping concepts passed.");
