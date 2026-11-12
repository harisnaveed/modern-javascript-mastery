/**
 * ============================================================================
 * MODULE 18: useLayoutEffect vs useEffect — Timing, Paint & DOM Measurement
 * ============================================================================
 * 
 * 1. THE BROWSER PAINT TIMELINE & EXECUTION ORDER
 * ----------------------------------------------------------------------------
 * When state changes, React and the browser execute this strict 5-stage pipeline:
 * 
 * 1. React Render Phase: Calls component, calculates Virtual DOM diffs.
 * 2. React Commit Phase: React writes mutations to the Real Browser DOM.
 * 3. ➔ `useLayoutEffect` FIRES HERE (SYNCHRONOUSLY BEFORE PAINT!):
 *       The browser DOM is updated in memory, but pixels have NOT been painted yet!
 *       You can read layout (width, height, getBoundingClientRect) and adjust state.
 * 4. Browser Paint: The browser paints pixels onto the physical display screen.
 * 5. ➔ `useEffect` FIRES HERE (ASYNCHRONOUSLY AFTER PAINT):
 *       Runs passively after the user has already seen the screen paint.
 * 
 * 2. THE INFAMOUS "LAYOUT FLICKER" PROBLEM
 * ----------------------------------------------------------------------------
 * Scenario: A Tooltip positioned dynamically above a button.
 * - With `useEffect`:
 *   1. Tooltip renders at default coordinates (0, 0).
 *   2. Browser PAINTS tooltip at top-left corner of the screen! (Frame 1)
 *   3. `useEffect` measures button dimensions and updates tooltip position to (240, 110).
 *   4. Browser RE-PAINTS tooltip at correct position. (Frame 2)
 *   ➔ The user sees a jarring visual "flash" or jump!
 * 
 * - With `useLayoutEffect`:
 *   1. Tooltip inserted at (0, 0).
 *   2. `useLayoutEffect` runs BEFORE paint, measures button, and synchronously repositions it.
 *   3. Browser paints Frame 1 directly at (240, 110)! Zero flicker!
 * 
 * 3. WHEN TO USE WHICH:
 * ----------------------------------------------------------------------------
 * - 99% of the time: Use `useEffect` (non-blocking, keeps app fast).
 * - 1% of the time: Use `useLayoutEffect` (DOM measurements, custom tooltips, 
 *   canvas drawing, or scroll position restoration).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 18: useLayoutEffect vs useEffect & DOM Painting Timing");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE BROWSER PAINT TIMELINE
// ============================================================================
console.log("--- 1. BROWSER PAINTING & EFFECT EXECUTION TIMELINE ---");

class MockBrowserPipeline {
  constructor() {
    this.domState = { width: 0, x: 0, y: 0 };
    this.paintedPixelState = null;
  }

  // Stage 1 & 2: React Render and DOM Commit
  commitToDOM(initialCoords) {
    this.domState = { ...initialCoords };
    console.log(`[Stage 1 & 2] React Commit: Mutated real DOM nodes in memory to:`, this.domState);
  }

  // Stage 3: Synchronous useLayoutEffect
  runUseLayoutEffect(callback) {
    console.log(`[Stage 3] ⚡ useLayoutEffect executing (SYNCHRONOUS, BEFORE paint!)...`);
    callback(this.domState);
  }

  // Stage 4: Browser Paints Pixels to Screen
  browserPaint() {
    this.paintedPixelState = { ...this.domState };
    console.log(`[Stage 4] 🎨 BROWSER PAINTED TO SCREEN! User now sees:`, this.paintedPixelState);
  }

  // Stage 5: Asynchronous useEffect
  runUseEffect(callback) {
    // Scheduled asynchronously after paint
    setTimeout(() => {
      console.log(`[Stage 5] 🕒 useEffect executing (ASYNCHRONOUS, AFTER paint!)...`);
      callback(this.domState);
    }, 20);
  }
}

// SCENARIO A: Tooltip positioning using useEffect (Visual Flicker!)
console.log("Scenario A: Positioning Tooltip with useEffect (Causes Layout Flicker):");
const pipelineA = new MockBrowserPipeline();
pipelineA.commitToDOM({ x: 0, y: 0 }); // Initial unmeasured position
pipelineA.browserPaint(); // 💥 Frame 1 painted at (0, 0) - FLICKER!
pipelineA.runUseEffect((dom) => {
  dom.x = 240;
  dom.y = 110;
  console.log(`  -> useEffect recalculated coords to (240, 110). Browser must re-paint!`);
});

// SCENARIO B: Tooltip positioning using useLayoutEffect (Zero Flicker!)
setTimeout(() => {
  console.log("\nScenario B: Positioning Tooltip with useLayoutEffect (Zero Flicker):");
  const pipelineB = new MockBrowserPipeline();
  pipelineB.commitToDOM({ x: 0, y: 0 }); // Initial unmeasured position
  pipelineB.runUseLayoutEffect((dom) => {
    // Repositioned BEFORE the browser paints!
    dom.x = 240;
    dom.y = 110;
    console.log(`  -> useLayoutEffect recalculated coords synchronously before paint.`);
  });
  pipelineB.browserPaint(); // ✨ Frame 1 painted directly at (240, 110) - PERFECT!

  console.log("\n==================================================================");
  console.log("  SUMMARY COMPARISON");
  console.log("==================================================================");
  console.log("Hook              | Execution Timing         | Blocks Browser Paint?");
  console.log("------------------|--------------------------|----------------------");
  console.log("useLayoutEffect   | Before screen repaint    | YES (Synchronous)");
  console.log("useEffect         | After screen repaint     | NO  (Asynchronous)");
  console.log("==================================================================\n");

  console.log("✅ Module 18 Execution Verified: useLayoutEffect vs useEffect timing proven.");
}, 40);
