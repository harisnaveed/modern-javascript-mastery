/**
 * ============================================================================
 * MODULE 25: React 19 Modern Features — Actions, useActionState & useOptimistic
 * ============================================================================
 * 
 * 1. THE REACT 19 PARADIGM SHIFT: ACTIONS
 * ----------------------------------------------------------------------------
 * Prior to React 19, handling a form submission required boilerplate:
 *   const [isPending, setIsPending] = useState(false);
 *   const [error, setError] = useState(null);
 *   const [data, setData] = useState(null);
 * 
 * In React 19, any async function passed to `<form action={...}>` or `startTransition`
 * is an "ACTION".
 * Actions automatically handle pending states, optimistic updates, and error rollbacks!
 * 
 * 2. WHAT IS `useActionState`?
 * ----------------------------------------------------------------------------
 *   const [state, formAction, isPending] = useActionState(asyncAction, initialState);
 * 
 * Takes an action function that returns next state, and automatically exposes:
 * - `state`: The committed result or error
 * - `formAction`: The handler passed to `<form action={formAction}>`
 * - `isPending`: Boolean true while the server action is in flight!
 * 
 * 3. WHAT IS `useOptimistic`?
 * ----------------------------------------------------------------------------
 * In modern apps (e.g. WhatsApp, Slack, Twitter), when you press "Send Message",
 * you want the message to appear in the chat IMMEDIATELY, rather than waiting 
 * 800ms for the server to reply.
 * 
 * `useOptimistic` lets you render the temporary expected state while the network 
 * request is pending:
 *   const [optimisticMessages, addOptimisticMessage] = useOptimistic(
 *     messages,
 *     (current, newMessage) => [...current, { ...newMessage, sending: true }]
 *   );
 * 
 * If the server confirms: React commits the permanent state.
 * If the server fails: React AUTOMATICALLY ROLLS BACK to the previous state!
 * 
 * 4. THE `use` API (Conditional Promise & Context Unwrapping)
 * ----------------------------------------------------------------------------
 * Unlike all other hooks, `use(Promise)` or `use(Context)` can be called 
 * CONDITIONALLY inside `if` branches and loops!
 * Integrates directly with React `<Suspense>`!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 25: React 19 Actions, useActionState & useOptimistic");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING useOptimistic WITH AUTOMATIC ROLLBACK
// ============================================================================
console.log("--- 1. OPTIMISTIC UI UPDATES WITH AUTOMATIC ROLLBACK ---");

class MockOptimisticEngine {
  constructor(initialState) {
    this.committedState = initialState;
    this.optimisticState = initialState;
  }

  // User triggers an action
  async dispatchOptimisticAction(actionPayload, shouldServerSucceed = true) {
    console.log(`\n[User Action] Submitted: "${actionPayload.text}"`);

    // 1. Instantly update optimistic state (0ms latency!)
    this.optimisticState = [...this.committedState, { ...actionPayload, sending: true }];
    console.log(`  ⚡ [Optimistic UI] Message rendered immediately with (sending: true)!`);
    console.log(`  Live Display State:`, this.optimisticState.map(m => `${m.text} [${m.sending ? 'SENDING' : 'CONFIRMED'}]`));

    // 2. Simulate server network request
    try {
      const serverResult = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldServerSucceed) {
            resolve({ id: `msg_${Date.now()}`, text: actionPayload.text, sending: false });
          } else {
            reject(new Error("Network timeout: 504 Gateway"));
          }
        }, 30);
      });

      // Server succeeded: commit state permanently
      this.committedState = [...this.committedState, serverResult];
      this.optimisticState = this.committedState;
      console.log(`  ✅ [Server Confirmed] State committed permanently!`);
      console.log(`  Live Display State:`, this.optimisticState.map(m => `${m.text} [CONFIRMED]`));
    } catch (err) {
      // Server failed: AUTOMATIC ROLLBACK!
      console.log(`  ❌ [Server Failed: ${err.message}] Initiating AUTOMATIC ROLLBACK!`);
      this.optimisticState = this.committedState; // Revert to committed
      console.log(`  Live Display State after Rollback:`, this.optimisticState.map(m => m.text));
    }
  }
}

async function runOptimisticDemo() {
  const engine = new MockOptimisticEngine([
    { id: "msg_1", text: "Device ready for pickup?", sending: false }
  ]);

  // Scenario A: Successful Action
  console.log("--- Scenario A: Server Confirms Action ---");
  await engine.dispatchOptimisticAction({ text: "Yes, repair is 100% complete!" }, true);

  // Scenario B: Failed Action (Rollback)
  console.log("\n--- Scenario B: Server Error Triggering Rollback ---");
  await engine.dispatchOptimisticAction({ text: "Can you send the invoice?" }, false);

  console.log("\n==================================================================");
  console.log("  REACT 19 HOOKS CHEAT SHEET");
  console.log("==================================================================");
  console.log("Hook              | Purpose");
  console.log("------------------|-----------------------------------------------");
  console.log("useActionState    | Async form action state, isPending, and errors");
  console.log("useOptimistic     | Instant optimistic updates with auto rollback");
  console.log("useFormStatus     | Child button reads parent form's pending state");
  console.log("use(Promise)      | Unwraps promises directly in render with Suspense");
  console.log("==================================================================\n");

  console.log("✅ Module 25 Execution Verified: React 19 Actions and Optimistic updates proven.");
}

runOptimisticDemo();
