/**
 * ============================================================================
 * MODULE 20: Client-Side Navigation & Viewport Prefetching
 * ============================================================================
 *
 * 1. THE "WHY" & TRADITIONAL NAVIGATION PAIN
 * ----------------------------------------------------------------------------
 * In traditional multi-page web applications (standard PHP / HTML `<a href="...">`):
 * Clicking a link forces the browser to discard the entire existing webpage:
 * 1. The current DOM tree is completely destroyed.
 * 2. Any active client state (playing video, expanded sidebars, form inputs) is lost.
 * 3. The user sees a jarring blank white flash.
 * 4. The browser re-downloads, re-parses, and re-executes all stylesheets and scripts.
 *
 * THE REVOLUTION: SOFT CLIENT-SIDE NAVIGATION WITH <LINK>
 * Next.js replaces traditional navigation with soft client-side transitions:
 * - `<Link href="/products">Products</Link>`
 * - When clicked, Next.js prevents the browser reload (`e.preventDefault()`).
 * - Updates the URL with `history.pushState()`.
 * - Fetches only the changed RSC payload and reconciles it into the DOM!
 * - Shared layouts (like the main Navbar and Sidebar) NEVER re-render!
 *
 *
 * 2. WHAT IS PREFETCHING & HOW DOES IT WORK?
 * ----------------------------------------------------------------------------
 * Prefetching means loading the destination route's resources BEFORE the user 
 * actually clicks the link!
 *
 * In Next.js:
 * 1. An `<Link href="/pricing">` enters the user's viewport as they scroll.
 * 2. Next.js's internal `IntersectionObserver` detects the visible link.
 * 3. Next.js fires a low-priority background request to download the route's 
 *    RSC payload and client JS chunks.
 * 4. The data is stored in the browser's in-memory Router Cache.
 * 5. When the user finally clicks the link:
 *    💥 The transition is INSTANTANEOUS (0ms delay)! The data is already in RAM!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 20: Client-Side Navigation & Viewport Prefetching");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING VIEWPORT PREFETCHING & INSTANT NAVIGATION
// ============================================================================
console.log("--- 1. SIMULATING VIEWPORT PREFETCH & CLIENT-SIDE NAVIGATION ---");

class NextClientRouterSimulator {
  constructor() {
    this.currentUrl = "/";
    this.routerCache = new Map(); // In-memory client cache
    this.isNavbarMounted = true;
  }

  // 1. Link scrolls into view:
  onLinkVisibleInViewport(targetRoute) {
    console.log(`[Viewport Observer] <Link href="${targetRoute}"> entered visible screen area.`);
    console.log(`[Prefetch Engine] Pre-emptively downloading RSC payload for "${targetRoute}" in background...`);
    
    // Simulate prefetching payload into Router Cache:
    this.routerCache.set(targetRoute, {
      payload: `RSC_PAYLOAD_FOR_${targetRoute.toUpperCase()}`,
      prefetchedAt: Date.now(),
    });
    console.log(`[Prefetch Complete] "${targetRoute}" stored in Client Memory Cache.`);
  }

  // 2. User clicks the link:
  navigate(targetRoute) {
    console.log(`\n[User Click] Clicked link pointing to: "${targetRoute}"`);

    if (this.routerCache.has(targetRoute)) {
      const cached = this.routerCache.get(targetRoute);
      console.log(`⚡ [INSTANT TRANSITION] Cache HIT in Router Cache! Transitioning in 0ms!`);
      console.log(` - URL updated to: "${targetRoute}" (via window.history.pushState)`);
      console.log(` - Shared Navbar re-render: FALSE (Layout preserved intact!)`);
      console.log(` - Only page content slot replaced using ${cached.payload}`);
    } else {
      console.log(`⏳ [Cache MISS] Fetching RSC payload over network...`);
    }
    this.currentUrl = targetRoute;
  }
}

const router = new NextClientRouterSimulator();

// Step A: Link becomes visible as user scrolls down:
router.onLinkVisibleInViewport("/products/laptops");

// Step B: User clicks the link 2 seconds later:
router.navigate("/products/laptops");


// ============================================================================
// SECTION 2: NEXT.JS LINK PREFETCH OPTIONS
// ============================================================================
console.log("\n--- 2. NEXT.JS <LINK> PREFETCH MODES ---");

const prefetchCodeExamples = `
  import Link from "next/link";
  import { useRouter } from "next/navigation";

  export default function NavigationBar() {
    const router = useRouter();

    return (
      <nav>
        {/* 1. Default: Prefetches static routes when link enters viewport */}
        <Link href="/about">About Us</Link>

        {/* 2. Explicitly disable prefetch for rarely visited links: */}
        <Link href="/terms-of-service" prefetch={false}>
          Terms of Service
        </Link>

        {/* 3. Programmatic prefetch on hover: */}
        <button
          onMouseEnter={() => router.prefetch("/dashboard")}
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </button>
      </nav>
    );
  }
`;

console.log(prefetchCodeExamples.trim());


// ============================================================================
// SECTION 3: HARD VS SOFT NAVIGATION CHEAT SHEET
// ============================================================================
console.log("\n--- 3. HARD NAVIGATION VS SOFT CLIENT NAVIGATION ---");

const navigationComparison = [
  {
    Feature: "Browser Behavior",
    HardNavigation_A_Tag: "Destroys existing DOM, full document reload.",
    SoftNavigation_Next_Link: "Intercepts click, updates URL with pushState().",
  },
  {
    Feature: "Client State & Scroll",
    HardNavigation_A_Tag: "All React state, forms, and audio/video are wiped.",
    SoftNavigation_Next_Link: "Client state and scroll position are preserved.",
  },
  {
    Feature: "Shared Layouts",
    HardNavigation_A_Tag: "Navbar and Sidebar are completely re-rendered.",
    SoftNavigation_Next_Link: "Shared layouts stay mounted; only route page swaps.",
  },
  {
    Feature: "Prefetching Support",
    HardNavigation_A_Tag: "None (relies on browser speculative rules).",
    SoftNavigation_Next_Link: "Built-in viewport-based automatic prefetching.",
  },
];

console.table(navigationComparison);

console.log("\nModule 20 loaded and executed successfully.");

