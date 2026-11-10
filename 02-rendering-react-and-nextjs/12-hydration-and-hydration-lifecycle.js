/**
 * ============================================================================
 * MODULE 12: What is Hydration & The Hydration Lifecycle
 * ============================================================================
 *
 * 1. THE "WHY" & CORE DEFINITION
 * ----------------------------------------------------------------------------
 * When Next.js pre-renders a page on the server (using SSR, SSG, or ISR), it sends 
 * a pure HTML string to the browser.
 *
 * The browser can parse and display this HTML immediately:
 *   <div>
 *     <h1>Count: 0</h1>
 *     <button>Increase</button>
 *   </div>
 *
 * But there is a huge problem:
 * At this exact millisecond, this button is a "DEAD" HTML element!
 * It has NO `onClick` handler attached. If the user clicks it, nothing happens!
 *
 * WHAT IS HYDRATION?
 * Hydration is the process where React takes the pre-rendered server HTML already 
 * present in the browser DOM, walks through the DOM nodes, and "hydrates" them 
 * with JavaScript:
 * - Attaching event listeners (`onClick`, `onSubmit`).
 * - Initializing state hooks (`useState`, `useReducer`).
 * - Setting up side-effects (`useEffect`).
 *
 *
 * 2. THE MANNEQUIN ANALOGY
 * ----------------------------------------------------------------------------
 * Think of server-rendered HTML like a department store Mannequin:
 * - It has eyes, clothes, and looks like a human (Visually complete!).
 * - But it cannot talk, move, or respond to interaction.
 *
 * Hydration is like breathing real biological life into that mannequin:
 * - It connects nerve endings (event listeners) and muscles (React state).
 * - Now, when someone touches it, it immediately reacts!
 *
 *
 * 3. CRITICAL DISTINCTION: RENDERING VS HYDRATION
 * ----------------------------------------------------------------------------
 * Feature             Rendering                              Hydration
 * ----------------------------------------------------------------------------
 * Primary Goal        Calculates what the UI should look like. Attaches JS handlers to server HTML.
 * Where It Runs       Can run on Server OR Client.           Runs EXCLUSIVELY on the Client.
 * Output              HTML string or VDOM tree.              Interactive, living browser DOM.
 * DOM Creation        Creates brand-new DOM nodes.           REUSES existing server DOM nodes!
 *
 *
 * 4. HYDRATION IN REACT 18 & 19: HYDRATEROOT()
 * ----------------------------------------------------------------------------
 * In modern React:
 *   import { hydrateRoot } from 'react-dom/client';
 *   hydrateRoot(document.getElementById('root'), <App />);
 *
 * React expects the server HTML and the client output to match character for character.
 * If they match, React reuses the existing DOM nodes without redrawing the page!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 12: What is Hydration & The Hydration Lifecycle");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE HYDRATION LIFECYCLE
// ============================================================================
console.log("--- 1. SIMULATING THE HYDRATION LIFECYCLE ---");

// Step 1: Simulated Browser DOM containing static server-rendered HTML:
const simulatedBrowserDOM = {
  element: "BUTTON",
  text: "Increase Count: 0",
  hasEventListener: false,
  click: function () {
    if (!this.hasEventListener) {
      console.log(`💥 [User Click] Button clicked BEFORE hydration! Result: NOTHING HAPPENS (Dead HTML).`);
    } else {
      console.log(`✅ [User Click] Button clicked AFTER hydration! State updated: Count = 1!`);
    }
  },
};

console.log("[Phase 1: SERVER RENDERING] Next.js renders HTML on Node.js server.");
console.log("[Phase 2: BROWSER PAINT] Browser receives HTML and displays it on screen.");
console.log(`          Current Button State: "${simulatedBrowserDOM.text}"`);

// User attempts to click before JS downloads:
simulatedBrowserDOM.click();

// Step 2: Client JavaScript arrives and Hydration begins:
console.log("\n[Phase 3: JS DOWNLOAD] Client bundle (react-dom) downloaded over network.");
console.log("[Phase 4: HYDRATION] hydrateRoot() walks DOM tree and binds onClick listener...");

function simulateReactHydration(domNode) {
  // React attaches event handler to existing DOM node:
  domNode.hasEventListener = true;
  console.log(" - Attached React SyntheticEvent listener to <BUTTON>.");
  console.log(" - Initialized useState(0) hook on client.");
  console.log(" - Hydration complete in 4ms! Page is now fully interactive.");
}

simulateReactHydration(simulatedBrowserDOM);

// User clicks after hydration:
simulatedBrowserDOM.click();


// ============================================================================
// SECTION 2: THE 4 STAGES OF A SERVER-RENDERED PAGE LOAD
// ============================================================================
console.log("\n--- 2. THE 4 STAGES OF PAGE INTERACTIVITY ---");

const hydrationTimeline = [
  {
    Stage: "1. Server Render",
    Location: "Node.js Server",
    UserExperience: "Server executes component, generates HTML string.",
  },
  {
    Stage: "2. First Contentful Paint (FCP)",
    Location: "User Browser",
    UserExperience: "User sees page text and images immediately. (Non-interactive)",
  },
  {
    Stage: "3. JavaScript Download",
    Location: "Network",
    UserExperience: "Browser downloads client bundle in the background.",
  },
  {
    Stage: "4. Time To Interactive (TTI)",
    Location: "User Browser",
    UserExperience: "React finishes hydration. Buttons and inputs become responsive!",
  },
];

console.table(hydrationTimeline);

console.log("\nModule 12 loaded and executed successfully.");

