/**
 * ============================================================================
 * MODULE 23: Fiber Internals, Lanes Priority Bitmasks & Time-Slicing
 * ============================================================================
 * 
 * 1. THE FIBER NODE DATA SCHEMA
 * ----------------------------------------------------------------------------
 * A Fiber is a plain JavaScript object representing a unit of work.
 * Its core anatomy includes:
 * 
 * - Instance & Pointers:
 *     tag: WorkTag (0 = FunctionComponent, 5 = HostComponent, 3 = HostRoot)
 *     stateNode: The physical DOM element or instance
 *     child, sibling, return: The linked-list tree pointers
 * 
 * - Props & Hooks State:
 *     pendingProps: Incoming props to be rendered
 *     memoizedProps: Props used in the previous commit
 *     memoizedState: Linked-list of hooks! (Each useState/useEffect is a node)
 * 
 * - Effects & Priorities:
 *     flags: Bitmask representing DOM operations (Placement, Update, Deletion)
 *     lanes: 32-bit integer representing task priority (Concurrent Mode)
 * 
 * 2. THE LANES BITMASK PRIORITY MODEL
 * ----------------------------------------------------------------------------
 * Why did React switch from numeric priorities (1 to 5) to 32-bit LANES?
 * Bitwise operations (AND `&`, OR `|`, NOT `~`) execute in 1 CPU cycle!
 * Multiple priorities can be grouped into a single integer:
 * 
 *   SyncLane:          0b0000000000000000000000000000001 (Clicks/Keypresses)
 *   InputContinuous:   0b0000000000000000000000000000100 (Scroll/Mousemove)
 *   DefaultLane:       0b0000000000000000000000000010000 (Normal state updates)
 *   TransitionLanes:   0b0000000000000000000111111100000 (useTransition)
 *   IdleLane:          0b0100000000000000000000000000000 (Offscreen/Background)
 * 
 * 3. THE CONCURRENT WORK LOOP & TIME-SLICING
 * ----------------------------------------------------------------------------
 *   function workLoopConcurrent() {
 *     while (workInProgress !== null && !shouldYield()) {
 *       performUnitOfWork(workInProgress);
 *     }
 *   }
 * 
 * React schedules a 5ms frame slice via `MessageChannel`. If rendering takes 
 * longer than 5ms, `shouldYield()` returns `true`. React yields control to the 
 * browser to paint or handle user clicks, and then resumes where it left off!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 23: Fiber Internals, Lanes Bitmasks & Time-Slicing");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: THE 32-BIT LANES PRIORITY SYSTEM
// ============================================================================
console.log("--- 1. THE 32-BIT LANES PRIORITY BITMASKS ---");

const SyncLane =         0b00000001; // 1: Urgent user click
const InputContinuous =  0b00000010; // 2: Drag / Scroll
const DefaultLane =      0b00000100; // 4: Regular setState
const TransitionLane1 =  0b00001000; // 8: useTransition task A
const TransitionLane2 =  0b00010000; // 16: useTransition task B
const IdleLane =         0b10000000; // 128: Background offscreen

// Grouping lanes using bitwise OR (|)
const pendingBatch = SyncLane | TransitionLane1;
console.log(`Pending Lane Bitmask: ${pendingBatch.toString(2).padStart(8, "0")}`);

// Checking priority using bitwise AND (&)
function isUrgentWorkPending(lanes) {
  return (lanes & SyncLane) !== 0;
}

console.log("Does batch include urgent click (SyncLane)?:", isUrgentWorkPending(pendingBatch)); // true
console.log("Does batch include drag (InputContinuous)?:", (pendingBatch & InputContinuous) !== 0); // false

// ============================================================================
// SECTION 2: SIMULATING THE TIME-SLICED CONCURRENT WORK LOOP
// ============================================================================
console.log("\n--- 2. TIME-SLICING WORK LOOP WITH shouldYield() ---");

// Mocking 15 units of Fiber work
const fiberWorkUnits = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Fiber Node #${i + 1}`
}));

let currentWorkIndex = 0;
let timeSliceStartTime = Date.now();

// Simulates React's 5ms time-slice threshold
function shouldYield(allocatedTimeMs = 5) {
  return (Date.now() - timeSliceStartTime) >= allocatedTimeMs;
}

function simulateWorkLoop() {
  console.log(`[Scheduler Frame] Started work-loop slice at T = 0ms`);
  timeSliceStartTime = Date.now();

  while (currentWorkIndex < fiberWorkUnits.length) {
    const fiber = fiberWorkUnits[currentWorkIndex];
    
    // Simulate ~2ms of diffing computation per fiber
    const busyWaitUntil = Date.now() + 2;
    while (Date.now() < busyWaitUntil) {}

    console.log(`  Processed: ${fiber.name} (Fiber index ${currentWorkIndex})`);
    currentWorkIndex++;

    // Check if 5ms budget expired:
    if (shouldYield(5) && currentWorkIndex < fiberWorkUnits.length) {
      console.log(`  🛑 [Time-Slice Budget Exceeded] shouldYield() === true! Yielding control to browser!`);
      // Schedule resumption in next macrotask (simulating MessageChannel)
      setTimeout(simulateWorkLoop, 10);
      return;
    }
  }

  console.log(`\n🎉 [Commit Phase] All 10 Fiber units reconciled! Swapping root pointer.\n`);
  console.log("✅ Module 23 Execution Verified: Fiber architecture and Lanes proven.");
}

simulateWorkLoop();
