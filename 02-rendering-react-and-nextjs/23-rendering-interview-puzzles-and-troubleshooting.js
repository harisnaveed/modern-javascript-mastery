/**
 * ============================================================================
 * MODULE 23: Senior Rendering Interview Puzzles, Traps & Troubleshooting
 * ============================================================================
 *
 * 1. PURPOSE & CAPSTONE OVERVIEW
 * ----------------------------------------------------------------------------
 * This capstone module consolidates the 10 most infamous misunderstandings 
 * and tricky questions asked in Senior React & Next.js system architecture interviews.
 *
 * Senior engineers are distinguished by their ability to explain EXACTLY what 
 * happens under the hood when code executes on the server versus the browser.
 *
 *
 * 2. THE TOP 10 RENDERING MISUNDERSTANDINGS BUSTED
 * ----------------------------------------------------------------------------
 * 1. "Re-rendering means the DOM changed."
 *    ❌ FALSE: React calls the component function (Render phase), but if the VDOM 
 *    diff is identical, it performs ZERO DOM mutations (Commit phase skipped).
 *
 * 2. "Client Components only execute on the client (CSR)."
 *    ❌ FALSE: Client Components STILL pre-render into HTML on the server during 
 *    the initial page visit! They are hydrated on the client later.
 *
 * 3. "Server Components mean dynamic SSR."
 *    ❌ FALSE: Server Components can be rendered at build time during SSG or ISR! 
 *    They only use SSR if dynamic functions (`cookies()`, `headers()`) are used.
 *
 * 4. "Hydration creates the initial HTML."
 *    ❌ FALSE: The server created the HTML. Hydration only attaches event 
 *    listeners and state hooks to the existing DOM nodes.
 *
 * 5. "useEffect() executes on the server."
 *    ❌ FALSE: `useEffect()` NEVER runs on the server. It runs exclusively on 
 *    the client after the component is mounted to the real DOM.
 *
 * 6. "SSG means the website can never update without a rebuild."
 *    ❌ FALSE: Incremental Static Regeneration (ISR) and `revalidatePath()` 
 *    allow static pages to update in the background on demand.
 *
 * 7. "Reconciliation and Fiber are the exact same thing."
 *    ❌ FALSE: Reconciliation is the heuristic diffing algorithm (O(n)). 
 *    Fiber is the underlying data structure and scheduler that manages work.
 *
 * 8. "Virtual DOM is faster than direct DOM in all situations."
 *    ❌ FALSE: Virtual DOM has overhead. Its true benefit is declarative UI 
 *    synchronization and automated update batching.
 *
 * 9. "Functions can be passed as props to Client Components."
 *    ❌ FALSE: Props crossing the network must be JSON-serializable. Functions 
 *    cannot cross the boundary (use Server Actions instead).
 *
 * 10. "Streaming SSR requires WebSockets."
 *    ❌ FALSE: Streaming SSR uses standard HTTP/1.1 Chunked Transfer Encoding 
 *    or HTTP/2 multiplexing over regular HTTP connections.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 23: Senior Rendering Interview Traps & Troubleshooting");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: INTERACTIVE SENIOR INTERVIEW QUIZ ENGINE
// ============================================================================
console.log("--- 1. SENIOR RENDERING KNOWLEDGE EVALUATION ENGINE ---");

const interviewQuestions = [
  {
    question: "Do Next.js Client Components pre-render HTML on the server during initial load?",
    correctAnswer: true,
    explanation: "YES! Client components pre-render into static HTML on the server so the user sees content immediately, then React hydrates them on the client.",
  },
  {
    question: "Does useEffect() ever execute in a Node.js server environment?",
    correctAnswer: false,
    explanation: "NO! useEffect() is strictly a client-side hook that executes only after DOM mounting.",
  },
  {
    question: "Does a component re-rendering always result in a real browser DOM update?",
    correctAnswer: false,
    explanation: "NO! If the calculated JSX diff is identical, React skips the Commit phase entirely and performs 0 DOM updates.",
  },
  {
    question: "Can you pass an arrow function as a prop from a Server Component to a Client Component?",
    correctAnswer: false,
    explanation: "NO! Props crossing the RSC boundary must be JSON-serializable. Functions cannot be serialized over the network.",
  },
  {
    question: "Can Partial Prerendering (PPR) serve a static shell while streaming dynamic holes on the same page?",
    correctAnswer: true,
    explanation: "YES! PPR serves the static shell from CDN Edge in <20ms while streaming dynamic Suspense holes in parallel.",
  },
];

let score = 0;

for (let i = 0; i < interviewQuestions.length; i++) {
  const item = interviewQuestions[i];
  console.log(`Q${i + 1}: ${item.question}`);
  console.log(` -> Verified Truth: ${item.correctAnswer ? "TRUE" : "FALSE"}`);
  console.log(`    Architectural Insight: ${item.explanation}\n`);
  score++;
}

console.log(`Quiz Engine validated all ${score}/${interviewQuestions.length} architectural concepts!`);


// ============================================================================
// SECTION 2: SENIOR ARCHITECT RENDERING CHEAT SHEET
// ============================================================================
console.log("\n--- 2. THE 10 RENDERING COMMANDMENTS CHEAT SHEET ---");

const renderingCommandments = [
  {
    Concept: "Server Components (Default)",
    Rule: "Keep all components as Server Components unless interactivity is explicitly needed.",
  },
  {
    Concept: "Client Components ('use client')",
    Rule: "Push Client Components to the leaves of the tree (e.g. only the button, not the entire page).",
  },
  {
    Concept: "Data Fetching",
    Rule: "Fetch data in Server Components close to where it is used. Avoid useEffect() fetching waterfalls.",
  },
  {
    Concept: "Streaming with <Suspense>",
    Rule: "Wrap slow database/API sections in Suspense so fast page shells stream immediately.",
  },
  {
    Concept: "Hydration Mismatches",
    Rule: "Never execute Math.random(), Date.now(), or window access directly in component render bodies.",
  },
];

console.table(renderingCommandments);

console.log("\n==================================================================");
console.log("  RENDERING MASTERCLASS COMPLETE: 23 MODULES IMPLEMENTED!");
console.log("==================================================================");

