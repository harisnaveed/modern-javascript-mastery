/**
 * ============================================================================
 * MODULE 09: SSG — Static Site Generation
 * ============================================================================
 *
 * 1. THE "WHY" & CORE DEFINITION
 * ----------------------------------------------------------------------------
 * If your website has pages whose content rarely changes (e.g. `/about`, `/contact`, 
 * blog articles, documentation), executing React code on a server for EVERY single 
 * visitor (SSR) is a tremendous waste of CPU, memory, and money.
 *
 * Static Site Generation (SSG) compiles and generates HTML files AHEAD OF TIME 
 * during the application build step (`next build`).
 *
 * HOW SSG WORKS STEP-BY-STEP:
 * 1. Developer runs `next build`.
 * 2. Next.js queries databases or CMS APIs during the build.
 * 3. Next.js renders the React components into static `.html` files on disk.
 * 4. These static files are deployed to a Global Content Delivery Network (CDN).
 * 5. When a user requests `/about`, the nearest CDN edge node serves the file in 15ms!
 * 6. ZERO server-side computing occurs during the user's visit!
 *
 *
 * 2. PHP / WORDPRESS ANALOGY
 * ----------------------------------------------------------------------------
 * - In WordPress / PHP:
 *   WordPress typically executes 50+ MySQL queries on every page hit. To scale, 
 *   developers install caching plugins (like WP Super Cache or W3 Total Cache) 
 *   that capture the PHP output and save it as a static `.html` file on disk.
 *
 * - In Next.js:
 *   SSG is NOT an afterthought or third-party plugin; it is the DEFAULT mode 
 *   of the framework! If a route has no dynamic headers or cookies, Next.js 
 *   automatically pre-renders it as static HTML during compilation!
 *
 *
 * 3. DYNAMIC ROUTES WITH GENERATESTATICPARAMS()
 * ----------------------------------------------------------------------------
 * What if you have dynamic routes like `/blog/[slug]`?
 * In Next.js App Router, you export `generateStaticParams()`:
 * Next.js fetches all blog slugs at build time and statically pre-generates 
 * every single individual blog article!
 *
 *
 * 4. THE FATAL FLAW OF PURE SSG (STALENESS)
 * ----------------------------------------------------------------------------
 * What happens when an author edits a blog post or an ecommerce store owner 
 * changes a price from $799 to $899 in the database?
 * 💥 The statically generated HTML still says "$799"!
 * In pure SSG, the only way to update content is to trigger a complete re-build 
 * and re-deployment of the entire website.
 * This exact problem led to the invention of ISR (Incremental Static Regeneration)!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 09: SSG — Static Site Generation");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE "NEXT BUILD" SSG PIPELINE
// ============================================================================
console.log("--- 1. SIMULATING BUILD-TIME STATIC PRE-RENDERING ---");

async function simulateBuildStep() {
  console.log("[Build Step] Developer executes: npm run build");
  console.log("[Build Step] Next.js scanning routes for static export eligibility...");

  // Mock database records available at build time:
  const blogPosts = [
    { slug: "react-rendering-guide", title: "Complete Guide to Rendering" },
    { slug: "nextjs-app-router", title: "Mastering Next.js App Router" },
    { slug: "javascript-deep-dive", title: "Modern JavaScript Deep Dive" },
  ];

  console.log(`[Build Step] generateStaticParams() discovered ${blogPosts.length} static routes.`);

  const cdnStaticStorage = new Map();

  for (const post of blogPosts) {
    console.log(` - Prerendering /blog/${post.slug} -> Generating HTML on disk...`);
    const staticHtml = `<!DOCTYPE html><html><head><title>${post.title}</title></head><body><h1>${post.title}</h1></body></html>`;
    cdnStaticStorage.set(`/blog/${post.slug}`, staticHtml);
  }

  console.log("[Build Step] Build completed successfully! Generated static files deployed to CDN Edge.\n");
  return cdnStaticStorage;
}

simulateBuildStep().then((cdn) => {
  // ==========================================================================
  // SECTION 2: USER REQUESTING STATIC PAGE FROM CDN
  // ==========================================================================
  console.log("--- 2. USER VISITING STATIC PAGE (SERVED FROM CDN) ---");

  const requestedRoute = "/blog/react-rendering-guide";
  console.log(`[User Request] GET ${requestedRoute}`);

  const start = performance.now();
  const cachedHtml = cdn.get(requestedRoute);
  const end = performance.now();

  console.log(`[CDN Edge] Cache HIT! Served directly from edge cache in ${(end - start).toFixed(4)}ms:`);
  console.log(`[CDN Response] ${cachedHtml}`);
  console.log(`--> Server CPU usage: 0% | Database queries: 0\n`);

  // ==========================================================================
  // SECTION 3: NEXT.JS GENERATESTATICPARAMS CODE SNIPPET
  // ==========================================================================
  console.log("--- 3. NEXT.JS APP ROUTER SSG CODE PATTERN ---");

  const ssgCodeSnippet = `
  // app/blog/[slug]/page.jsx

  // 1. Tell Next.js which slugs to generate during build:
  export async function generateStaticParams() {
    const posts = await fetch("https://api.internal/blogs").then((r) => r.json());
    return posts.map((post) => ({ slug: post.slug }));
  }

  // 2. Fetch data with force-cache (default in SSG):
  export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = await fetch(\`https://api.internal/blogs/\${slug}\`, {
      cache: "force-cache", // SSG cache
    }).then((r) => r.json());

    return (
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    );
  }
  `;

  console.log(ssgCodeSnippet.trim());

  // ==========================================================================
  // SECTION 4: SSG SUMMARY MATRIX
  // ==========================================================================
  console.log("\n--- 4. SSG SUMMARY MATRIX ---");

  const ssgSummary = [
    {
      Metric: "When is HTML Generated?",
      Value: "During build time (`next build`).",
    },
    {
      Metric: "Delivery Mechanism",
      Value: "Global CDN Edge caching (Vercel, Cloudflare).",
    },
    {
      Metric: "Latency (TTFB)",
      Value: "Extremely fast (< 30ms globally).",
    },
    {
      Metric: "Database Load",
      Value: "Zero load during user visits.",
    },
    {
      Metric: "Major Drawback",
      Value: "Content is stale until the site is rebuilt.",
    },
  ];

  console.table(ssgSummary);
  console.log("\nModule 09 loaded and executed successfully.");
});

