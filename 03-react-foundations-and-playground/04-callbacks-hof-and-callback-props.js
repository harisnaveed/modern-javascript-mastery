/**
 * ============================================================================
 * MODULE 04: Callbacks, Higher-Order Functions (HOF) & React Callback Props
 * ============================================================================
 * 
 * 1. WHAT IS A CALLBACK?
 * ----------------------------------------------------------------------------
 * A CALLBACK is a function passed into another function as an argument, intended
 * to be executed (called back) at a designated time.
 * 
 * Crucial Distinction:
 *   doSomething(myFunction);   // ✅ Passing the function reference (Callback)
 *   doSomething(myFunction()); // ❌ Executing immediately and passing return value!
 * 
 * 2. SYNCHRONOUS VS ASYNCHRONOUS CALLBACKS
 * ----------------------------------------------------------------------------
 * - Synchronous Callback: Executes immediately during the caller's execution.
 *   Examples: `array.map(fn)`, `array.filter(fn)`, `calculate(a, b, operation)`.
 * 
 * - Asynchronous Callback: Executes later, after an I/O operation, timer, or 
 *   user interaction completes.
 *   Examples: `setTimeout(fn, 1000)`, `button.addEventListener('click', fn)`.
 * 
 * 3. WHAT IS A HIGHER-ORDER FUNCTION (HOF)?
 * ----------------------------------------------------------------------------
 * An HOF is a function that does at least ONE of the following:
 * 1. Takes one or more functions as arguments (e.g. `map`, `filter`).
 * 2. Returns a new function as its result (e.g. function factories, currying).
 * 
 * 4. CALLBACK PROPS IN REACT: CHILD-TO-PARENT COMMUNICATION
 * ----------------------------------------------------------------------------
 * In React, data flows strictly DOWNWARDS (unidirectional: Parent -> Child via props).
 * How does a Child send data or notify the Parent that something happened?
 * Answer: CALLBACK PROPS!
 * 
 * Flow:
 *   1. Parent defines a handler: `const handleSelect = (item) => { ... }`
 *   2. Parent passes it down: `<Child onSelect={handleSelect} />`
 *   3. Child receives `onSelect` in props
 *   4. Child triggers it upon user interaction: `onClick={() => onSelect(item)}`
 *   5. Parent's function executes with the child's data!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 04: Callbacks, HOFs & React Callback Props");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SYNCHRONOUS VS ASYNCHRONOUS CALLBACKS
// ============================================================================
console.log("--- 1. SYNCHRONOUS VS ASYNCHRONOUS CALLBACKS ---");

// Synchronous Callback Example:
function executeCalculation(a, b, operationCallback) {
  return operationCallback(a, b);
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

console.log("Sync Callback Add (10, 5):", executeCalculation(10, 5, add)); // 15
console.log("Sync Callback Multiply (10, 5):", executeCalculation(10, 5, multiply)); // 50

// Asynchronous Callback Example:
console.log("\nScheduling Async Callback via setTimeout...");
setTimeout(() => {
  console.log("  -> [Async Callback] Fired after 50ms on the Event Loop!");
}, 50);

// ============================================================================
// SECTION 2: HIGHER-ORDER FUNCTIONS: CURRYING & FUNCTION COMPOSITION
// ============================================================================
console.log("\n--- 2. ADVANCED HOF: CURRYING & COMPOSITION ---");

// Currying: Transforming a multi-argument function into a chain of single-argument functions
const curriedDiscount = (tier) => (discountRate) => (price) => {
  const finalPrice = price - (price * discountRate);
  return `[${tier}] Original: $${price} -> Discounted: $${finalPrice}`;
};

const vipDiscount = curriedDiscount("VIP MEMBER")(0.20); // 20% discount preset
console.log(vipDiscount(100)); // $80
console.log(vipDiscount(250)); // $200

// Function Composition (Pipe: f(g(x)))
const pipe = (...fns) => (initialValue) => 
  fns.reduce((acc, fn) => fn(acc), initialValue);

const sanitizeInput = str => str.trim().toLowerCase();
const addPrefix = str => `device_${str}`;
const formatModelKey = pipe(sanitizeInput, addPrefix);

console.log("Composed Output ('  iPhone 15 Pro  '):", formatModelKey("  iPhone 15 Pro  ")); // "device_iphone 15 pro"

// ============================================================================
// SECTION 3: REACT CALLBACK PROPS ARCHITECTURE (The Repair Widget Pattern)
// ============================================================================
console.log("\n--- 3. REACT CALLBACK PROPS ARCHITECTURE (Repair Widget Simulation) ---");

/**
 * Simulating the hierarchical Repair Widget component tree:
 * 
 * Parent: RepairShopWidget (owns state: selectedDevice, selectedBrand, selectedIssue)
 *   ├── Child 1: DeviceSelector (calls onSelectDevice)
 *   ├── Child 2: BrandSelector  (calls onSelectBrand)
 *   └── Child 3: IssueSelector  (calls onSelectIssue)
 */

class MockRepairShopParent {
  constructor() {
    this.state = {
      device: null,
      brand: null,
      issue: null,
      estimatedPrice: 0
    };
  }

  // Callback handler passed to Child 1
  handleDeviceSelect = (deviceType) => {
    this.state.device = deviceType;
    console.log(`[Parent State Update] Device selected: "${deviceType}"`);
  };

  // Callback handler passed to Child 2
  handleBrandSelect = (brandName) => {
    this.state.brand = brandName;
    console.log(`[Parent State Update] Brand selected: "${brandName}"`);
  };

  // Callback handler passed to Child 3
  handleIssueSelect = (issueDescription, price) => {
    this.state.issue = issueDescription;
    this.state.estimatedPrice = price;
    console.log(`[Parent State Update] Issue selected: "${issueDescription}" ($${price})`);
  };

  renderSummary() {
    console.log(`\n======================================================`);
    console.log(`  CURRENT REPAIR QUOTE SUMMARY`);
    console.log(`======================================================`);
    console.log(`  Device:   ${this.state.device || "None"}`);
    console.log(`  Brand:    ${this.state.brand || "None"}`);
    console.log(`  Issue:    ${this.state.issue || "None"}`);
    console.log(`  Estimate: $${this.state.estimatedPrice}`);
    console.log(`======================================================\n`);
  }
}

// Child Components that receive callback props:
function mockDeviceSelectorChild(onSelectDevice) {
  // Simulates user clicking "Smartphone"
  onSelectDevice("Smartphone");
}

function mockBrandSelectorChild(onSelectBrand) {
  // Simulates user clicking "Apple"
  onSelectBrand("Apple");
}

function mockIssueSelectorChild(onSelectIssue) {
  // Simulates user clicking "Cracked Screen"
  onSelectIssue("Cracked OLED Screen", 189);
}

// Executing the parent-child communication cycle:
const repairWidget = new MockRepairShopParent();

console.log("1. User selects Device in Child 1:");
mockDeviceSelectorChild(repairWidget.handleDeviceSelect);

console.log("2. User selects Brand in Child 2:");
mockBrandSelectorChild(repairWidget.handleBrandSelect);

console.log("3. User selects Issue in Child 3:");
mockIssueSelectorChild(repairWidget.handleIssueSelect);

repairWidget.renderSummary();

console.log("✅ Module 04 Execution Verified: Callbacks, HOFs, and Callback Props passed.");
