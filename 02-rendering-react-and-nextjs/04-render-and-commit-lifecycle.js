/**
 * ============================================================================
 * MODULE 04: The Render & Commit Lifecycle in React
 * ============================================================================
 *
 * 1. THE "WHY" & CORE DEFINITION
 * ----------------------------------------------------------------------------
 * A major source of confusion for developers learning React is:
 * "What actually happens between calling `setCount(1)` and seeing '1' on screen?"
 *
 * React splits UI updates into three clearly defined, distinct stages:
 *   Stage 1: TRIGGER  -> Requesting that React schedule work.
 *   Stage 2: RENDER   -> React calls components to calculate the new UI.
 *   Stage 3: COMMIT   -> React updates the real browser DOM.
 *   (Followed by Browser Paint: The browser paints pixels onto the screen).
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In PHP / Laravel:
 *   There is no separate render vs commit phase.
 *   1. An HTTP request hits Laravel routing (`routes/web.php`).
 *   2. Controller executes business logic (`UserController@show`).
 *   3. Blade template compiles to raw HTML.
 *   4. The entire HTML string is flushed out to the client.
 *   Everything happens synchronously in a single unidirectional pipeline.
 *
 * - In React:
 *   React can call your component (Render phase) multiple times without touching 
 *   the browser DOM! The Render phase is completely decoupled from the Commit phase.
 *
 *
 * 3. THE 3 STAGES IN DETAIL
 * ----------------------------------------------------------------------------
 * STAGE 1: TRIGGER
 * A component render is triggered by two events:
 * 1. Initial Render: The application first mounts via `createRoot(root).render(<App />)`.
 * 2. State Update: You invoke a state setter (`setCount(c => c + 1)`) or dispatch an action.
 * Note: Calling `setState()` does NOT immediately modify the DOM. It schedules a render.
 *
 * STAGE 2: RENDER PHASE (CALCULATING CHANGES)
 * - React calls the component function from top to bottom.
 * - For initial render: React creates DOM nodes in memory.
 * - For re-renders: React calculates the difference (diff) between the previous 
 *   and current JSX descriptors.
 * ⚠️ Golden Rule of Render Phase:
 * Components MUST be pure functions! The Render phase must NOT cause side effects 
 * (no direct DOM mutation, no network calls, no timers).
 *
 * STAGE 3: COMMIT PHASE (APPLYING CHANGES TO DOM)
 * - React applies the minimal calculated patches to the actual browser DOM.
 * - For initial render: React inserts all created nodes (`appendChild`).
 * - For re-renders: React only changes the specific DOM properties that differed!
 *
 * 🚨 CRITICAL INTERVIEW TAKEAWAY:
 * "Re-rendering" is NOT the same as "DOM Updating"!
 * If a component re-renders but produces the exact same JSX output, React executes 
 * the component function (Render phase), but DOES NOTHING to the DOM (Commit phase is skipped)!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 04: The Render & Commit Lifecycle in React");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE TRIGGER -> RENDER -> COMMIT WORKFLOW
// ============================================================================
console.log("--- 1. TRIGGER -> RENDER -> COMMIT SIMULATION ---");

class ReactEngineSimulator {
  constructor() {
    this.state = { count: 0 };
    this.lastRenderedUI = null;
    this.domText = "Initial Empty";
  }

  // STAGE 1: TRIGGER
  dispatchStateUpdate(newState) {
    console.log(`[Stage 1: TRIGGER] State update scheduled:`, newState);
    this.scheduleWork(newState);
  }

  // Scheduler queues the render
  scheduleWork(newState) {
    console.log(`[Scheduler] Prioritizing update in Fiber work queue...`);
    this.executeRenderPhase(newState);
  }

  // STAGE 2: RENDER PHASE
  executeRenderPhase(newState) {
    console.log(`[Stage 2: RENDER PHASE] Calling Component function...`);
    // Simulated component function
    const newUI = {
      type: "h1",
      props: { text: `Count: ${newState.count}` },
    };

    console.log(` - Computed new UI representation: "${newUI.props.text}"`);

    // Diff check
    if (this.lastRenderedUI && this.lastRenderedUI.props.text === newUI.props.text) {
      console.log(` - Diff check: Output is IDENTICAL. Skipping Commit phase completely!`);
      return;
    }

    this.lastRenderedUI = newUI;
    this.executeCommitPhase(newUI);
  }

  // STAGE 3: COMMIT PHASE
  executeCommitPhase(newUI) {
    console.log(`[Stage 3: COMMIT PHASE] Mutating real browser DOM...`);
    this.domText = newUI.props.text;
    console.log(` - Real DOM updated to: "<h1>${this.domText}</h1>"`);
    this.browserPaint();
  }

  // Browser Paint
  browserPaint() {
    console.log(`[Browser Engine] Painting pixels onto screen for: "${this.domText}"\n`);
  }
}

const engine = new ReactEngineSimulator();

// Step A: Initial Render
console.log("=== SCENARIO A: INITIAL RENDER ===");
engine.dispatchStateUpdate({ count: 0 });

// Step B: State change to count = 1
console.log("=== SCENARIO B: STATE UPDATE (COUNT = 1) ===");
engine.dispatchStateUpdate({ count: 1 });

// Step C: Redundant state change to count = 1 (Identical output)
console.log("=== SCENARIO C: REDUNDANT STATE UPDATE (COUNT = 1) ===");
engine.dispatchStateUpdate({ count: 1 });


// ============================================================================
// SECTION 2: RENDER VS COMMIT CHEAT SHEET
// ============================================================================
console.log("--- 2. RENDER VS COMMIT CHEAT SHEET ---");

const lifecycleComparison = [
  {
    Phase: "Stage 1: Trigger",
    When: "Initial load or setState() call.",
    WhatHappens: "React schedules an update in the internal scheduler.",
    TouchesRealDOM: "No",
  },
  {
    Phase: "Stage 2: Render",
    When: "React processes the scheduled work.",
    WhatHappens: "Calls component functions, creates VDOM, performs diffing.",
    TouchesRealDOM: "No (Pure JavaScript)",
  },
  {
    Phase: "Stage 3: Commit",
    When: "Only if differences were found during Render.",
    WhatHappens: "Mutates actual DOM nodes (appendChild, removeChild, textContent).",
    TouchesRealDOM: "Yes (Synchronous mutation)",
  },
  {
    Phase: "Browser Paint",
    When: "After React completes the Commit phase.",
    WhatHappens: "Browser draws updated layout and pixels on screen.",
    TouchesRealDOM: "GPU / Screen Display",
  },
];

console.table(lifecycleComparison);

console.log("\nModule 04 loaded and executed successfully.");

