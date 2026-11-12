/**
 * ============================================================================
 * MODULE 11: useCallback and useMemo — Preserving References & Caching Values
 * ============================================================================
 * 
 * 1. THE TWIN PERFORMANCE HOOKS
 * ----------------------------------------------------------------------------
 * Both `useCallback` and `useMemo` exist for one singular purpose:
 * CACHING INFORMATION BETWEEN REACT RENDERS UNTIL DEPENDENCIES CHANGE.
 * 
 * - `useCallback(fn, deps)`:
 *   Caches the FUNCTION DEFINITION (preserves its identity across renders).
 *   Returns: The cached function.
 * 
 * - `useMemo(() => computeValue(), deps)`:
 *   Caches the RESULT of an expensive computation.
 *   Returns: The cached calculated value.
 * 
 * 2. THE MATHEMATICAL EQUIVALENCE
 * ----------------------------------------------------------------------------
 * Behind the scenes in React Fiber, `useCallback` is syntactic sugar:
 *   useCallback(fn, deps) === useMemo(() => fn, deps)
 * 
 * 3. WHEN SHOULD YOU ACTUALLY USE THEM?
 * ----------------------------------------------------------------------------
 * 🟢 GOOD USES:
 * 1. You pass a callback prop to a Child component wrapped in `React.memo`.
 *    Without `useCallback`, the child will re-render anyway!
 * 2. You use an object or function as a dependency in `useEffect`:
 *    `useEffect(() => { ... }, [fetchData])` requires `fetchData` to be stable.
 * 3. `useMemo` for computationally expensive loops (filtering/sorting 5,000 items).
 * 
 * 🔴 BAD USES (Premature Optimization Anti-patterns):
 * 1. Wrapping simple scalar additions: `useMemo(() => a + b, [a, b])` ❌
 *    (Comparing the dependency array and managing the hook node takes MORE CPU 
 *    than simply adding two numbers!).
 * 2. Wrapping callbacks passed to plain native HTML tags: `<button onClick={useCallback(...)}>` ❌
 *    (Native DOM elements don't benefit from referential equality!).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 11: useCallback & useMemo Deep Dive & Benchmarks");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING useCallback (Preserving Function Identity)
// ============================================================================
console.log("--- 1. SIMULATING useCallback INTERNALS ---");

class MockHookEnvironment {
  constructor() {
    this.callbackCache = new Map();
    this.memoCache = new Map();
  }

  useCallback(fn, deps, hookId) {
    if (this.callbackCache.has(hookId)) {
      const [cachedFn, prevDeps] = this.callbackCache.get(hookId);
      const depsUnchanged = prevDeps.every((d, i) => Object.is(d, deps[i]));
      if (depsUnchanged) {
        return cachedFn; // Return exact same function reference!
      }
    }
    // Cache new instance
    this.callbackCache.set(hookId, [fn, deps]);
    return fn;
  }

  useMemo(factoryFn, deps, hookId) {
    if (this.memoCache.has(hookId)) {
      const [cachedVal, prevDeps] = this.memoCache.get(hookId);
      const depsUnchanged = prevDeps.every((d, i) => Object.is(d, deps[i]));
      if (depsUnchanged) {
        return cachedVal; // Return cached calculation!
      }
    }
    // Compute and cache new result
    const computed = factoryFn();
    this.memoCache.set(hookId, [computed, deps]);
    return computed;
  }
}

const reactEnv = new MockHookEnvironment();

// Render 1: Initial Mount
console.log("Render 1: User state is 'Haris'");
const fnRender1 = reactEnv.useCallback(() => console.log("Haris"), ["Haris"], "handler_1");

// Render 2: Unrelated state changed (e.g. theme toggle), but dependency 'Haris' stayed the same:
console.log("Render 2: Unrelated theme changed, user stays 'Haris'");
const fnRender2 = reactEnv.useCallback(() => console.log("Haris"), ["Haris"], "handler_1");

console.log("Did useCallback preserve exact function reference?:", fnRender1 === fnRender2); // true!

// Render 3: User changed to 'Ali'
console.log("Render 3: User changed to 'Ali'");
const fnRender3 = reactEnv.useCallback(() => console.log("Ali"), ["Ali"], "handler_1");
console.log("Did reference update after dependency change?:", fnRender1 === fnRender3); // false!

// ============================================================================
// SECTION 2: SIMULATING useMemo (Expensive Calculations)
// ============================================================================
console.log("\n--- 2. SIMULATING useMemo WITH EXPENSIVE FACTORIAL/PRIME BENCHMARK ---");

function calculatePrimesUpTo(limit) {
  console.log(`  [Expensive Calculation Engine] Computing primes up to ${limit}...`);
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) { isPrime = false; break; }
    }
    if (isPrime) count++;
  }
  return count;
}

// Pass 1: Heavy calculation executed
console.log("Pass 1 (Fresh computation):");
const primes1 = reactEnv.useMemo(() => calculatePrimesUpTo(50000), [50000], "primes_memo");
console.log(`  Primes Count: ${primes1}`);

// Pass 2: Component re-renders with same dependency limit:
console.log("\nPass 2 (Parent re-rendered, dependency limit is still 50000):");
const primes2 = reactEnv.useMemo(() => calculatePrimesUpTo(50000), [50000], "primes_memo");
console.log(`  Primes Count: ${primes2} (Retrieved instantaneously from cache!)`);

console.log("\n==================================================================");
console.log("  useCallback VS useMemo QUICK REFERENCE");
console.log("==================================================================");
console.log("Hook         | What It Caches       | When to Use");
console.log("-------------|----------------------|-----------------------------");
console.log("useCallback  | Function Definition  | Passing callbacks to memoized children");
console.log("useMemo      | Computed Value       | Heavy calculations or stable objects");
console.log("==================================================================\n");

console.log("✅ Module 11 Execution Verified: useCallback and useMemo mechanics proven.");
