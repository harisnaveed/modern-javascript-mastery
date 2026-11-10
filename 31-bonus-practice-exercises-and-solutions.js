/**
 * ============================================================================
 * MODULE 31: Practical Exercises & Real-World Solutions
 * Source: Part 32 of the Complete Modern JavaScript Handbook
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Modules 01 to 30
 * ============================================================================
 *
 * This bonus module solves and demonstrates all 28 practical exercises
 * from Part 32 of the Complete Modern JavaScript Handbook, grouped into:
 *   - Beginner Exercises (1 to 7)
 *   - Intermediate Exercises (8 to 16)
 *   - Advanced Exercises (17 to 28)
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 31: Practical Exercises & Reference Solutions (Part 32)");
console.log("==================================================================\n");

// ============================================================================
// LEVEL 1: BEGINNER EXERCISES (1 TO 7)
// ============================================================================
console.log("=== LEVEL 1: BEGINNER EXERCISES ===");

// 1. Create a function that adds two numbers.
function addNumbers(a, b) {
    return a + b;
}
console.log("[Ex 1] addNumbers(10, 25):", addNumbers(10, 25));

// 2. Convert a normal function into an arrow function.
const addNumbersArrow = (a, b) => a + b;
console.log("[Ex 2] addNumbersArrow(10, 25):", addNumbersArrow(10, 25));

// 3. Create an array of 10 products.
const productsList = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: (index + 1) * 100,
    category: index % 2 === 0 ? "Electronics" : "Accessories"
}));
console.log(`[Ex 3] Created ${productsList.length} products. Sample:`, productsList[0]);

// 4. Extract object properties using destructuring.
const sampleUser = { id: 101, username: "haris_dev", role: "Architect", country: "Pakistan" };
const { username: userName, role: userRole } = sampleUser;
console.log("[Ex 4] Destructured user:", { userName, userRole });

// 5. Combine two arrays using spread.
const frontendTech = ["React", "Next.js"];
const backendTech = ["Node.js", "Express"];
const fullTechStack = [...frontendTech, ...backendTech];
console.log("[Ex 5] Combined tech stack:", fullTechStack);

// 6. Create a function using rest parameters.
function calculateSum(...numbers) {
    return numbers.reduce((sum, n) => sum + n, 0);
}
console.log("[Ex 6] Rest parameters sum (1, 2, 3, 4, 5):", calculateSum(1, 2, 3, 4, 5));

// 7. Use template literals to generate dynamic messages.
const generateWelcomeMessage = (name, unreadCount) => 
    `Hello ${name}! You have ${unreadCount} unread message${unreadCount === 1 ? "" : "s"}.`;
console.log("[Ex 7] Template literal:", generateWelcomeMessage("Haris", 3));

console.log();

// ============================================================================
// LEVEL 2: INTERMEDIATE EXERCISES (8 TO 16)
// ============================================================================
console.log("=== LEVEL 2: INTERMEDIATE EXERCISES ===");

// 8. Filter products with a price greater than $500.
const expensiveItems = productsList.filter(p => p.price > 500);
console.log(`[Ex 8] Products > $500 (${expensiveItems.length} found):`, expensiveItems.map(p => p.name));

// 9. Find a product using its ID.
const productWithId5 = productsList.find(p => p.id === 5);
console.log("[Ex 9] Found product with ID 5:", productWithId5);

// 10. Calculate total prices using reduce().
const catalogGrandTotal = productsList.reduce((total, p) => total + p.price, 0);
console.log(`[Ex 10] Grand total price of all items: $${catalogGrandTotal}`);

// 11. Remove duplicate values using Set.
const rawRolesWithDuplicates = ["admin", "editor", "admin", "viewer", "editor"];
const cleanRoles = [...new Set(rawRolesWithDuplicates)];
console.log("[Ex 11] Deduplicated roles via Set:", cleanRoles);

// 12. Group products by category.
const groupedProducts = productsList.reduce((acc, product) => {
    const key = product.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(product.name);
    return acc;
}, {});
console.log("[Ex 12] Grouped products by category:", groupedProducts);

// 13. Create a Promise that resolves after 2 seconds (simulated 20ms for fast test).
function delayPromise(ms) {
    return new Promise(resolve => setTimeout(() => resolve(`Resolved after ${ms}ms`), ms));
}
delayPromise(20).then(msg => console.log("[Ex 13] Promise result:", msg));

// 14. Fetch data using async/await.
async function simulateAsyncFetch() {
    const data = await delayPromise(10);
    return `Async/await retrieved: ${data}`;
}
simulateAsyncFetch().then(res => console.log("[Ex 14]", res));

// 15. Create a reusable function using closures.
function createMultiplier(multiplier) {
    return value => value * multiplier;
}
const triple = createMultiplier(3);
console.log("[Ex 15] Closure multiplier triple(7):", triple(7)); // 21

// 16. Create an object using a JavaScript class.
class Course {
    constructor(title, durationWeeks) {
        this.title = title;
        this.durationWeeks = durationWeeks;
    }
    getInfo() {
        return `Course: ${this.title} (${this.durationWeeks} weeks)`;
    }
}
const jsMasteryCourse = new Course("Complete Modern JavaScript", 8);
console.log("[Ex 16] Class instance:", jsMasteryCourse.getInfo());

console.log();

// ============================================================================
// LEVEL 3: ADVANCED EXERCISES (17 TO 28)
// ============================================================================
console.log("=== LEVEL 3: ADVANCED EXERCISES ===");

// 17. Explain why var behaves differently from let:
console.log("[Ex 17] var vs let: var is function-scoped and hoists as undefined; let is block-scoped and resides in the TDZ.");

// 18. Explain the Temporal Dead Zone (TDZ):
console.log("[Ex 18] TDZ: The temporal period between entering scope and variable initialization where reading throws ReferenceError.");

// 19. Explain closures with a practical example (Encapsulated Rate Limiter):
function createRateLimiter(maxCalls) {
    let callCount = 0;
    return () => {
        if (callCount >= maxCalls) return "Rate limit exceeded! Please wait.";
        callCount++;
        return `Request approved. (Call ${callCount}/${maxCalls})`;
    };
}
const limiter = createRateLimiter(2);
console.log("[Ex 19] Closure Rate Limiter:", limiter());
console.log("[Ex 19] Closure Rate Limiter:", limiter());
console.log("[Ex 19] Closure Rate Limiter:", limiter()); // Blocked

// 20. Explain the event loop with Promise and setTimeout:
console.log("[Ex 20] Event Loop: Microtasks (Promises) drain completely before the next Macrotask (setTimeout) runs.");

// 21. Explain the difference between Promise.all and Promise.allSettled:
console.log("[Ex 21] Promise.all rejects immediately if any 1 fails; Promise.allSettled waits for all outcomes and never rejects.");

// 22. Create an example using call(), apply() and bind():
function introduce(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}
const speaker = { name: "Haris" };
console.log("[Ex 22] call: ", introduce.call(speaker, "Hello", "!"));
console.log("[Ex 22] apply:", introduce.apply(speaker, ["Hi", "..."]));
const boundIntroduce = introduce.bind(speaker, "Greetings", ".");
console.log("[Ex 22] bind: ", boundIntroduce());

// 23. Explain prototype inheritance:
console.log("[Ex 23] Prototype Inheritance: Live object-to-object delegation chain up to Object.prototype -> null.");

// 24. Implement event delegation:
console.log("[Ex 24] Event Delegation: Attaching 1 listener to parent container and catching events as they bubble up from children.");

// 25. Create a reusable API function using async/await and try/catch:
async function safeApiFetcher(fetcherFn) {
    try {
        const data = await fetcherFn();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }
}
safeApiFetcher(async () => "Mock Server Data").then(res => console.log("[Ex 25] Reusable API result:", res));

// 26. Implement a search and filter system using map(), filter() and find():
const searchProducts = (catalog, term, maxPrice) => catalog
    .filter(p => p.name.toLowerCase().includes(term.toLowerCase()) && p.price <= maxPrice)
    .map(p => `${p.name} ($${p.price})`);
console.log("[Ex 26] Search & filter result:", searchProducts(productsList, "product 1", 300));

// 27. Explain how JavaScript modules work:
console.log("[Ex 27] ES Modules: Static parse-time analysis enabling tree shaking, with named and default exports.");

// 28. Explain how Node.js handles asynchronous operations:
console.log("[Ex 28] Node.js Async: Single-threaded V8 engine offloading I/O to libuv thread pool, coordinated by the Event Loop.");

console.log("\nModule 31 loaded and executed successfully.\n");

