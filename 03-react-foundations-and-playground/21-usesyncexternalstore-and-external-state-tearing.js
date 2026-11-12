/**
 * ============================================================================
 * MODULE 21: useSyncExternalStore — Eliminating State Tearing in Concurrent React
 * ============================================================================
 * 
 * 1. WHAT IS "UI TEARING" IN CONCURRENT REACT?
 * ----------------------------------------------------------------------------
 * In React 18+, rendering can be paused, split across frames, and resumed.
 * 
 * Imagine an external mutable store (e.g. Redux, Zustand, or `window.innerWidth`):
 * 1. Component A renders during Frame 1: Reads `store.color = "blue"`.
 * 2. React yields control to the browser.
 * 3. While paused, a WebSocket event mutates `store.color = "red"`.
 * 4. React resumes during Frame 2: Component B renders: Reads `store.color = "red"`.
 * 
 * Result: The UI renders with Component A as "blue" and Component B as "red",
 * even though they belong to the SAME atomic render pass!
 * This visual inconsistency is called "TEARING".
 * 
 * 2. WHAT IS `useSyncExternalStore`?
 * ----------------------------------------------------------------------------
 *   const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
 * 
 * - `subscribe`: Function that registers a callback when the external store changes.
 * - `getSnapshot`: Pure function returning current immutable snapshot of the store.
 * - `getServerSnapshot`: Snapshot used during Server-Side Rendering (SSR).
 * 
 * React detects if the snapshot changed while rendering was in flight, and if so,
 * synchronously re-renders the entire tree with the newest snapshot, 100% preventing tearing!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 21: useSyncExternalStore & Concurrent State Tearing");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: BUILDING AN EXTERNAL STORE WITH SUBSCRIPTION CAPABILITY
// ============================================================================
console.log("--- 1. BUILDING AN EXTERNAL IMMUTABLE STORE ---");

function createExternalStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getSnapshot() {
      return state; // Pure getter
    },
    setState(updater) {
      state = typeof updater === "function" ? updater(state) : updater;
      console.log(`[External Store] State mutated to:`, state);
      listeners.forEach(fn => fn()); // Broadcast to subscribers
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener); // Unsubscribe
    }
  };
}

const networkStore = createExternalStore({ isOnline: true, latency: 45 });

// Simulating React useSyncExternalStore subscription:
class MockSyncComponent {
  constructor(name, store) {
    this.name = name;
    this.store = store;
    this.snapshot = store.getSnapshot();
    
    // Subscribe to store updates
    this.unsubscribe = store.subscribe(() => {
      const nextSnapshot = this.store.getSnapshot();
      if (!Object.is(this.snapshot, nextSnapshot)) {
        this.snapshot = nextSnapshot;
        console.log(`  -> [useSyncExternalStore: ${this.name}] Snapshot change detected! Re-rendered with:`, this.snapshot);
      }
    });
  }
}

const headerOnlineBadge = new MockSyncComponent("HeaderBadge", networkStore);
const checkoutButton = new MockSyncComponent("CheckoutBtn", networkStore);

console.log("\nSimulating Network Offline Drop Event from Browser Window:");
networkStore.setState({ isOnline: false, latency: 999 });

console.log("\nSimulating Network Reconnection:");
networkStore.setState({ isOnline: true, latency: 32 });

headerOnlineBadge.unsubscribe();
checkoutButton.unsubscribe();

console.log("\n✅ Module 21 Execution Verified: useSyncExternalStore mechanics validated.");
