/**
 * ============================================================================
 * MODULE 15: Server & Client Component Composition Patterns
 * ============================================================================
 *
 * 1. THE "WHY" & THE COMPOSITION CHALLENGE
 * ----------------------------------------------------------------------------
 * A core architectural challenge in the Next.js App Router is:
 * "How do I put an interactive Client Component (like an animated collapsible modal) 
 * around a heavy Server Component (like a database-fetched user list)?"
 *
 * ❌ THE FATAL IMPORT TRAP:
 * If a Client Component (`"use client"`) directly imports a Server Component:
 *   // app/ClientModal.jsx ("use client")
 *   import ServerUserList from './ServerUserList'; // 💥 DISASTER!
 * Next.js CANNOT run `ServerUserList` on the server! It automatically turns 
 * `ServerUserList` into a Client Component, blowing up your bundle size and 
 * failing if it accesses server-only resources (`fs`, `db`).
 *
 *
 * 2. THE GOLDEN SOLUTION: THE "CHILDREN" SLOT PATTERN
 * ----------------------------------------------------------------------------
 * Instead of importing a Server Component inside a Client Component, 
 * you use React's `children` prop!
 *
 * In a Server Component (e.g. `page.jsx`):
 *   import ClientModal from './ClientModal';
 *   import ServerUserList from './ServerUserList';
 *
 *   export default function Page() {
 *     return (
 *       <ClientModal>
 *         <ServerUserList /> {/* Rendered on SERVER, passed as children! *\/}
 *       </ClientModal>
 *     );
 *   }
 *
 * Why does this work?
 * - `ServerUserList` executes on the server.
 * - Its rendered JSX output is passed as an opaque `children` slot to `ClientModal`.
 * - `ClientModal` manages interactive open/close state on the client.
 *
 *
 * 3. THE SERIALIZATION BOUNDARY (PROPS RULES)
 * ----------------------------------------------------------------------------
 * Any props passed from a Server Component to a Client Component must cross 
 * the network as part of the React Server Component (RSC) Payload.
 * Therefore, all props MUST BE SERIALIZABLE:
 *
 * ✅ ALLOWED PROPS:
 * - Primitives (strings, numbers, booleans, null, undefined)
 * - Plain Objects and Arrays
 * - BigInt, Date objects
 * - React elements (JSX / `children`)
 * - Promises (for streaming Suspense)
 *
 * ❌ FORBIDDEN PROPS (THROWS SERIALIZATION ERROR):
 * - Functions (callbacks like `onClick`, `onSuccess`)
 * - Class instances with methods (`new UserModel()`)
 * - Symbols
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 15: Server & Client Composition Patterns");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE "CHILDREN" SLOT COMPOSITION PATTERN
// ============================================================================
console.log("--- 1. THE CHILDREN SLOT COMPOSITION PATTERN ---");

// Server Component A: Fetches data directly on server
function ServerDataFeed() {
  console.log(`[Server Component: ServerDataFeed] Executing database query on Server...`);
  return {
    type: "ul",
    props: {
      children: [
        { type: "li", text: "User #1: Haris Ali (Admin)" },
        { type: "li", text: "User #2: Ayesha Khan (Editor)" },
      ],
    },
  };
}

// Client Component B: Manages collapsible UI toggle state
function ClientCollapsibleModal({ title, children }) {
  console.log(`[Client Component: ClientCollapsibleModal] Rendering interactive modal.`);
  console.log(` - State: isOpen = true (Managed on client via useState)`);
  console.log(` - Injected children rendered cleanly inside modal slot!`);

  return {
    type: "div",
    props: {
      className: "modal-dialog",
      header: title,
      body: children, // Opaque server-rendered slot!
    },
  };
}

// Server Component Root Page: Assembles the composition
function RootPage() {
  console.log("[Root Page] Assembling composition tree...");
  // Render server child first:
  const serverChild = ServerDataFeed();

  // Pass server child as prop to client component:
  return ClientCollapsibleModal({
    title: "Active Team Members",
    children: serverChild,
  });
}

const finalCompositionTree = RootPage();
console.log("\nComposition result (Client Modal wrapping Server Data):");
console.log(JSON.stringify(finalCompositionTree, null, 2));


// ============================================================================
// SECTION 2: TESTING SERIALIZATION ACROSS THE BOUNDARY
// ============================================================================
console.log("\n--- 2. VALIDATING PROPS ACROSS THE SERVER/CLIENT BOUNDARY ---");

function validateSerializationBoundary(props) {
  const issues = [];

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "function") {
      issues.push(`💥 Prop "${key}" is a FUNCTION. Functions cannot be passed from Server to Client!`);
    } else if (value && typeof value === "object" && value.constructor && value.constructor.name !== "Object" && !Array.isArray(value)) {
      issues.push(`💥 Prop "${key}" is a CLASS INSTANCE (${value.constructor.name}). Methods cannot be serialized!`);
    }
  }

  if (issues.length > 0) {
    console.error("[Serialization FAILED] The following props violated the RSC boundary:");
    issues.forEach((err) => console.error(" - " + err));
    return false;
  }

  console.log("✅ [Serialization SUCCESS] All props are safe to cross the network boundary!");
  return true;
}

console.log("Testing Safe Props:");
validateSerializationBoundary({
  userId: 101,
  username: "haris",
  roles: ["admin", "developer"],
});

console.log("\nTesting Invalid Props (Passing a function callback):");
validateSerializationBoundary({
  userId: 101,
  onUserDelete: () => console.log("Deleting user..."), // 💥 FAILS!
});


// ============================================================================
// SECTION 3: COMPOSITION GOLDEN RULES CHEAT SHEET
// ============================================================================
console.log("\n--- 3. COMPOSITION GOLDEN RULES CHEAT SHEET ---");

const compositionRules = [
  {
    Rule: "Client Component importing Server Component",
    Supported: "NO",
    Consequence: "Server component silently becomes a client component, bloating bundle.",
  },
  {
    Rule: "Server Component importing Client Component",
    Supported: "YES",
    Consequence: "Standard Next.js practice. Creates a clean client boundary.",
  },
  {
    Rule: "Passing Server Component as {children} to Client",
    Supported: "YES (Recommended)",
    Consequence: "Server component runs on server; Client component wraps it interactively.",
  },
  {
    Rule: "Passing functions from Server to Client",
    Supported: "NO",
    Consequence: "Throws serialization error. Use Server Actions instead!",
  },
];

console.table(compositionRules);

console.log("\nModule 15 loaded and executed successfully.");

