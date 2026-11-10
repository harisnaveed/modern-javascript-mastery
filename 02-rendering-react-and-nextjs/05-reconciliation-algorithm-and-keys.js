/**
 * ============================================================================
 * MODULE 05: The Reconciliation Algorithm & The Golden Rule of Keys
 * ============================================================================
 *
 * 1. THE "WHY" & MATHEMATICAL COMPLEXITY
 * ----------------------------------------------------------------------------
 * Finding the minimum number of operations to transform one arbitrary tree into 
 * another is a classical computer science problem with an algorithmic complexity 
 * of O(n^3).
 *
 * If your page has 1,000 DOM elements:
 * 1,000^3 = 1,000,000,000 (1 billion operations)!
 * Doing 1 billion operations on every keystroke or click would freeze any device.
 *
 * REACT'S O(n) HEURISTIC RECONCILIATION ALGORITHM
 * React solves this by making two practical, real-world assumptions:
 * 1. Two elements of different types will produce different trees.
 * 2. Child elements in a list that have stable `key` props can be tracked across renders.
 *
 * Thanks to these heuristics, React reduces tree diffing from O(n^3) down to O(n) 
 * (linear time: 1,000 operations instead of 1 billion)!
 *
 *
 * 2. THE 3 FUNDAMENTAL RECONCILIATION RULES
 * ----------------------------------------------------------------------------
 * RULE 1: Elements of Different Types
 *   Old: <div><Counter /></div>
 *   New: <section><Counter /></section>
 *   Because the tag changed from `div` to `section`, React completely DESTROYS 
 *   the old subtree (unmounts `<Counter />`, wipes its state) and creates a brand-new 
 *   subtree from scratch.
 *
 * RULE 2: Elements of the Same Type
 *   Old: <div className="btn-primary" title="Submit" />
 *   New: <div className="btn-success" title="Submit" />
 *   React retains the same underlying DOM element and ONLY mutates the changed 
 *   attribute (`className`). Component state is preserved!
 *
 * RULE 3: Child Lists & Keys
 *   When rendering lists with `.map()`, React needs to know which items were 
 *   added, removed, or reordered.
 *
 *
 * 3. THE INFAMOUS "INDEX AS KEY" ANTI-PATTERN
 * ----------------------------------------------------------------------------
 * ❌ DANGEROUS PATTERN:
 *   {users.map((user, index) => <UserCard key={index} user={user} />)}
 *
 * WHY IS THIS A DISASTER?
 * Imagine you have items at index 0, 1, 2.
 * You delete the first item (index 0).
 * What was at index 1 now becomes index 0!
 * React compares the old index 0 with the new index 0, thinks it's the SAME component, 
 * and retains internal state (e.g. checkbox state, input text), assigning it to 
 * the wrong user!
 *
 * ✅ THE GOLDEN RULE OF KEYS:
 * Keys must be STABLE, PREDICTABLE, and UNIQUE among sibling elements (e.g. `user.id`).
 * Never use `Math.random()` or array indices for keys if items can be reordered, 
 * inserted, or deleted!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 05: Reconciliation Algorithm & The Golden Rule of Keys");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING LIST DIFFING (INDEX KEYS VS STABLE ID KEYS)
// ============================================================================
console.log("--- 1. LIST RECONCILIATION SIMULATION ---");

// Initial List:
const initialList = [
  { id: "usr_101", name: "Ali", state: "Checked" },
  { id: "usr_102", name: "Ahmed", state: "Unchecked" },
  { id: "usr_103", name: "Haris", state: "Checked" },
];

console.log("Initial List:");
console.table(initialList);

// An item is PREPENDED at the beginning of the list:
const updatedList = [
  { id: "usr_999", name: "Usman (New)", state: "Unchecked" }, // Prepend!
  { id: "usr_101", name: "Ali", state: "Checked" },
  { id: "usr_102", name: "Ahmed", state: "Unchecked" },
  { id: "usr_103", name: "Haris", state: "Checked" },
];

// ----------------------------------------------------------------------------
// SIMULATION A: DIFFING USING ARRAY INDEX AS KEY
// ----------------------------------------------------------------------------
console.log("=== SCENARIO A: USING ARRAY INDEX AS KEY (key={index}) ===");

function reconcileWithIndexKeys(oldItems, newItems) {
  const operations = [];
  const max = Math.max(oldItems.length, newItems.length);

  for (let i = 0; i < max; i++) {
    const oldItem = oldItems[i];
    const newItem = newItems[i];

    if (oldItem && newItem) {
      if (oldItem.name !== newItem.name) {
        operations.push({
          indexKey: i,
          action: "MUTATE_DOM_IN_PLACE",
          details: `Index [${i}]: Replaced text "${oldItem.name}" with "${newItem.name}". Retained old UI state ("${oldItem.state}") -> 💥 BUG: WRONG STATE ASSIGNED!`,
        });
      }
    } else if (newItem && !oldItem) {
      operations.push({
        indexKey: i,
        action: "APPEND_DOM_NODE",
        details: `Index [${i}]: Appended new DOM node at the very end.`,
      });
    }
  }
  return operations;
}

const indexOperations = reconcileWithIndexKeys(initialList, updatedList);
console.table(indexOperations);


// ----------------------------------------------------------------------------
// SIMULATION B: DIFFING USING STABLE IDS AS KEY (key={user.id})
// ----------------------------------------------------------------------------
console.log("\n=== SCENARIO B: USING STABLE ID AS KEY (key={user.id}) ===");

function reconcileWithStableKeys(oldItems, newItems) {
  const oldKeyMap = new Map(oldItems.map((item) => [item.id, item]));
  const operations = [];

  for (const newItem of newItems) {
    if (oldKeyMap.has(newItem.id)) {
      operations.push({
        key: newItem.id,
        action: "REUSE_DOM_NODE",
        details: `Key [${newItem.id}]: Preserved DOM node and its internal state for "${newItem.name}".`,
      });
    } else {
      operations.push({
        key: newItem.id,
        action: "INSERT_DOM_NODE",
        details: `Key [${newItem.id}]: Created and inserted fresh DOM node for "${newItem.name}".`,
      });
    }
  }
  return operations;
}

const stableOperations = reconcileWithStableKeys(initialList, updatedList);
console.table(stableOperations);


// ============================================================================
// SECTION 2: RECONCILIATION SUMMARY CHEAT SHEET
// ============================================================================
console.log("\n--- 2. RECONCILIATION RULES CHEAT SHEET ---");

const reconciliationRules = [
  {
    Trigger: "Element Type Changes (<div> -> <span>)",
    ReactBehavior: "Destroys old subtree completely. Unmounts components, mounts new tree.",
    StatePreserved: "No (State is completely wiped)",
  },
  {
    Trigger: "Element Type Stays Same (<div class='a'> -> <div class='b'>)",
    ReactBehavior: "Reuses existing DOM node. Updates changed attributes only.",
    StatePreserved: "Yes",
  },
  {
    Trigger: "List Items with Stable Keys (key='usr_101')",
    ReactBehavior: "Matches elements across renders by key. Reorders/moves DOM nodes cleanly.",
    StatePreserved: "Yes (Safe & correct)",
  },
  {
    Trigger: "List Items with Index Keys (key={index})",
    ReactBehavior: "Assumes elements at same index are identical. Mismatches state during reordering.",
    StatePreserved: "Buggy (State gets mismatched)",
  },
];

console.table(reconciliationRules);

console.log("\nModule 05 loaded and executed successfully.");

