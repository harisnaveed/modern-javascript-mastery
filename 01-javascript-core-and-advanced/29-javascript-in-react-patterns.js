/**
 * ============================================================================
 * MODULE 29: Modern JavaScript in React Patterns
 * Specification: React Architecture / Modern JavaScript Idioms
 * Target Environment: Node.js (v18+) / React / Next.js
 * Prerequisite: Module 05 (Destructuring), Module 06 (Spread), Module 12 (Closures)
 * ============================================================================
 *
 * 1. THE "WHY" (CONNECTING JAVASCRIPT DIRECTLY TO REACT)
 * ----------------------------------------------------------------------------
 * React is NOT like Angular, Vue, or Laravel Blade.
 * React has NO specialized templating language or custom syntax directives
 * (like `*ngIf`, `v-for`, or `@foreach`).
 * 
 * **React IS 100% pure JavaScript and JSX.**
 * JSX simply compiles down to standard JavaScript function calls:
 *     <div className="card">Hello</div>
 *   becomes:
 *     jsx("div", { className: "card", children: "Hello" });
 * 
 * Developers who struggle with React almost always struggle because they have
 * gaps in their understanding of the core JavaScript idioms powering it.
 *
 *
 * 2. THE 5 CORE JAVASCRIPT PATTERNS POWERING REACT
 * ----------------------------------------------------------------------------
 * 
 * 1. IMMUTABILITY & STATE UPDATES:
 *    - In React, state must NEVER be mutated directly!
 *        state.todos.push(newTodo); // WRONG! React will NOT detect this change!
 *    - React checks `Object.is(previousState, nextState)`. If the array or object
 *      reference has not changed, React skips re-rendering!
 *    - Modern JS immutable patterns:
 *        - Adding to array:      `setTodos(prev => [...prev, newTodo])`
 *        - Removing from array:  `setTodos(prev => prev.filter(t => t.id !== id))`
 *        - Updating in array:    `setTodos(prev => prev.map(t => t.id === id ? { ...t, done: true } : t))`
 *        - Updating object:      `setUser(prev => ({ ...prev, role: "Admin" }))`
 * 
 * 2. JSX LIST RENDERING & THE UNIQUE KEY RULE:
 *    - Array `.map()` is the universal list rendering engine in React.
 *    - Why `key={index}` is an Anti-Pattern:
 *      Using array index as a key breaks state when items are reordered, sorted,
 *      or deleted. Always use a stable, unique ID (`key={item.id}`).
 * 
 * 3. CONDITIONAL RENDERING IDIOMS & THE "ZERO TRAP":
 *    - Ternary: `isLoggedIn ? <Dashboard /> : <Login />`
 *    - Logical AND (`&&`): `hasNotifications && <Badge />`
 *    - THE NOTORIOUS "0" ZERO TRAP IN JSX:
 *        `items.length && <List />`
 *      If `items.length` is 0, React prints the literal number `0` onto the screen!
 *      Fix: `items.length > 0 && <List />` or `Boolean(items.length) && <List />`.
 * 
 * 4. CLOSURES IN CUSTOM HOOKS:
 *    - Custom React hooks (e.g. `useDebounce`, `useLocalStorage`, `useToggle`)
 *      are simply Higher-Order Functions that leverage closures to encapsulate
 *      stateful logic across re-renders.
 * 
 * 5. PROP DESTRUCTURING & REST FORWARDING:
 *    - `function Card({ title, badge = "New", children, ...divProps })`
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 29: Modern JavaScript in React Patterns");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. IMMUTABLE STATE UPDATES (THE FOUNDATION OF REACT STATE)
// ----------------------------------------------------------------------------
console.log("--- 1. IMMUTABLE STATE TRANSFORMATION PATTERNS ---");

// Simulated React State:
let state = {
    user: { id: 101, username: "haris_dev", theme: "light" },
    cart: [
        { id: 1, name: "Mechanical Keyboard", price: 120, qty: 1 },
        { id: 2, name: "Mousepad XXL",        price: 25,  qty: 2 },
        { id: 3, name: "USB-C Cable",         price: 15,  qty: 1 }
    ]
};

console.log("Initial Cart Item Count:", state.cart.length);

// A) Adding an item immutably (Spread Operator):
const newItem = { id: 4, name: "4K Monitor", price: 450, qty: 1 };
const cartWithNewItem = [...state.cart, newItem];
console.log("1. Added Item (Array Spread): Items count =", cartWithNewItem.length);

// B) Removing an item immutably (Array Filter):
const itemToRemoveId = 2;
const cartAfterRemoval = cartWithNewItem.filter(item => item.id !== itemToRemoveId);
console.log(`2. Removed ID #${itemToRemoveId} (Array Filter): Items count =`, cartAfterRemoval.length);

// C) Updating an item immutably (Array Map with Object Spread):
const targetUpdateId = 1;
const cartAfterQtyUpdate = cartAfterRemoval.map(item => {
    if (item.id === targetUpdateId) {
        return { ...item, qty: item.qty + 1 }; // Return new object clone
    }
    return item; // Keep existing reference
});
console.log(`3. Updated Qty for ID #${targetUpdateId} (Map + Spread):`, cartAfterQtyUpdate.find(i => i.id === 1));

// D) Updating nested object state immutably:
const updatedUserState = {
    ...state.user,
    theme: "dark"
};
console.log("4. Updated User Theme (Object Spread):", updatedUserState);

// Proof that original state was NEVER mutated:
console.log("5. Original State Unmutated Check: Cart length is still", state.cart.length);

console.log();

// ----------------------------------------------------------------------------
// 2. CONDITIONAL RENDERING & THE NOTORIOUS JSX "ZERO TRAP"
// ----------------------------------------------------------------------------
console.log("--- 2. CONDITIONAL RENDERING & THE JSX ZERO TRAP ---");

// Simulating JSX evaluation function:
function evaluateJsx(expression, element) {
    return expression && element;
}

const emptyMessages = [];

// THE BUG: In JSX, writing `messages.length && <Badge />`
// Because emptyMessages.length is 0, the expression evaluates to 0, which React renders as text!
const buggyRenderResult = evaluateJsx(emptyMessages.length, "🔔 You have messages!");
console.log("Buggy JSX Render (prints literal 0):", buggyRenderResult); // 0 (BUG!)

// THE FIX 1: Explicit boolean comparison (length > 0):
const fixedRender1 = evaluateJsx(emptyMessages.length > 0, "🔔 You have messages!");
console.log("Fixed JSX 1 (emptyMessages.length > 0):", fixedRender1); // false (renders nothing!)

// THE FIX 2: Double NOT (!!) or Boolean():
const fixedRender2 = evaluateJsx(Boolean(emptyMessages.length), "🔔 You have messages!");
console.log("Fixed JSX 2 (Boolean conversion):      ", fixedRender2); // false (renders nothing!)

// Ternary Operator for Alternate UI:
const isLoggedIn = false;
const authView = isLoggedIn ? "<UserProfile />" : "<LoginForm />";
console.log("Ternary conditional rendering:       ", authView);

console.log();

// ----------------------------------------------------------------------------
// 3. SIMULATING REACT CUSTOM HOOKS WITH CLOSURES
// ----------------------------------------------------------------------------
console.log("--- 3. CUSTOM HOOKS ARCHITECTURE (CLOSURES) ---");

/**
 * Custom hooks in React are simply JavaScript functions that encapsulate
 * logic using state and closures.
 * Here is a simulation of a reusable useToggle hook:
 */
