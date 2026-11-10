/**
 * ============================================================================
 * MODULE 13: Hydration Mismatch Errors & Production Fixes
 * ============================================================================
 *
 * 1. THE "WHY" & WHAT IS A HYDRATION MISMATCH?
 * ----------------------------------------------------------------------------
 * A Hydration Mismatch is one of the most common and frustrating bugs encountered 
 * by developers in Next.js and server-rendered React applications.
 *
 * During hydration, React traverses the existing server-rendered HTML in the DOM 
 * and compares it against the initial client render tree.
 * React expects them to be 100% IDENTICAL.
 *
 * If the server output and client initial output differ:
 * 💥 React throws the dreaded warning:
 *   "Warning: Text content did not match. Server: '0.145' Client: '0.982'"
 *   "Uncaught Error: Hydration failed because the initial UI does not match what was rendered on the server."
 *
 * CONSEQUENCES OF HYDRATION FAILURE:
 * - Performance penalty: React must discard the server DOM and recreate it from scratch.
 * - Visual flickering and Cumulative Layout Shift (CLS).
 * - Silent event listener binding bugs.
 *
 *
 * 2. THE 4 CLASSIC CAUSES OF HYDRATION MISMATCHES
 * ----------------------------------------------------------------------------
 * Cause 1: Non-Deterministic Functions (`Math.random()`, `crypto.randomUUID()`)
 *   The server executes `Math.random()` and gets 0.42.
 *   The browser executes `Math.random()` and gets 0.89. They do not match!
 *
 * Cause 2: Time & Dates (`Date.now()`, `toLocaleDateString()`)
 *   - The server renders at 14:00:00 UTC.
 *   - The user opens the page at 14:00:02 in Tokyo (UTC+9).
 *   Both the timestamp and the timezone differ!
 *
 * Cause 3: Browser-Only Globals (`window`, `localStorage`, `navigator`)
 *   The server has no `window` or `localStorage`. If you check:
 *   `const theme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';`
 *   Server renders "light", but user's browser has "dark". MISMATCH!
 *
 * Cause 4: Invalid HTML Markup Nesting
 *   Writing `<p><div>Block content</div></p>` or `<table><tr>...</tr></table>` (missing `<tbody>`).
 *   The browser parser automatically reorganizes invalid HTML, but React VDOM does not, 
 *   causing node hierarchy desynchronization.
 *
 *
 * 3. THE 3 PRODUCTION-GRADE FIXES
 * ----------------------------------------------------------------------------
 * FIX 1: The `useEffect` Mounting Flag Pattern
 *   Keep initial client render identical to server, and update state inside `useEffect`:
 *   const [isMounted, setIsMounted] = useState(false);
 *   useEffect(() => setIsMounted(true), []);
 *   if (!isMounted) return <p>Default Text</p>;
 *   return <p>{localStorage.getItem('theme')}</p>;
 *
 * FIX 2: `suppressHydrationWarning`
 *   For dynamic timestamps, add `suppressHydrationWarning` to the element:
 *   `<time suppressHydrationWarning>{new Date().toLocaleTimeString()}</time>`
 *
 * FIX 3: Next.js Dynamic Import with `{ ssr: false }`
 *   `const ClientOnlyWidget = dynamic(() => import('./Widget'), { ssr: false });`
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 13: Hydration Mismatch Errors & Production Fixes");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING A HYDRATION MISMATCH ERROR
// ============================================================================
console.log("--- 1. SIMULATING A HYDRATION MISMATCH (BUGGY CODE) ---");

function simulateHydrationCheck(serverHTML, clientOutput) {
  console.log(`Server Rendered HTML: "${serverHTML}"`);
  console.log(`Client Initial Output: "${clientOutput}"`);

  if (serverHTML !== clientOutput) {
    console.error("💥 [React Hydration Error] Hydration failed! Server and client outputs diverged.");
    console.warn("   Action taken by React: Discarding server DOM node and re-rendering in browser.");
    return false;
  }
  console.log("✅ [React Hydration Success] Server and Client matched perfectly! Zero DOM re-creation.");
  return true;
}

// Scenario A: Buggy Math.random() in render body
const serverRandom = `<span>Random: ${(0.12345).toFixed(4)}</span>`;
const clientRandom = `<span>Random: ${(0.98765).toFixed(4)}</span>`;

console.log("Scenario A: Non-deterministic Math.random():");
simulateHydrationCheck(serverRandom, clientRandom);


// ============================================================================
// SECTION 2: SIMULATING THE CLEAN `USEEFFECT` MOUNTING FIX
// ============================================================================
console.log("\n--- 2. THE MOUNTING FLAG PATTERN (CLEAN FIX) ---");

class SafeClientHydrationComponent {
  constructor() {
    this.isMounted = false; // Initial server & client match state
    this.theme = "light"; // Server default
  }

  // Initial render (Runs on BOTH Server and Client during hydration):
  render() {
    if (!this.isMounted) {
      // Must match server HTML!
      return `<div>Theme: light (Default)</div>`;
    }
    // After mounting, display actual client-side preference:
    return `<div>Theme: ${this.theme} (User Preference)</div>`;
  }

  // Simulated useEffect(): Runs ONLY on the client AFTER hydration finishes!
  componentDidMount() {
    this.isMounted = true;
    this.theme = "dark"; // Read from localStorage
    console.log("[Client useEffect] Component mounted! Reading localStorage -> theme = 'dark'.");
  }
}

const safeComponent = new SafeClientHydrationComponent();

// Step 1: Server renders initial HTML
const serverRendered = safeComponent.render();

// Step 2: Client performs initial hydration render (isMounted is still false)
const clientInitialRender = safeComponent.render();

console.log("Testing Hydration with Mounting Flag Pattern:");
const isHydrated = simulateHydrationCheck(serverRendered, clientInitialRender);

// Step 3: Hydration succeeds! Now useEffect fires safely:
if (isHydrated) {
  safeComponent.componentDidMount();
  console.log(`Re-rendered after hydration: "${safeComponent.render()}"`);
}


// ============================================================================
// SECTION 3: HYDRATION MISMATCH CAUSES & FIXES CHEAT SHEET
// ============================================================================
console.log("\n--- 3. HYDRATION MISMATCH TROUBLESHOOTING MATRIX ---");

const hydrationMatrix = [
  {
    Cause: "Math.random() or UUIDs",
    WhyItFails: "Different numbers generated on server vs client.",
    BestFix: "Use React 18/19 `useId()` hook for stable unique IDs.",
  },
  {
    Cause: "Date / Time formatting",
    WhyItFails: "Server timezone differs from user timezone.",
    BestFix: "Add `suppressHydrationWarning` to the <time> tag.",
  },
  {
    Cause: "window or localStorage",
    WhyItFails: "Undefined on server, defined on client.",
    BestFix: "Read inside `useEffect()`, or use `next/dynamic({ ssr: false })`.",
  },
  {
    Cause: "Invalid HTML (e.g. <p> inside <p>)",
    WhyItFails: "Browser C++ parser alters DOM structure.",
    BestFix: "Use valid HTML5 semantics (e.g. <div> or <span>).",
  },
];

console.table(hydrationMatrix);

console.log("\nModule 13 loaded and executed successfully.");

