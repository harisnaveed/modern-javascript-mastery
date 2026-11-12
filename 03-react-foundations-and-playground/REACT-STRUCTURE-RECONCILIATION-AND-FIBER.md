# ⚛️ Deep Dive: React Structure, Reconciliation & Fiber Engine

> A comprehensive, production-grade architectural guide explaining how React works under the hood — from internal package structure and JSX compilation to the Fiber singly linked-list tree, O(n) reconciliation heuristics, and concurrent time-slicing.

---

## 📑 Table of Contents
1. [The 4-Package Architecture of React](#1-the-4-package-architecture-of-react)
2. [Component & Codebase Structure Best Practices](#2-component--codebase-structure-best-practices)
3. [Virtual DOM vs. The Real DOM](#3-virtual-dom-vs-the-real-dom)
4. [The React Reconciliation Algorithm](#4-the-react-reconciliation-algorithm)
   - [The O(n³) to O(n) Heuristic Solution](#the-on-to-on-heuristic-solution)
   - [The 3 Core Diffing Rules](#the-3-core-diffing-rules)
   - [The 2-Pass Child Diffing Algorithm](#the-2-pass-child-diffing-algorithm)
   - [Why `key={index}` Breaks State](#why-keyindex-breaks-state)
5. [The React Fiber Architecture](#5-the-react-fiber-architecture)
   - [The Problem: Stack Reconciler (Pre-React 16)](#the-problem-stack-reconciler-pre-react-16)
   - [What is a Fiber Node? (Data Schema)](#what-is-a-fiber-node-data-schema)
   - [The Singly Linked List Traversal (`child`, `sibling`, `return`)](#the-singly-linked-list-traversal-child-sibling-return)
   - [Double Buffering (`current` vs. `workInProgress`)](#double-buffering-current-vs-workinprogress)
   - [The 2 Phases: Render Phase vs. Commit Phase](#the-2-phases-render-phase-vs-commit-phase)
   - [Concurrent Time-Slicing & 32-Bit Priority Lanes](#concurrent-time-slicing--32-bit-priority-lanes)
6. [Interactive Labs in the React Playground](#6-interactive-labs-in-the-react-playground)

---

## 1. The 4-Package Architecture of React

React is not a monolithic library; it is split into four decoupled packages:

```
┌────────────────────────────────────────────────────────┐
│                   1. REACT CORE                        │
│  (npm: react)                                          │
│  • Defines createElement(), Component, useState, etc.  │
│  • Pure declarative description (Platform Agnostic)   │
└───────────────────────────┬────────────────────────────┘
                            │ Schedules work
┌───────────────────────────▼────────────────────────────┐
│                    2. SCHEDULER                        │
│  (npm: scheduler)                                      │
│  • Prioritizes tasks with 32-bit Lanes                 │
│  • Cooperative time-slicing (5ms slices via MessageCh) │
└───────────────────────────┬────────────────────────────┘
                            │ Drives work loop
┌───────────────────────────▼────────────────────────────┐
│                3. REACT RECONCILER                     │
│  (npm: react-reconciler)                               │
│  • The Fiber Engine                                    │
│  • Diffing algorithm (O(n) 2-Pass Heuristics)          │
│  • Double-Buffering (current vs workInProgress)        │
└───────────────────────────┬────────────────────────────┘
                            │ Emits DOM mutation effects
┌───────────────────────────▼────────────────────────────┐
│                 4. HOST RENDERER                       │
│  (npm: react-dom, react-native, react-three-fiber)     │
│  • Browser: appendChild(), removeChild(), setAttribute│
│  • Mobile: Native iOS/Android Views                    │
│  • 3D: WebGL Scene Graph                               │
└────────────────────────────────────────────────────────┘
```

1. **`react`**: The developer-facing API. It defines how components are declared and provides hooks (`useState`, `useEffect`, `useMemo`). It does **not** know what a browser DOM or mobile screen is.
2. **`scheduler`**: Manages execution timing and priorities. It implements cooperative multitasking using `MessageChannel` (or `requestPostAnimationFrame`) to yield back to the browser every ~5ms so animations and clicks never freeze.
3. **`react-reconciler`**: The brain. Manages the Fiber tree, processes state updates, determines what changed between renders, and flags nodes with mutation tags (`Placement`, `Update`, `ChildDeletion`).
4. **`react-dom`**: The host bridge. Reads the completed effect list from the reconciler and executes synchronous DOM operations (`document.createElement`, `node.appendChild`, `node.setAttribute`).

---

## 2. Component & Codebase Structure Best Practices

In modern production applications, organize your React components using **Feature-Driven Architecture**:

```
src/
├── features/                     # Feature-sliced modules
│   ├── auth/
│   │   ├── components/           # UI components specific to auth
│   │   │   ├── LoginForm.jsx
│   │   │   └── OAuthButtons.jsx
│   │   ├── hooks/                # Feature-specific hooks
│   │   │   └── useAuthSession.js
│   │   ├── services/             # API client calls
│   │   │   └── authApi.js
│   │   └── index.js              # Public surface of feature
│   │
│   └── repair-orders/
│       ├── components/
│       │   ├── RepairCard.jsx
│       │   └── RepairQueue.jsx
│       └── hooks/
│           └── useRepairQueue.js
│
├── components/ui/                # Shared design system components
│   ├── Button.jsx
│   ├── Modal.jsx
│   └── Input.jsx
│
├── hooks/                        # Globally reusable hooks
│   ├── useDebounce.js
│   └── useOnlineStatus.js
│
├── App.jsx
└── main.jsx
```

### Key Rules for Component Structure:
- **Presentation vs. Container**: Keep visual layout components free from heavy business logic or network requests.
- **Colocation**: Keep state, types, styles, and tests close to the components that use them.
- **Pure Functions**: Components must be pure functions of `(props, state) => JSX`. Never mutate variables outside their scope during render.

---

## 3. Virtual DOM vs. The Real DOM

```
[ State Update ] 
       ↓
[ JSX Returns VDOM Tree ]  (Plain JS Objects in Memory: ~0.01ms)
       ↓
[ Reconciliation Diff ]    (Compares Old VDOM vs New VDOM)
       ↓
[ Fiber Effect List ]      (Minimal mutation list: Placement, Update)
       ↓
[ Commit to Real DOM ]     (Surgical DOM mutations: appendChild, etc.)
       ↓
[ Browser Pipeline ]       (Recalculate Styles → Layout Reflow → Paint)
```

The browser DOM is expensive because mutating it triggers geometric recalculations (layout reflow) and GPU repainting. 
The Virtual DOM (VDOM) is simply a lightweight tree of plain JavaScript objects:

```javascript
// What JSX compiles to:
const vdomNode = {
  $$typeof: Symbol.for("react.element"),
  type: "button",
  key: "btn_save",
  props: {
    className: "btn-primary",
    onClick: handleSave,
    children: "Save Changes"
  }
};
```
React creates, compares, and discards thousands of these objects in memory in less than a single millisecond without touching the browser engine.

---

## 4. The React Reconciliation Algorithm

### The O(n³) to O(n) Heuristic Solution
Finding the absolute minimum number of operations to transform one arbitrary tree into another has a computational complexity of **$O(n^3)$**. 
For an enterprise tree with 1,000 components:
$$\text{Operations} = 1,000^3 = 1,000,000,000 \text{ (1 Billion computations!)}$$

React achieves **$O(n)$ linear complexity** by applying two pragmatic heuristics:
1. Two elements of different types produce completely different trees.
2. The developer can hint which elements are stable across renders using the `key` prop.

---

### The 3 Core Diffing Rules

#### Rule 1: Different Element Types Tear Down the Subtree
If the element type changes (e.g. from `<div>` to `<section>`, or from `<Header>` to `<Navbar>`), React does **not** attempt to diff their children. It destroys the old DOM node, unmounts all children (firing cleanup effects), and mounts the new tree from scratch.

```jsx
// Before:
<div><Counter /></div>

// After:
<section><Counter /></section>

// Result:
// <div> is removed from DOM. <Counter /> state is completely wiped out!
```

#### Rule 2: Same Element Types Update Attributes In-Place
When comparing two elements of the same type, React keeps the same underlying browser DOM node and mutates only the changed attributes or styles:

```jsx
// Before:
<div className="card text-muted" title="Old" />

// After:
<div className="card text-active" title="New" />

// Result:
// Real DOM node HTMLDivElement is preserved!
// React executes only:
// domNode.className = "card text-active";
// domNode.setAttribute("title", "New");
```

#### Rule 3: Keys Identify Elements in Lists
When reconciling children in a list, React uses the `key` prop to match old children to new children.

---

### The 2-Pass Child Diffing Algorithm

When an array of children changes, React executes a **2-Pass Algorithm**:

```
OLD LIST: [ A (0),  B (1),  C (2),  D (3) ]
NEW LIST: [ A (0),  C (1),  B (2),  E (3) ]
```

#### ➔ PASS 1: The Linear Scan (Fast Path)
React loops through both old fibers and new elements simultaneously by index (`i = 0, 1, 2...`).
- At `i = 0`: Key `A === A` → **Reuse DOM node in-place!**
- At `i = 1`: Old is `B`, New is `C`. Key mismatch! **Pass 1 immediately breaks.**

#### ➔ PASS 2: The Map-Based Lookup (Reorders, Additions & Deletions)
1. React places all remaining old fibers (`B`, `C`, `D`) into a Hash Map:
   ```javascript
   const existingChildren = new Map([
     ["B", fiberB],
     ["C", fiberC],
     ["D", fiberD]
   ]);
   ```
2. React iterates through remaining new elements (`C`, `B`, `E`):
   - Element `C`: Found in Map! Remove from Map, reuse DOM node, check if it needs to move.
   - Element `B`: Found in Map! Remove from Map, reuse DOM node, flag `Placement` (move).
   - Element `E`: Not in Map! Flag `Placement` (insert brand new DOM node).
3. Any fibers remaining in the Map (`D`) are flagged with **`ChildDeletion`** (removed from DOM).

---

### Why `key={index}` Breaks State

When you use array indices as keys (`key={index}`), prepending or deleting items corrupts UI state:

```
[Before Prepend]
Index 0 (Key 0): Item "iPhone Battery" [Input: "Technician note: Broken cable"]
Index 1 (Key 1): Item "MacBook Screen"  [Input: "Technician note: Backlight off"]

[After Prepending "iPad Speaker" at the Top with key={index}]
Index 0 (Key 0): Item "iPad Speaker"   [Input: "Technician note: Broken cable"]  <-- CORRUPTED!
Index 1 (Key 1): Item "iPhone Battery" [Input: "Technician note: Backlight off"] <-- CORRUPTED!
Index 2 (Key 2): Item "MacBook Screen"  [Input: ""]
```

**Why this happens:**
React compares Key 0 to Key 0. Because both keys match, React believes the DOM node at index 0 didn't change! It updates the text prop ("iPad Speaker"), but leaves the uncontrolled `<input>` element untouched.

**The Fix:** Always use stable, unique IDs:
```jsx
// ALWAYS:
{items.map(item => (
  <RepairRow key={item.id} data={item} />
))}
```

---

## 5. The React Fiber Architecture

### The Problem: Stack Reconciler (Pre-React 16)
In React 15 and earlier, reconciliation used recursion on JavaScript's native Call Stack. 
If a component tree was large or complex, rendering took 30ms to 100ms:
- The single JavaScript thread was completely frozen.
- User clicks, typing, and CSS animations dropped frames (jank).
- Once rendering started, it could **not** be paused or interrupted.

---

### What is a Fiber Node? (Data Schema)

A Fiber is a plain JavaScript object representing a unit of work:

```javascript
const fiberNode = {
  // 1. Tag & Identity
  tag: 0,                           // 0 = FunctionComponent, 5 = HostComponent
  key: "task_99",
  type: TaskComponent,

  // 2. The Singly Linked List Tree Structure
  child: fiberFirstChild,           // Down to first child
  sibling: fiberNextSibling,        // Right to next sibling
  return: fiberParent,              // Up to parent component

  // 3. State & Props
  pendingProps: { status: "done" }, // Incoming props
  memoizedProps: { status: "open" },// Props from last commit
  memoizedState: hookLinkedList,    // Linked list of useState/useEffect

  // 4. Effects & Mutations
  flags: 0b00000000000000000000010, // Bitmask: Placement, Update, Deletion
  subtreeFlags: 0b0000000000000010, // Child mutation flags

  // 5. Concurrency & Double Buffering
  lanes: 0b00000000000000000000001, // 32-bit priority bitmask (SyncLane, DefaultLane)
  alternate: workInProgressFiber     // Pointer to counterpart in other tree
};
```

---

### The Singly Linked List Traversal (`child`, `sibling`, `return`)

Instead of a recursive tree, Fiber models your application as a **Singly Linked List**:

```
          [ HostRoot ]
               │
             child
               ↓
            [ <App> ]
               │
             child
               ↓
         [ <Navbar> ] ──sibling──► [ <Main> ]
                                      │
                                    child
                                      ↓
                                 [ <Card> ]
```

#### Traversal Rules:
1. **Down**: If a fiber has a `child`, visit `fiber.child`.
2. **Right**: If no child, visit `fiber.sibling`.
3. **Up**: If no sibling, return to `fiber.return` (parent) and check parent's sibling.

Because every node explicitly points to its neighbors, **React does not need the Call Stack to remember where it is**. React can pause at any fiber, save the pointer in a variable, and resume later!

---

### Double Buffering (`current` vs. `workInProgress`)

React borrows the **Double Buffering** technique from graphic game engines:

```
[ User Screen ] <══════════ [ current tree ]
                                    ▲
                                alternate
                                    ▼
[ Background Memory ] <════ [ workInProgress tree ]
```

1. **`current` Tree**: Represents the UI currently painted on the user's screen.
2. **`workInProgress` Tree**: Constructed in memory during the render phase. React copies fibers from `current` via `createWorkInProgress()` (using `fiber.alternate`).
3. **The Swap**: Once the entire `workInProgress` tree is fully built and diffed, React enters the Commit phase and executes an instantaneous pointer swap:
   ```javascript
   root.current = workInProgress;
   ```
The user never sees partially rendered or half-updated UI states!

---

### The 2 Phases: Render Phase vs. Commit Phase

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RENDER PHASE (Asynchronous & Interruptible)              │
│ • Runs workLoopConcurrent()                                 │
│ • Calls component functions, evaluates hooks               │
│ • Builds workInProgress tree and calculates diffs           │
│ • Cooperatively yields every 5ms via shouldYield()          │
│ • ZERO DOM MUTATIONS ARE ALLOWED HERE!                      │
└──────────────────────────────┬──────────────────────────────┘
                               │ Finished workInProgress ready
┌──────────────────────────────▼──────────────────────────────┐
│ 2. COMMIT PHASE (Synchronous & Uninterruptible)             │
│ • commitBeforeMutationEffects (e.g. getSnapshotBeforeUpdate)│
│ • commitMutationEffects (appendChild, removeChild, text)    │
│ • root.current = workInProgress (Double Buffering Swap!)    │
│ • commitLayoutEffects (useLayoutEffect runs synchronously)  │
│ • Browser paints the screen                                 │
│ • useEffect callbacks fire asynchronously after paint       │
└─────────────────────────────────────────────────────────────┘
```

---

### Concurrent Time-Slicing & 32-Bit Priority Lanes

React 18 and 19 prioritize updates using 32-bit integer bitmasks:

```javascript
const SyncLane            = 0b0000000000000000000000000000001; // Clicks, typing (Immediate)
const InputContinuousLane = 0b0000000000000000000000000000100; // Dragging, scrolling
const DefaultLane         = 0b0000000000000000000000000010000; // Normal useState/fetch
const TransitionLane      = 0b0000000000000000000111111100000; // startTransition / heavy filter
const IdleLane            = 0b0100000000000000000000000000000; // Offscreen pre-rendering
```

#### How Time-Slicing Works in the Work Loop:
```javascript
function workLoopConcurrent() {
  // Yield to browser every ~5ms so high-priority events can process
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

If a user clicks a button while a heavy `<TransitionLane>` filter is rendering:
1. `shouldYield()` returns `true`.
2. React saves `workInProgress` in memory.
3. React executes the urgent `SyncLane` click handler immediately.
4. React resumes the background filter render without restarting from scratch!

---

## 6. Interactive Labs in the React Playground

You can experience and interact with every single concept explained above directly in your browser:

```bash
# Start the interactive visual playground:
npm.cmd run react-playground:dev
```

Navigate to:
- **Module 12: React Architecture, Fiber & Reconciliation**
  - **Tab 1:** The 4-Layer Architecture Stepper (React Core ➔ Scheduler ➔ Reconciler ➔ DOM Renderer).
  - **Tab 2:** Interactive Fiber Tree Walker (`child`, `sibling`, `return`) with Double-Buffering pointer swap.
  - **Tab 3:** Live Reconciliation Diffing Simulator + Hands-on "Index as Key" bug lab.
- **Module 22:** Deep Reconciliation (2-Pass List Diffing Algorithm with Linear Scan & Map Lookups).
- **Module 23:** Fiber Internals & 32-Bit Priority Lanes (5ms Time-Slicing Simulator).
