/**
 * ============================================================================
 * MODULE 24: Core Web Vitals (LCP, INP, CLS) & Rendering Optimization
 * ============================================================================
 *
 * 1. THE "WHY" & GOOGLE'S CORE WEB VITALS (CWV)
 * ----------------------------------------------------------------------------
 * A website can have the cleanest code in the world, but if users experience lag, 
 * layout shifts, or slow loading, Google penalizes its search rankings and 
 * conversion rates drop by 40%+.
 *
 * Google defined the 3 Core Web Vitals as the gold standard for web performance:
 * 1. LCP (Largest Contentful Paint) -> How fast the main content becomes visible.
 * 2. INP (Interaction to Next Paint) -> How fast the page responds to user clicks/keys.
 * 3. CLS (Cumulative Layout Shift)  -> How visually stable the page is (no jumping content).
 *
 *
 * 2. HOW RENDERING STRATEGIES DIRECTLY IMPACT CORE WEB VITALS
 * ----------------------------------------------------------------------------
 * Rendering Strategy    LCP Impact       INP Impact       CLS Impact
 * ----------------------------------------------------------------------------
 * CSR (Vite / CRA)      POOR (1.8s-4s)   FAIR             GOOD (if skeletons used)
 * SSR (Request-time)    GOOD (0.8s-1.5s) GOOD             GOOD
 * SSG / ISR (CDN Edge)  EXCELLENT (<1s)  EXCELLENT        EXCELLENT
 * Streaming SSR (RSC)   EXCELLENT (<1s)  EXCELLENT        GOOD (with fixed skeletons)
 *
 *
 * 3. NEXT.JS BUILT-IN CORE WEB VITALS OPTIMIZATIONS
 * ----------------------------------------------------------------------------
 * 1. next/image: Automatically reserves width/height aspect ratio boxes to ELIMINATE 
 *    CLS (Cumulative Layout Shift), serves WebP/AVIF, and lazy loads off-screen images.
 * 2. next/font: Downloads Google Fonts at build time to eliminate FOIT (Flash of 
 *    Invisible Text) and FOUT (Flash of Unstyled Text).
 * 3. React 19 startTransition & Server Components: Eliminates long tasks on the main 
 *    thread, keeping INP under 100ms!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 24: Core Web Vitals & Rendering Performance");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING CORE WEB VITALS AUDIT ENGINE
// ============================================================================
console.log("--- 1. CORE WEB VITALS PERFORMANCE AUDIT SIMULATION ---");

function evaluateCoreWebVitals({ lcpSeconds, inpMilliseconds, clsScore }) {
  const audit = [];

  // 1. Evaluate LCP
  const lcpStatus = lcpSeconds <= 2.5 ? (lcpSeconds <= 1.2 ? "GOOD (FAST)" : "NEEDS IMPROVEMENT") : "POOR";
  audit.push({
    Metric: "LCP (Largest Contentful Paint)",
    Value: `${lcpSeconds}s`,
    Threshold: "< 2.5s (Target < 1.2s)",
    Rating: lcpStatus,
    Advice: lcpSeconds > 1.2 ? "Use SSG/ISR or Next.js <Image priority> tag for the hero element." : "Optimal loading speed!",
  });

  // 2. Evaluate INP
  const inpStatus = inpMilliseconds <= 200 ? (inpMilliseconds <= 100 ? "GOOD (RESPONSIVE)" : "NEEDS IMPROVEMENT") : "POOR";
  audit.push({
    Metric: "INP (Interaction to Next Paint)",
    Value: `${inpMilliseconds}ms`,
    Threshold: "< 200ms (Target < 100ms)",
    Rating: inpStatus,
    Advice: inpMilliseconds > 100 ? "Use Server Components (0 KB JS) and startTransition() for heavy updates." : "Buttery smooth responsiveness!",
  });

  // 3. Evaluate CLS
  const clsStatus = clsScore <= 0.1 ? (clsScore <= 0.05 ? "GOOD (STABLE)" : "NEEDS IMPROVEMENT") : "POOR";
  audit.push({
    Metric: "CLS (Cumulative Layout Shift)",
    Value: clsScore.toFixed(3),
    Threshold: "< 0.10 (Target < 0.05)",
    Rating: clsStatus,
    Advice: clsScore > 0.05 ? "Set explicit width/height on images and reserve fixed dimensions for ads." : "Zero visual jank!",
  });

  return audit;
}

const auditResult = evaluateCoreWebVitals({
  lcpSeconds: 0.95,
  inpMilliseconds: 65,
  clsScore: 0.012,
});

console.table(auditResult);


// ============================================================================
// SECTION 2: PRODUCTION OPTIMIZATION PATTERNS IN NEXT.JS
// ============================================================================
console.log("\n--- 2. PRODUCTION CORE WEB VITALS CODE PATTERNS ---");

const optimizationCodeSnippet = `
  // 1. ELIMINATE CLS WITH NEXT/IMAGE:
  import Image from "next/image";

  export function HeroBanner() {
    return (
      <Image
        src="/hero-banner.webp"
        alt="Summer Sale"
        width={1200}
        height={600}
        priority // Preloads LCP image immediately!
        className="w-full h-auto"
      />
    );
  }

  // 2. OPTIMIZE INP WITH REACT 19 TRANSITIONS:
  import { useTransition } from "react";

  export function SearchInput({ onSearch }) {
    const [isPending, startTransition] = useTransition();

    function handleChange(e) {
      const term = e.target.value;
      // Urgent update: Updates input immediately (0ms input lag!)
      // Non-urgent update: Defers expensive list re-render
      startTransition(() => {
        onSearch(term);
      });
    }

    return <input onChange={handleChange} placeholder="Search catalog..." />;
  }
`;

console.log(optimizationCodeSnippet.trim());

// ============================================================================
// SECTION 3: CWV METRICS THRESHOLDS CHEAT SHEET
// ============================================================================
console.log("\n--- 3. GOOGLE CORE WEB VITALS THRESHOLDS ---");

const cwvSummary = [
  { Metric: "LCP (Loading)", Good: "<= 2.5s", NeedsImprovement: "2.5s - 4.0s", Poor: "> 4.0s" },
  { Metric: "INP (Interactivity)", Good: "<= 200ms", NeedsImprovement: "200ms - 500ms", Poor: "> 500ms" },
  { Metric: "CLS (Visual Stability)", Good: "<= 0.1", NeedsImprovement: "0.1 - 0.25", Poor: "> 0.25" },
];

console.table(cwvSummary);
console.log("\nModule 24 loaded and executed successfully.");

