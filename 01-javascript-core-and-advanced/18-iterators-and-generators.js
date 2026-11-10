/**
 * ============================================================================
 * MODULE 18: Iterators, Iterables & Generators
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 07 (Arrays), Module 17 (Collections)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6, JavaScript had NO unified way to iterate over collections:
 *   - Arrays used `for (var i = 0; ...)` or `.forEach()`.
 *   - Objects used `for...in` (which leaked prototype properties).
 *   - DOM NodeLists had their own quirks.
 *   - Custom data structures (Trees, Linked Lists, Graphs) required writing
 *     custom cursor methods with no standard interface.
 * 
 * THE MEMORY PROBLEM (EAGER VS LAZY EVALUATION):
 * - If you needed 100,000 items, you had to allocate an array of 100,000 items
 *   in RAM all at once.
 * - JavaScript had no native way to generate infinite streams or compute
 *   values on-demand (Lazy Evaluation).
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, generators and iterators have been supported since PHP 5.5:
 *     function getNumbers() {
 *         yield 1; yield 2; yield 3;
 *     }
 * - ES6 brings the exact same paradigm to JavaScript with:
 *     - The Iteration Protocol (`Symbol.iterator` + `.next()`).
 *     - Generator Functions (`function*` + `yield`).
 *
 *
 * 3. THE TWO ITERATION PROTOCOLS
 * ----------------------------------------------------------------------------
 * 1. The ITERABLE Protocol:
 *    - An object is "Iterable" if it implements a method whose key is
 *      `[Symbol.iterator]`.
 *    - All built-in collections (Array, String, Map, Set) are Iterables!
 *    - Iterables natively support: `for...of`, `[...spread]`, and destructuring.
 * 
 * 2. The ITERATOR Protocol:
 *    - The object returned by `[Symbol.iterator]()` must have a `.next()` method.
 *    - Every call to `.next()` returns:
 *        `{ value: any, done: boolean }`
 *    - When `done: true`, iteration stops.
 * 
 * 3. GENERATOR FUNCTIONS (`function*`):
 *    - A revolutionary function that can **PAUSE** its execution (`yield`) and
 *      **RESUME** later when `.next()` is called.
 *    - Allows writing iterators using normal sequential logic instead of manual
 *      state-tracking objects.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Generators Cannot Be Arrow Functions
 *    - There is no `*() => {}` syntax. You must use `function* () {}`.
 * 
 * Gotcha 2: Two-Way Communication via `yield`
 *    - `yield` is not just an output statement—it can receive inputs!
 *    - `const input = yield output;` receives whatever is passed into `next(val)`.
 * 
 * Gotcha 3: Infinite Generators Are Completely Safe!
 *    - `while (true) { yield i++; }` does NOT freeze the computer, because it
 *      pauses execution at every `yield` and runs ONLY when you request the next item.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - **Redux-Saga**: The leading React side-effect management library orchestrates
 *   complex async workflows using generators.
 * - **Streaming Paginated API Data**: Lazily fetching API records page-by-page as
 *   the user scrolls, rather than dumping all database records into memory.
 * - Custom Tree/Graph data structure traversal.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 18: Iterators, Iterables & Generators");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. UNDERSTANDING THE NATIVE ITERATION PROTOCOL
// ----------------------------------------------------------------------------
console.log("--- 1. UNDER THE HOOD: THE ITERATOR PROTOCOL ---");

const frameworks = ["React", "Next.js", "Express"];

// Grab the internal iterator from the array using Symbol.iterator:
const iterator = frameworks[Symbol.iterator]();

console.log("First .next(): ", iterator.next()); // { value: 'React', done: false }
console.log("Second .next():", iterator.next()); // { value: 'Next.js', done: false }
console.log("Third .next(): ", iterator.next()); // { value: 'Express', done: false }
console.log("Fourth .next():", iterator.next()); // { value: undefined, done: true }

console.log();

// ----------------------------------------------------------------------------
// 2. CREATING A CUSTOM ITERABLE OBJECT
// ----------------------------------------------------------------------------
console.log("--- 2. CUSTOM ITERABLE OBJECT (NUMBER RANGE) ---");

// An object that represents a numerical range (from -> to):
const numberRange = {
    from: 1,
    to: 4,

    // Implementing the Iterable Protocol:
    [Symbol.iterator]() {
        let current = this.from;
        const last = this.to;

        // Implementing the Iterator Protocol:
        return {
            next() {
                if (current <= last) {
                    return { value: current++, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
};

// Because it implements Symbol.iterator, it works with for...of:
console.log("Consuming custom iterable with for...of:");
for (const num of numberRange) {
    console.log(` - Value: ${num}`);
}

// And works with the Spread operator:
console.log("Spreading custom iterable into array:", [...numberRange]);

console.log();

// ----------------------------------------------------------------------------
// 3. GENERATOR FUNCTIONS (FUNCTION* & YIELD)
// ----------------------------------------------------------------------------
console.log("--- 3. GENERATOR FUNCTIONS (SYNTACTIC SUGAR FOR ITERATORS) ---");

function* stepByStepTaskRunner() {
    console.log(">> Task Started");
    yield "Step 1: Database connected";

    console.log(">> Resumed after Step 1");
    yield "Step 2: User authenticated";

    console.log(">> Resumed after Step 2");
    yield "Step 3: Email notification dispatched";

    console.log(">> Task Completed");
}

const taskGenerator = stepByStepTaskRunner();

console.log("Running task step 1:", taskGenerator.next().value);
console.log("Running task step 2:", taskGenerator.next().value);
console.log("Running task step 3:", taskGenerator.next().value);
console.log("Final call:         ", taskGenerator.next()); // done: true

console.log();

// ----------------------------------------------------------------------------
// 4. INFINITE SEQUENCES (LAZY EVALUATION)
// ----------------------------------------------------------------------------
console.log("--- 4. INFINITE ID GENERATOR (LAZY EVALUATION) ---");

function* infiniteUniqueIdGenerator(prefix = "ID") {
    let id = 1000;
    while (true) {
        // Pauses here indefinitely until .next() is called:
        yield `${prefix}-${id++}`;
    }
}

const idGen = infiniteUniqueIdGenerator("USER");

console.log("Generated:", idGen.next().value); // USER-1000
console.log("Generated:", idGen.next().value); // USER-1001
console.log("Generated:", idGen.next().value); // USER-1002
console.log("Generated:", idGen.next().value); // USER-1003
// Memory used: Zero extra memory! Computed on the fly.

console.log();

// ----------------------------------------------------------------------------
// 5. TWO-WAY DATA PASSING & GENERATOR DELEGATION (YIELD*)
// ----------------------------------------------------------------------------
console.log("--- 5. GENERATOR DELEGATION (YIELD*) ---");

function* frontendTopics() {
    yield "React";
    yield "Next.js";
}

function* backendTopics() {
    yield "Node.js";
    yield "Express";
}

function* fullStackCurriculum() {
    // yield* delegates iteration to another generator:
    yield* frontendTopics();
    yield* backendTopics();
    yield "PostgreSQL";
}

console.log("Fullstack curriculum items:");
for (const topic of fullStackCurriculum()) {
    console.log(" *", topic);
}

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. ITERATORS & GENERATORS CHEAT SHEET ---");
console.table([
    { Concept: "Iterable", Definition: "Object with [Symbol.iterator]() method" },
    { Concept: "Iterator", Definition: "Object with .next() method returning { value, done }" },
    { Concept: "function*", Definition: "Generator declaration capable of pausing and resuming" },
    { Concept: "yield", Definition: "Pauses generator execution and emits a value" },
    { Concept: "yield*", Definition: "Delegates execution to another iterable or generator" }
]);

console.log("Module 18 loaded and executed successfully.\n");