function createToggleHook(initialValue = false) {
    let state = initialValue; // Enclosed state variable

    const toggle = () => {
        state = !state;
        return state;
    };

    const setExplicit = (value) => {
        state = Boolean(value);
        return state;
    };

    const get = () => state;

    return { get, toggle, setExplicit };
}

const modalVisibility = createToggleHook(false);
console.log("Modal initial state: ", modalVisibility.get()); // false
console.log("After toggle():      ", modalVisibility.toggle()); // true
console.log("After toggle():      ", modalVisibility.toggle()); // false
console.log("Explicit open:       ", modalVisibility.setExplicit(true)); // true

console.log();

// ----------------------------------------------------------------------------
// 4. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 4. JAVASCRIPT IN REACT CHEAT SHEET ---");
console.table([
    { ReactNeed: "Append item to state", JavaScriptIdiom: "setList(prev => [...prev, newItem])", Why: "Returns a brand new array reference" },
    { ReactNeed: "Remove item from state", JavaScriptIdiom: "setList(prev => prev.filter(i => i.id !== id))", Why: "Non-mutating removal" },
    { ReactNeed: "Update item in state", JavaScriptIdiom: "setList(prev => prev.map(i => i.id === id ? {...i, done: true} : i))", Why: "Non-mutating 1-to-1 clone" },
    { ReactNeed: "Render collection in JSX", JavaScriptIdiom: "items.map(item => <Card key={item.id} {...item} />)", Why: "Stable unique ID keys avoid render bugs" },
    { ReactNeed: "Avoid zero trap in JSX", JavaScriptIdiom: "items.length > 0 && <List />", Why: "Avoids printing literal '0' to the DOM" }
]);

console.log("Module 29 loaded and executed successfully.\n");

