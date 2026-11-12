/**
 * ============================================================================
 * MODULE 14: useRef, useContext, and Building Production Custom Hooks
 * ============================================================================
 * 
 * 1. WHAT IS `useRef`? (The Escape Hatch)
 * ----------------------------------------------------------------------------
 * `useRef(initialValue)` returns a mutable object with a single property:
 *   { current: initialValue }
 * 
 * ⚠️ THE GOLDEN RULE OF REFS:
 * Mutating `ref.current = 10` DOES NOT TRIGGER A RE-RENDER!
 * 
 * Two Essential Uses:
 * 1. Imperative DOM Access: Focusing an input, scrolling to a section, measuring elements.
 * 2. Storing Mutable "Instance Variables": Keeping timer IDs, tracking previous state,
 *    or recording render counts without causing infinite re-render loops.
 * 
 * 2. WHAT IS `useContext`? (Eliminating Prop Drilling)
 * ----------------------------------------------------------------------------
 * Prop Drilling occurs when a top-level prop (e.g. `userTheme`) must be manually
 * passed down through 5 levels of intermediate components that don't care about it.
 * 
 * Context provides a "teleportation tunnel":
 *   1. Create: `const ThemeContext = createContext("light");`
 *   2. Provide: `<ThemeContext.Provider value="dark"> ... </ThemeContext.Provider>`
 *   3. Consume: `const theme = useContext(ThemeContext);`
 * 
 * 3. CUSTOM HOOKS ARCHITECTURE
 * ----------------------------------------------------------------------------
 * Custom Hooks allow you to package component logic into clean, testable, and
 * reusable functions.
 * 
 * Rules of Hooks:
 * 1. Only call Hooks at the TOP LEVEL (no loops, conditions, or nested functions).
 * 2. Only call Hooks from React function components or custom Hook functions.
 * 3. Name must start with 'use' (e.g. `useDebounce`, `useLocalStorage`).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 14: useRef, useContext & Production Custom Hooks");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING useRef (Persistent Mutable Reference)
// ============================================================================
console.log("--- 1. useRef: PERSISTENCE WITHOUT RE-RENDERING ---");

class MockComponentWithRef {
  constructor() {
    this.renderCount = 1;
    // Simulates useRef
    this.timerIdRef = { current: null };
    this.clickCounterRef = { current: 0 };
  }

  // Mutating ref does NOT trigger render
  handleClick() {
    this.clickCounterRef.current++;
    console.log(`  [useRef Click] ref.current is now: ${this.clickCounterRef.current} (Render Count STILL: ${this.renderCount})`);
  }

  startTimer() {
    this.timerIdRef.current = 1042; // simulated timer ID
    console.log(`  [useRef Timer] Stored interval ID #${this.timerIdRef.current} in ref.current`);
  }

  stopTimer() {
    console.log(`  [useRef Cleanup] Clearing timer ID #${this.timerIdRef.current}`);
    this.timerIdRef.current = null;
  }
}

const componentWithRef = new MockComponentWithRef();
componentWithRef.handleClick();
componentWithRef.handleClick();
componentWithRef.startTimer();
componentWithRef.stopTimer();

// ============================================================================
// SECTION 2: SIMULATING useContext (Broadcast Communication)
// ============================================================================
console.log("\n--- 2. useContext: TELEPORTING DATA ACROSS THE TREE ---");

class MockContext {
  constructor(defaultValue) {
    this.currentValue = defaultValue;
    this.subscribers = new Set();
  }

  provide(newValue) {
    this.currentValue = newValue;
    console.log(`[Context Provider] Broadcasted new value: "${newValue}"`);
    this.subscribers.forEach(sub => sub(this.currentValue));
  }

  subscribe(consumerCallback) {
    this.subscribers.add(consumerCallback);
    // Return unsubscribe function
    return () => this.subscribers.delete(consumerCallback);
  }
}

const ThemeContext = new MockContext("light");

// Child components consuming context:
const unsubscribeHeader = ThemeContext.subscribe(val => {
  console.log(`  -> [Header Component via useContext] Theme updated to: ${val}`);
});

const unsubscribeFooter = ThemeContext.subscribe(val => {
  console.log(`  -> [Footer Component via useContext] Theme updated to: ${val}`);
});

ThemeContext.provide("dark");
ThemeContext.provide("high-contrast-neon");

unsubscribeHeader();
unsubscribeFooter();

// ============================================================================
// SECTION 3: BUILDING A REUSABLE CUSTOM HOOK (useDebounce Simulation)
// ============================================================================
console.log("\n--- 3. REUSABLE CUSTOM HOOK: useDebounce ---");

/**
 * useDebounce: Delays updating a value until user stops typing for `delayMs`.
 * Ideal for search autocomplete and live filtering.
 */
function createDebounceHookSimulator(delayMs) {
  let timer = null;
  let debouncedValue = "";

  return function updateSearch(inputString, onValueReady) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debouncedValue = inputString;
      console.log(`  [useDebounce Hook] ⏱️ User paused typing! Emitting search query: "${debouncedValue}"`);
      onValueReady(debouncedValue);
    }, delayMs);
  };
}

const simulateSearchType = createDebounceHookSimulator(40);

console.log("User types 'i' into search input...");
simulateSearchType("i", query => console.log(`API Query dispatched: /search?q=${query}`));

console.log("User types 'ip' into search input (before timer fires)...");
simulateSearchType("ip", query => console.log(`API Query dispatched: /search?q=${query}`));

console.log("User types 'iphone' into search input...");
simulateSearchType("iphone", query => {
  console.log(`  🎉 API Query dispatched: /search?q=${query}`);
  console.log("\n✅ Module 14 Execution Verified: useRef, useContext, and custom hooks passed.");
});
