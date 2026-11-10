/**
 * ============================================================================
 * MODULE 28: DOM Manipulation & The Event Delegation Pattern
 * Specification: W3C DOM Standard / WHATWG DOM
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 13 (Callbacks), Module 14 (The 'this' Keyword)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In early web development (and early jQuery codebases), developers attached
 * event listeners directly to individual interactive elements:
 * 
 *     document.querySelectorAll(".delete-btn").forEach(function(button) {
 *         button.addEventListener("click", handleDelete);
 *     });
 * 
 * WHY THIS DIRECT-ATTACHMENT PATTERN FAILED AT SCALE:
 * 
 * A) Severe Memory Bloat:
 *    - In an e-commerce catalog or data grid with 5,000 items, attaching 5,000
 *      separate event listeners allocated 5,000 closures and event handler
 *      records in memory, causing browsers on mobile devices to lag and crash.
 * 
 * B) The Dynamic Content Trap:
 *    - If new items were loaded via AJAX / fetch and appended to the list,
 *      THEY HAD NO LISTENERS ATTACHED! Clicking them did nothing.
 *    - Developers had to constantly re-scan the DOM and re-bind event listeners.
 * 
 * The architectural solution to both problems is **Event Delegation**, which
 * leverages the browser's native **Event Bubbling** mechanism.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - PHP generates an HTML string on the server and flushes it down the HTTP socket.
 *   Once the response is sent, PHP terminates completely.
 * - In the browser, JavaScript parses that HTML into an interactive, live tree of
 *   C++ objects called the **Document Object Model (DOM)**.
 *
 *
 * 3. THE 3 PHASES OF EVENT PROPAGATION
 * ----------------------------------------------------------------------------
 * When a user clicks a button, the event does NOT just fire on that button.
 * It travels through the DOM in 3 distinct phases:
 * 
 *   Phase 1: CAPTURING PHASE
 *     - The event travels down from `Window` -> `Document` -> `<body>` -> parent
 *       containers down toward the target element.
 *   Phase 2: TARGET PHASE
 *     - The event arrives at the exact element that was clicked (`event.target`).
 *   Phase 3: BUBBLING PHASE (Default)
 *     - The event bubbles back UP from the target -> parent -> `<body>` -> `Document` -> `Window`.
 * 
 * CRITICAL EVENT PROPERTIES:
 * - `event.target`: The actual, innermost element that was clicked.
 * - `event.currentTarget`: The element holding the active event listener.
 * - `event.stopPropagation()`: Stops the event from traveling further up the tree.
 * - `event.preventDefault()`: Prevents browser default behavior (e.g. form reload).
 *
 *
 * 4. THE EVENT DELEGATION PATTERN
 * ----------------------------------------------------------------------------
 * Instead of adding 5,000 event listeners to 5,000 buttons:
 * 1. Attach ONE single event listener to the stable parent container (e.g. `<ul id="list">`).
 * 2. When any button inside is clicked, the event bubbles up to the `<ul>`.
 * 3. In the parent listener, inspect `event.target.closest("button")` to know
 *    which item was clicked!
 * 
 * BENEFITS:
 * - Memory usage drops from O(N) to O(1) (1 listener instead of 5,000).
 * - Dynamically added elements work AUTOMATICALLY with zero re-binding!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - **How React Synthetic Events Work Under The Hood**:
 *   React does NOT attach native click handlers to individual JSX elements
 *   (`<button onClick={...}>`)!
 *   Instead, React attaches a single event listener to the root container
 *   (`document` or `#root`) and dispatches all events via internal Event Delegation!
 *   Understanding Event Delegation explains React's entire event subsystem.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 28: DOM Manipulation & Event Delegation");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SIMULATING DOM TREE & EVENT PROPAGATION IN JAVASCRIPT
// ----------------------------------------------------------------------------
console.log("--- 1. EVENT PROPAGATION ARCHITECTURE (BUBBLING) ---");

// Lightweight in-memory representation of DOM nodes to run natively in Node.js:
class MockDOMElement {
    constructor(tagName, id = "", className = "", parent = null) {
        this.tagName = tagName;
        this.id = id;
        this.className = className;
        this.parent = parent;
        this.listeners = {};
    }

    addEventListener(eventType, handler) {
        if (!this.listeners[eventType]) this.listeners[eventType] = [];
        this.listeners[eventType].push(handler);
    }

    // Simulates the browser dispatching an event with bubbling:
    dispatchEvent(event) {
        event.target = this; // The clicked target
        let current = this;

        // BUBBLING PHASE: Travel upwards from target to root parent:
        while (current) {
            event.currentTarget = current;
            const handlers = current.listeners[event.type] || [];
            for (const handler of handlers) {
                handler(event);
                if (event.isPropagationStopped) return; // stopPropagation() honored!
            }
            current = current.parent; // Bubble to parent node
        }
    }
}

// Build a simulated DOM hierarchy:
// <div id="app"> -> <ul id="todo-list"> -> <li class="todo-item"> -> <button class="delete-btn">
const appContainer = new MockDOMElement("DIV", "app");
const todoList = new MockDOMElement("UL", "todo-list", "", appContainer);
const todoItem1 = new MockDOMElement("LI", "item-1", "todo-item", todoList);
const deleteButton1 = new MockDOMElement("BUTTON", "btn-delete-1", "delete-btn", todoItem1);

console.log("Simulated DOM hierarchy built: div#app -> ul#todo-list -> li#item-1 -> button#btn-delete-1");

console.log();

// ----------------------------------------------------------------------------
// 2. THE EVENT DELEGATION PATTERN IN ACTION
// ----------------------------------------------------------------------------
console.log("--- 2. IMPLEMENTING THE EVENT DELEGATION PATTERN ---");

// Notice: We attach ZERO listeners to individual buttons!
// We attach ONE SINGLE listener to the parent 'todoList':
todoList.addEventListener("click", (event) => {
    console.log(`[Parent Listener Triggered on <${event.currentTarget.tagName} id="${event.currentTarget.id}">]`);
    console.log(` - Original clicked target: <${event.target.tagName} id="${event.target.id}">`);

    // Check if the clicked element (or its ancestor) was a delete button:
    if (event.target.className.includes("delete-btn")) {
        console.log(`[Event Delegation] Successfully intercepted click for: ${event.target.id}`);
        console.log(`[Action] Deleting parent item for button: ${event.target.id}`);
    }
});

// Click the button: Event automatically bubbles up to todoList:
console.log(">> User clicks button 1:");
deleteButton1.dispatchEvent({
    type: "click",
    isPropagationStopped: false,
    stopPropagation() { this.isPropagationStopped = true; }
});

console.log();

// ----------------------------------------------------------------------------
// 3. DYNAMIC CONTENT TEST (THE PROOF OF EVENT DELEGATION)
// ----------------------------------------------------------------------------
console.log("--- 3. DYNAMIC CONTENT TEST (ZERO RE-BINDING REQUIRED) ---");

// Simulate new items added dynamically via AJAX after page load:
const todoItem2 = new MockDOMElement("LI", "item-2", "todo-item", todoList);
const deleteButton2 = new MockDOMElement("BUTTON", "btn-delete-2", "delete-btn", todoItem2);

console.log("New dynamic Item 2 created and appended to list.");
console.log("Notice: We did NOT call addEventListener on deleteButton2!");

// User clicks newly created button 2:
console.log(">> User clicks dynamic button 2:");
deleteButton2.dispatchEvent({
    type: "click",
    isPropagationStopped: false,
    stopPropagation() { this.isPropagationStopped = true; }
});

console.log();

// ----------------------------------------------------------------------------
// 4. STOPPROPAGATION() DEMONSTRATION
// ----------------------------------------------------------------------------
console.log("--- 4. EVENT.STOPPROPAGATION() ---");

// Attach listener to appContainer:
appContainer.addEventListener("click", () => {
    console.log("[App Container] Root listener received click!");
});

// Create child with stopPropagation:
const isolatedChild = new MockDOMElement("BUTTON", "isolated-btn", "btn", appContainer);
isolatedChild.addEventListener("click", (event) => {
    console.log("[Isolated Child] Clicked! Calling event.stopPropagation()...");
    event.stopPropagation(); // Halts bubbling immediately!
});

console.log(">> Clicking isolated child:");
isolatedChild.dispatchEvent({
    type: "click",
    isPropagationStopped: false,
    stopPropagation() { this.isPropagationStopped = true; }
});
console.log("(Notice: appContainer listener was NEVER called because propagation stopped!)");

console.log();

// ----------------------------------------------------------------------------
// 5. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 5. DOM & EVENT DELEGATION CHEAT SHEET ---");
console.table([
    { Concept: "Event Bubbling", Explanation: "Events travel up from target through ancestors to window" },
    { Concept: "Event Delegation", Explanation: "Attaching 1 listener to parent to handle current and future children" },
    { Concept: "event.target", Explanation: "The actual deepest element that triggered the event" },
    { Concept: "event.currentTarget", Explanation: "The element that the event handler is attached to" },
    { Concept: "stopPropagation()", Explanation: "Stops event from bubbling higher up the DOM tree" },
    { Concept: "preventDefault()", Explanation: "Prevents default browser actions (like form reloads or link jumps)" }
]);

console.log("Module 28 loaded and executed successfully.\n");

