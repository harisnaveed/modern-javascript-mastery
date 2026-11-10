/**
 * ============================================================================
 * MODULE 16: What is the React Server Component (RSC) Payload?
 * ============================================================================
 *
 * 1. THE "WHY" & THE MYSTERY OF NEXT.JS NETWORK TRAFFIC
 * ----------------------------------------------------------------------------
 * If you open Chrome DevTools Network tab on a Next.js App Router website and 
 * click a link, you will notice something fascinating:
 * Next.js does NOT request a `.html` file!
 * And it does NOT request a standard REST JSON endpoint!
 *
 * Instead, you see a request returning a unique stream with content resembling:
 *   0:{"name":"MacBook Pro","price":1999}
 *   1:I["./app/AddToCart.js",["client","chunk"],"default"]
 *   2:["$","div",null,{"children":[...]}]
 *
 * WHAT IS THIS?
 * This is the React Server Component (RSC) Payload.
 *
 *
 * 2. WHY NOT JUST SEND PLAIN HTML?
 * ----------------------------------------------------------------------------
 * Why doesn't the server just send standard HTML on link clicks?
 *
 * If the server sent plain HTML on client navigation:
 * 1. The browser would have to replace the document (Full Page Reload!).
 * 2. All client state would be WIPED OUT (e.g. playing audio, open dropdowns, 
 *    form inputs, scroll positions would be destroyed!).
 * 3. Client Components would have to unmount and remount from scratch.
 *
 * With the RSC Payload:
 * The client keeps the entire living DOM tree intact!
 * React takes the incoming RSC stream, performs Reconciliation (diffing), 
 * and surgically swaps ONLY the server-rendered elements without touching 
 * the existing client state!
 *
 *
 * 3. WHAT DOES THE RSC PAYLOAD CONTAIN?
 * ----------------------------------------------------------------------------
 * The RSC payload is a compact, serialized representation containing:
 * 1. Rendered Server Component Output: The final UI tree of Server Components.
 * 2. Client Component Placeholders (Module References): Pointers indicating WHERE 
 *    Client Components need to be rendered in the tree.
 * 3. Client Component Props: Any serializable data passed across the boundary.
 * 4. Suspense Fallback Markers: Information on which chunks are still pending.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 16: React Server Component (RSC) Payload Internals");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING RSC PAYLOAD SERIALIZATION ON THE SERVER
// ============================================================================
console.log("--- 1. GENERATING AN RSC PAYLOAD ON THE SERVER ---");

function generateRSCPayload(serverData, clientComponentRef) {
  console.log("[Server RSC Generator] Serializing component tree into RSC format...");

  // Simulated RSC Protocol representation:
  const lines = [
    // Line 1: Module reference definition for Client Component
    `M1:{"id":"${clientComponentRef.filePath}","chunks":["client-cart.js"],"name":"${clientComponentRef.exportName}"}`,
    
    // Line 2: Server component tree structure with $L1 referencing the client module
    `J0:["$","div",null,{"className":"product-view","children":[` +
      `["$","h1",null,{"children":"${serverData.name}"}],` +
      `["$","p",null,{"className":"price","children":"$${serverData.price}"}],` +
      `["$","$L1",null,{"productId":${serverData.id},"initialStock":${serverData.stock}}]` +
    `]}]`,
  ];

  return lines.join("\n");
}

const mockProduct = { id: 101, name: "iPad Pro M4", price: 1099, stock: 15 };
const mockClientRef = { filePath: "./components/AddToCart.jsx", exportName: "default" };

const rscPayloadStream = generateRSCPayload(mockProduct, mockClientRef);
console.log("Generated RSC Payload Stream (Sent over HTTP connection):");
console.log(rscPayloadStream);


// ============================================================================
// SECTION 2: CLIENT CONSUMING THE RSC PAYLOAD (SOFT NAVIGATION)
// ============================================================================
console.log("\n--- 2. CLIENT-SIDE CONSUMPTION WITHOUT FULL PAGE RELOAD ---");

function simulateClientRSCParser(payloadText) {
  console.log("[Client Router] Incoming RSC stream received on client-side navigation.");
  const lines = payloadText.split("\n");

  const moduleReferences = {};
  let rootTree = null;

  for (const line of lines) {
    if (line.startsWith("M1:")) {
      const meta = JSON.parse(line.replace("M1:", ""));
      console.log(` - Resolved Client Module Reference: ${meta.id} (Chunks: ${meta.chunks.join(", ")})`);
      moduleReferences["$L1"] = meta;
    } else if (line.startsWith("J0:")) {
      console.log(` - Reconstructed Virtual DOM tree from serialized J0 stream.`);
      rootTree = line.replace("J0:", "");
    }
  }

  console.log(" - Applying Reconciliation: Existing client state PRESERVED!");
  console.log(" - Zero browser white flashes. Fast, instant transition!");
}

simulateClientRSCParser(rscPayloadStream);


// ============================================================================
// SECTION 3: RSC PAYLOAD SUMMARY MATRIX
// ============================================================================
console.log("\n--- 3. RSC PAYLOAD CHEAT SHEET ---");

const rscSummary = [
  {
    Question: "What is it?",
    Answer: "A streamable, serialized text format describing the Server Component tree.",
  },
  {
    Question: "When is it generated?",
    Answer: "At build time (for static routes) or on every request (for dynamic routes).",
  },
  {
    Question: "Why not HTML on link clicks?",
    Answer: "HTML causes full-page reloads and wipes client state. RSC payload allows soft diffing.",
  },
  {
    Question: "Can you inspect it?",
    Answer: "Yes! In DevTools Network tab, inspect requests with the `?_rsc=...` query parameter.",
  },
];

console.table(rscSummary);

console.log("\nModule 16 loaded and executed successfully.");

