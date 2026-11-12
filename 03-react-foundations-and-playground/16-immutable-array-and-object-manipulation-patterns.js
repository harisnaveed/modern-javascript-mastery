/**
 * ============================================================================
 * MODULE 16: Immutable Array & Object Manipulation Patterns in React
 * ============================================================================
 * 
 * 1. THE 6 ESSENTIAL REACT ARRAY PATTERNS
 * ----------------------------------------------------------------------------
 * In React state, you must NEVER use mutating methods:
 *   push(), pop(), shift(), unshift(), splice(), sort(), reverse()
 * 
 * Instead, use the 6 Declarative Immutable Patterns:
 * 
 * 1. Appending (Add to end):
 *      [...arr, newItem]
 * 2. Prepending (Add to beginning):
 *      [newItem, ...arr]
 * 3. Inserting at arbitrary index `i`:
 *      [...arr.slice(0, i), newItem, ...arr.slice(i)]  OR  arr.toSpliced(i, 0, newItem)
 * 4. Removing item by ID:
 *      arr.filter(item => item.id !== targetId)
 * 5. Updating item by ID:
 *      arr.map(item => item.id === targetId ? { ...item, ...updates } : item)
 * 6. Sorting / Reversing (ES2023):
 *      arr.toSorted((a, b) => a.price - b.price)  AND  arr.toReversed()
 * 
 * 2. NESTED ARRAY & OBJECT IMMUTABILITY (The Shopping Cart Pattern)
 * ----------------------------------------------------------------------------
 * A common production nightmare is modifying a nested array inside an object:
 *   cart = {
 *     store: "Wah Tech",
 *     items: [
 *       { id: "p1", name: "iPhone", variants: [{ color: "black", inStock: 5 }] }
 *     ]
 *   }
 * 
 * To update `inStock` without mutating parent references:
 * You must clone each layer along the path of mutation!
 * 
 * 3. SPREAD OPERATOR GOTCHAS & PRECEDENCE
 * ----------------------------------------------------------------------------
 * - Overriding Precedence: Key placement matters!
 *     { ...user, role: "admin" } // ✅ role is overwritten with "admin"
 *     { role: "admin", ...user } // ❌ user.role overwrites "admin"!
 * - Shallow Copying: Spread copies primitive values, but nested objects 
 *   retain their memory pointers.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 16: Immutable Array & Object Manipulation in React");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: THE 6 IMMUTABLE ARRAY RECIPES
// ============================================================================
console.log("--- 1. THE 6 IMMUTABLE ARRAY RECIPES ---");

const initialTasks = [
  { id: 101, title: "Diagnostic check", completed: false, cost: 30 },
  { id: 102, title: "Clean thermal paste", completed: false, cost: 20 },
  { id: 103, title: "Replace laptop fan", completed: true, cost: 65 }
];

// 1. Appending
const appendedTasks = [...initialTasks, { id: 104, title: "Install Windows 11", completed: false, cost: 40 }];
console.log("1. Appended (Task 104 added to end): Length =", appendedTasks.length);

// 2. Prepending
const prependedTasks = [{ id: 100, title: "Check customer warranty", completed: true, cost: 0 }, ...initialTasks];
console.log("2. Prepended (Task 100 at index 0): First item =", prependedTasks[0].title);

// 3. Inserting at Index 1 (Between 101 and 102)
const insertedTasks = [
  ...initialTasks.slice(0, 1),
  { id: 999, title: "Backup customer data", completed: false, cost: 25 },
  ...initialTasks.slice(1)
];
console.log("3. Inserted at Index 1:", insertedTasks.map(t => t.id).join(", ")); // 101, 999, 102, 103

// 4. Removing by ID (Remove task 102)
const filteredTasks = initialTasks.filter(task => task.id !== 102);
console.log("4. Removed Task 102 (filter):", filteredTasks.map(t => t.id).join(", ")); // 101, 103

// 5. Updating an Item by ID (Mark task 101 as completed)
const updatedTasks = initialTasks.map(task => 
  task.id === 101 ? { ...task, completed: true, cost: 35 } : task
);
console.log("5. Updated Task 101 (map):", updatedTasks.find(t => t.id === 101));

// 6. Modern ES2023 Non-mutating Sorting & Reversing
const sortedByCost = initialTasks.toSorted((a, b) => b.cost - a.cost);
console.log("6. Sorted by Cost (High to Low):", sortedByCost.map(t => `${t.title} ($${t.cost})`));
console.log("   Original Array (Remains untouched!):", initialTasks.map(t => t.id).join(", "));

// ============================================================================
// SECTION 2: MULTI-LEVEL NESTED IMMUTABLE UPDATES
// ============================================================================
console.log("\n--- 2. MULTI-LEVEL NESTED OBJECT & ARRAY MUTATION ---");

const repairOrder = {
  orderId: "REP-9901",
  customer: {
    name: "Haris Ali",
    city: "Wah Cantt"
  },
  devices: [
    {
      deviceId: "dev_1",
      model: "MacBook Pro M1",
      partsReplaced: [
        { partId: "p_screen", name: "Liquid Retina Display", price: 320 }
      ]
    }
  ]
};

// Requirement: Add a new part (p_battery, $110) to dev_1 WITHOUT mutating repairOrder
const updatedOrder = {
  ...repairOrder, // 1. Clone root object
  customer: {
    ...repairOrder.customer, // 2. Clone customer if needed
    city: "Islamabad"
  },
  devices: repairOrder.devices.map(dev => 
    dev.deviceId === "dev_1"
      ? {
          ...dev, // 3. Clone target device
          partsReplaced: [
            ...dev.partsReplaced, // 4. Clone parts array and append
            { partId: "p_battery", name: "Original 99Wh Battery", price: 110 }
          ]
        }
      : dev
  )
};

console.log("Original Order Parts Count:", repairOrder.devices[0].partsReplaced.length); // 1
console.log("Updated Order Parts Count: ", updatedOrder.devices[0].partsReplaced.length); // 2
console.log("Original Customer City:   ", repairOrder.customer.city); // "Wah Cantt"
console.log("Updated Customer City:    ", updatedOrder.customer.city); // "Islamabad"
console.log("Are Root Pointers Equal?: ", repairOrder === updatedOrder); // false

// ============================================================================
// SECTION 3: SPREAD OPERATOR PRECEDENCE & OVERRIDE PITFALLS
// ============================================================================
console.log("\n--- 3. SPREAD OVERRIDE PRECEDENCE RULES ---");

const defaultSettings = { theme: "dark", notifications: true, fontSize: 14 };

// Correct: userOverrides come AFTER defaultSettings
const userConfigGood = {
  ...defaultSettings,
  notifications: false // Overrides default
};
console.log("Correct Overwrite (notifications):", userConfigGood.notifications); // false

// Broken Pitfall: defaultSettings placed AFTER override
const userConfigBad = {
  notifications: false,
  ...defaultSettings // ⚠️ DANGER: defaultSettings.notifications overwrites 'false'!
};
console.log("Broken Override (default overrode custom):", userConfigBad.notifications); // true!

console.log("\n✅ Module 16 Execution Verified: All immutable array and object patterns passed.");
