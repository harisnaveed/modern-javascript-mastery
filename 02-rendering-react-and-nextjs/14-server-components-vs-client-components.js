/**
 * ============================================================================
 * MODULE 14: Server Components vs Client Components in Next.js
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL BACKGROUND
 * ----------------------------------------------------------------------------
 * In traditional React (CRA / Pages Router), every single component you wrote 
 * was bundled and shipped to the user's browser as JavaScript.
 *
 * THE PROBLEM:
 * If you imported a 60 KB date-formatting library (`moment.js`) or a 45 KB 
 * Markdown parser (`marked`) just to render a blog post:
 * 💥 The user had to download all 105 KB of JavaScript, parse it, and execute 
 * it in their browser, even though the blog post was completely static text!
 *
 * THE REVOLUTION: REACT SERVER COMPONENTS (RSC)
 * In the Next.js App Router, React introduced a fundamental architectural split:
 * 1. Server Components (RSC): Default in App Router. Run ONLY on the server.
 * 2. Client Components: Declared with `"use client"`. Run on server AND client.
 *
 *
 * 2. SERVER COMPONENTS: ZERO BUNDLE SIZE
 * ----------------------------------------------------------------------------
 * Server Components can:
 * - Direct Database Queries: `const users = await db.user.findMany();`
 * - Read Server Files: `const file = fs.readFileSync('data.json');`
 * - Keep Secrets Safe: Access private API keys without exposing them to the client.
 * - Zero Client JavaScript: Component source code and heavy dependencies are 
 *   NEVER sent to the browser! Only the rendered HTML is sent!
 *
 *
 * 3. CLIENT COMPONENTS: INTERACTIVITY & BROWSER APIS
 * ----------------------------------------------------------------------------
 * When do you add `"use client"`?
 * Add `"use client"` ONLY when a component needs:
 * 1. State: `useState()`, `useReducer()`.
 * 2. Effects: `useEffect()`, `useLayoutEffect()`.
 * 3. Event Listeners: `onClick`, `onChange`, `onSubmit`.
 * 4. Browser APIs: `window`, `localStorage`, `document.title`.
 *
 *
 * 4. THE COMMON MISCONCEPTION: "DO CLIENT COMPONENTS RUN ONLY ON THE CLIENT?"
 * ----------------------------------------------------------------------------
 * ❌ WRONG: "Client Components only execute in the browser."
 * ✅ TRUTH: Client Components STILL pre-render into HTML on the server!
 *
 * On initial page load, Next.js executes Client Components on the server to 
 * produce initial HTML so the user doesn't see a blank screen. Then, in the 
 * browser, React hydrates the Client Component to make it interactive!
 * "use client" designates a boundary between Server and Client module graphs.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 14: Server Components vs Client Components");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE SERVER VS CLIENT COMPONENT WORKFLOW
// ============================================================================
console.log("--- 1. SIMULATING SERVER & CLIENT COMPONENT COOPERATION ---");

// A. SIMULATED SERVER COMPONENT (Runs on Node.js Server)
async function ProductDetailsServerComponent(productId) {
  console.log(`[Server Component] Executing on Server for product ID: ${productId}`);
  console.log(` - Querying PostgreSQL database directly (Zero client API calls needed)...`);
  
  // Direct database query:
  const product = {
    id: productId,
    name: "MacBook Pro M4",
    price: 1999,
    description: "Ultra-fast Apple Silicon for developers.",
  };

  console.log(` - Heavy Markdown parser used on server (0 KB shipped to client)!`);
  
  // Render HTML on server:
  const serverHTML = `
  <div class="product-card">
    <h1>${product.name}</h1>
    <p>${product.description}</p>
    <p class="price">$${product.price}</p>
    <!-- Boundary to Client Component -->
    <div id="add-to-cart-client-slot"></div>
  </div>
  `.trim();

  return { serverHTML, product };
}

// B. SIMULATED CLIENT COMPONENT (Runs on Client for Interactivity)
function AddToCartClientComponent(productId, initialQuantity = 1) {
  console.log(`\n[Client Component] "use client" boundary reached!`);
  console.log(` - Ships minimal JS bundle to browser for interactive button & state.`);
  console.log(` - Initializing client state: useState(${initialQuantity})`);
  console.log(` - Binding onClick handler for cart checkout.`);
  
  return `<button onclick="handleAddToCart(${productId})">Add to Cart</button>`;
}

async function renderPage() {
  const { serverHTML, product } = await ProductDetailsServerComponent(42);
  const clientHTML = AddToCartClientComponent(product.id);

  const completePage = serverHTML.replace('<div id="add-to-cart-client-slot"></div>', clientHTML);
  console.log("\nFinal Page HTML produced seamlessly by combining Server & Client:");
  console.log(completePage);
}

renderPage().then(() => {
  // ==========================================================================
  // SECTION 2: SERVER VS CLIENT COMPONENT COMPARISON TABLE
  // ==========================================================================
  console.log("\n--- 2. SERVER VS CLIENT COMPONENT FEATURE MATRIX ---");

  const componentMatrix = [
    {
      Feature: "Default in Next.js App Router?",
      ServerComponent: "YES",
      ClientComponent: "NO (Must write 'use client')",
    },
    {
      Feature: "Shipped in Client JS Bundle?",
      ServerComponent: "ZERO BYTES (0 KB)",
      ClientComponent: "YES (Component JS shipped)",
    },
    {
      Feature: "Direct Database / Filesystem Access?",
      ServerComponent: "YES (Safe & direct)",
      ClientComponent: "NO (Must use API route / Server Action)",
    },
    {
      Feature: "Supports useState & useEffect?",
      ServerComponent: "NO",
      ClientComponent: "YES",
    },
    {
      Feature: "Supports onClick & event listeners?",
      ServerComponent: "NO",
      ClientComponent: "YES",
    },
    {
      Feature: "Pre-renders HTML on Server?",
      ServerComponent: "YES",
      ClientComponent: "YES (Pre-renders initial HTML!)",
    },
  ];

  console.table(componentMatrix);
  console.log("\nModule 14 loaded and executed successfully.");
});

