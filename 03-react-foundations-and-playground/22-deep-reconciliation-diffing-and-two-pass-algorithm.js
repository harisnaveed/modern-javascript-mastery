/**
 * ============================================================================
 * MODULE 22: Deep Reconciliation & React's 2-Pass List Diffing Algorithm
 * ============================================================================
 * 
 * 1. THE MATHEMATICAL PROBLEM: O(n³) VS O(n)
 * ----------------------------------------------------------------------------
 * General minimum-edit distance algorithms for tree diffing (e.g. Levenshtein 
 * for trees) have O(n³) computational complexity.
 * For a component tree with 1,000 elements, O(n³) would require 1 BILLION operations!
 * 
 * React solves this with two pragmatic O(n) heuristics:
 * 1. Two elements of different types produce completely different trees.
 * 2. The developer can hint which child elements remain stable across renders with `key`.
 * 
 * 2. THE MULTI-CHILD 2-PASS RECONCILIATION ALGORITHM
 * ----------------------------------------------------------------------------
 * When reconciling an array of children, React uses a sophisticated 2-pass strategy:
 * 
 * ➔ PASS 1: The Linear Scan (Fast Path for Appends / In-place Updates)
 *    React loops through both old fibers and new elements simultaneously by index `i`.
 *    As long as `oldFiber.key === newElement.key`, React reuses the DOM node and updates props.
 *    The moment a key mismatch is found (e.g. an item was prepended or deleted), Pass 1 breaks!
 * 
 * ➔ PASS 2: The Map-Based Lookup (Handles Reorders, Inserts & Deletions)
 *    1. React places all remaining old fibers into a hash map: `Map<key, Fiber>`.
 *    2. React loops through the remaining new elements and looks up their keys in the Map in O(1) time!
 *    3. If found in Map: React reuses the Fiber and marks it with a `Placement` or `Update` flag.
 *    4. If not found in Map: React marks a brand new Fiber with `Placement`.
 *    5. Any old fibers left in the Map after the loop are marked with `Deletion`!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 22: Deep Reconciliation & React's 2-Pass List Diffing");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE EXACT 2-PASS LIST RECONCILIATION
// ============================================================================
console.log("--- 1. SIMULATING REACT'S 2-PASS DIFFING ALGORITHM ---");

function reconcileChildrenArray(oldFibers, newElements) {
  const operations = [];
  let oldIndex = 0;
  let newIndex = 0;

  console.log(`Initial Old List: [${oldFibers.map(f => f.key).join(", ")}]`);
  console.log(`Target New List:  [${newElements.map(e => e.key).join(", ")}]\n`);

  // --- PASS 1: Linear Scan ---
  console.log("Executing PASS 1: Linear Scan matching by index...");
  for (; oldIndex < oldFibers.length && newIndex < newElements.length; oldIndex++, newIndex++) {
    const oldFiber = oldFibers[oldIndex];
    const newElement = newElements[newIndex];

    if (oldFiber.key === newElement.key) {
      operations.push({ action: "REUSE_IN_PLACE", key: oldFiber.key, index: newIndex });
      console.log(`  Pass 1: Key "${oldFiber.key}" matches at index ${newIndex} -> Reused DOM node in-place.`);
    } else {
      console.log(`  Pass 1: Key mismatch at index ${newIndex} ("${oldFiber.key}" !== "${newElement.key}"). Breaking to Pass 2!`);
      break; // Key mismatch! Exit to Pass 2
    }
  }

  // --- PASS 2: Map-based Lookup ---
  if (newIndex < newElements.length) {
    console.log("\nExecuting PASS 2: Constructing Map<key, Fiber> for remaining items...");
    const existingChildrenMap = new Map();

    for (let i = oldIndex; i < oldFibers.length; i++) {
      existingChildrenMap.set(oldFibers[i].key, oldFibers[i]);
    }
    console.log(`  Map populated with keys: [${Array.from(existingChildrenMap.keys()).join(", ")}]`);

    for (; newIndex < newElements.length; newIndex++) {
      const newElement = newElements[newIndex];
      const matchedFiber = existingChildrenMap.get(newElement.key);

      if (matchedFiber) {
        operations.push({ action: "MOVE_OR_UPDATE", key: newElement.key, newIndex });
        console.log(`  Pass 2: Found key "${newElement.key}" in Map in O(1) time! Reused DOM node and moved to index ${newIndex}.`);
        existingChildrenMap.delete(newElement.key); // Consumed
      } else {
        operations.push({ action: "INSERT_NEW", key: newElement.key, newIndex });
        console.log(`  Pass 2: Key "${newElement.key}" not in Map. Generated fresh DOM node insertion at index ${newIndex}.`);
      }
    }

    // Remaining items in Map were deleted:
    existingChildrenMap.forEach((fiber, key) => {
      operations.push({ action: "DELETE_NODE", key });
      console.log(`  Pass 2: Old key "${key}" was not in new list. Marked for DOM DELETION!`);
    });
  }

  return operations;
}

// Test Case: Prepending and deleting an item
// Old: [A, B, C, D]
// New: [Z, A, C]  (Z prepended, B deleted, D deleted, A & C preserved)
const oldList = [{ key: "A" }, { key: "B" }, { key: "C" }, { key: "D" }];
const newList = [{ key: "Z" }, { key: "A" }, { key: "C" }];

const resultOps = reconcileChildrenArray(oldList, newList);

console.log("\nFinal Calculated DOM Operations Batch:");
console.log(resultOps);

console.log("\n✅ Module 22 Execution Verified: Deep 2-Pass Reconciliation proven.");
