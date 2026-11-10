/**
 * ============================================================================
 * MODULE 21: Code Splitting, Lazy Loading & Selective Hydration
 * ============================================================================
 *
 * 1. THE "WHY" & THE MONOLITHIC BUNDLE TRAP
 * ----------------------------------------------------------------------------
 * Without optimization, a modern React app compiles into one giant `bundle.js` 
 * containing every single component, chart library, modal, and utility in the codebase.
 *
 * THE PROBLEM:
 * A user visiting your marketing homepage might download 1.2 MB of JavaScript, 
 * including:
 * - The checkout payment form.
 * - The analytics admin dashboard with heavy charting libraries (Chart.js / D3).
 * - The Markdown editor.
 * Even though the user will NEVER visit the admin dashboard on that visit!
 *
 *
 * 2. CODE SPLITTING & LAZY LOADING
 * ----------------------------------------------------------------------------
 * Code Splitting divides the application into separate chunks that are loaded on demand:
 * - Next.js automatically splits code by route folder (e.g. `/cart` is a separate chunk from `/`).
 * - For heavy components within a page, you use `next/dynamic`:
 *   `const HeavyChart = dynamic(() => import('@/components/HeavyChart'), { ssr: false });`
 *
 *
 * 3. THE REVOLUTION: SELECTIVE HYDRATION IN REACT 18 & 19
 * ----------------------------------------------------------------------------
 * Before React 18, Hydration was an "All-or-Nothing" monolithic operation:
 * Even with streaming SSR, React had to hydrate the ENTIRE page from top to bottom 
 * before ANY button could respond to user clicks.
 *
 * SELECTIVE HYDRATION WITH <SUSPENSE>:
 * By wrapping components in `<Suspense>`, React hydrates each section independently!
 *
 * AND HERE IS THE MAGIC: USER INTERACTION PRIORITIZATION!
 * Imagine Section A and Section B are both in the queue to be hydrated.
 * If the user suddenly clicks a button inside Section B:
 * 💥 React detects the user event, PAUSES the hydration of Section A, and 
 * JUMPS IMMEDIATELY to hydrate Section B first!
 * The click event is replayed, giving the user an instant, lag-free response!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 21: Code Splitting & Selective Hydration in React");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING SELECTIVE HYDRATION & USER EVENT INTERRUPT
// ============================================================================
console.log("--- 1. SIMULATING SELECTIVE HYDRATION & INTERACTION PRIORITY ---");

class SelectiveHydrationScheduler {
  constructor() {
    this.hydrationQueue = [
      { id: "sidebar", name: "Sidebar Navigation", isHydrated: false },
      { id: "comments", name: "User Comments Feed", isHydrated: false },
      { id: "footer", name: "Footer Links", isHydrated: false },
    ];
  }

  // Normal hydration traversal:
  hydrateNormally() {
    console.log("[Scheduler] Beginning sequential background hydration:");
    for (const item of this.hydrationQueue) {
      if (!item.isHydrated) {
        item.isHydrated = true;
        console.log(` - Hydrated: [${item.name}]`);
      }
    }
  }

  // Simulating user click interrupting hydration:
  simulateUserClickOnUncachedSection(targetId) {
    console.log(`\n💥 [USER INTERACTION DETECTED] User clicked inside <${targetId}> before it was hydrated!`);
    const targetItem = this.hydrationQueue.find((i) => i.id === targetId);

    if (targetItem && !targetItem.isHydrated) {
      console.log(`⚡ [SELECTIVE HYDRATION] React intercepts click and RE-PRIORITIZES queue!`);
      console.log(` - Pausing current background work.`);
      console.log(` - Fast-tracking hydration of [${targetItem.name}] IMMEDIATELY!`);
      targetItem.isHydrated = true;
      console.log(` - ✅ [${targetItem.name}] Hydrated in 2ms! Click event dispatched to handler!`);
    }
  }
}

const scheduler = new SelectiveHydrationScheduler();

// Hydrate sidebar first
scheduler.hydrationQueue[0].isHydrated = true;
console.log(`[Hydration Progress] [Sidebar Navigation] is hydrated.`);

// User clicks comments before comments are hydrated!
scheduler.simulateUserClickOnUncachedSection("comments");

// Resume remaining background hydration
scheduler.hydrateNormally();


// ============================================================================
// SECTION 2: NEXT/DYNAMIC CODE PATTERNS
// ============================================================================
console.log("\n--- 2. NEXT.JS LAZY LOADING WITH NEXT/DYNAMIC ---");

const dynamicImportSnippet = `
  import dynamic from "next/dynamic";

  // 1. Lazy load heavy component with custom loading fallback:
  const HeavyAnalyticsChart = dynamic(
    () => import("@/components/AnalyticsChart"),
    {
      loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
      ssr: false, // Disables server-side pre-rendering for browser-only canvas
    }
  );

  export default function AdminPage() {
    return (
      <main>
        <h1>Admin Dashboard</h1>
        {/* Component bundle is only downloaded when rendered! */}
        <HeavyAnalyticsChart />
      </main>
    );
  }
`;

console.log(dynamicImportSnippet.trim());


// ============================================================================
// SECTION 3: PERFORMANCE BENEFITS CHEAT SHEET
// ============================================================================
console.log("\n--- 3. PERFORMANCE SUMMARY MATRIX ---");

const performanceSummary = [
  {
    Technique: "Route Code Splitting",
    Mechanism: "Automatic by Next.js App Router",
    Impact: "Initial bundle only contains code for visited route.",
  },
  {
    Technique: "Component Lazy Loading",
    Mechanism: "next/dynamic() or React.lazy()",
    Impact: "Defers downloading heavy libraries (charts, editors) until needed.",
  },
  {
    Technique: "Selective Hydration",
    Mechanism: "React 18/19 <Suspense> boundaries",
    Impact: "Prioritizes hydrating elements user clicks on, eliminating input lag.",
  },
];

console.table(performanceSummary);

console.log("\nModule 21 loaded and executed successfully.");

