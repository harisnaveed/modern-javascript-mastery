# ⚡ Next.js Rendering Masterclass — Interactive Playground

Welcome to the **Interactive Next.js 15 & React 19 Playground**! This fullstack web application serves as the live, visual companion to the 24 conceptual modules located in [`../`](../).

Every single concept from the **Complete Guide to Rendering in React.js and Next.js** has an interactive, real-time page demonstrating its behavior in the browser.

---

## 🚀 Quick Start

From the repository root:
```powershell
npm.cmd run playground:dev
```

Or from inside this folder (`02-rendering-react-and-nextjs/playground`):
```powershell
npm.cmd run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🗺️ Route Directory & Concept Mapping

| # | Route | Corresponding Concept File | What You Can Inspect & Interact With |
|---|---|---|---|
| **01** | `/browser-pipeline` | `01-what-is-rendering-and-browser-pipeline.js` | Critical Rendering Path (Parse HTML &rarr; CSSOM &rarr; Layout &rarr; Paint &rarr; Composite). |
| **02** | `/real-dom` | `02-real-dom-and-dom-tree-architecture.js` | Benchmark DOM thrashing (300 forced reflows) vs DocumentFragments vs React state. |
| **03** | `/virtual-dom` | `03-virtual-dom-and-declarative-ui.js` | Side-by-side view of lightweight VDOM object nodes and minimal Real DOM patches. |
| **04** | `/render-and-commit` | `04-render-phase-vs-commit-phase.js` | 3-Phase Stepper proving re-rendering with identical values skips the DOM Commit phase. |
| **05** | `/reconciliation-keys` | `05-reconciliation-algorithm-and-keys.js` | Type notes in input fields and prepend items to watch `key={index}` corrupt state vs `key={id}`. |
| **06** | `/fiber-architecture` | `06-react-fiber-architecture-and-scheduling.js` | Inspect Fiber linked-list pointers (`child`, `sibling`, `return`) and test `useTransition`. |
| **07** | `/csr` | `07-client-side-rendering-csr.js` | Empty `<div id="root">` HTML shell, JS bundle loading, and client `useEffect` fetching. |
| **08** | `/ssr` | `08-server-side-rendering-ssr.js` | Request-time rendering with `cache: 'no-store'`, live timestamps, and 0 blank screen. |
| **09** | `/ssg` | `09-static-site-generation-ssg.js` | Pre-rendered static HTML built ahead of time with `generateStaticParams()` for 15ms CDN delivery. |
| **10** | `/isr` | `10-incremental-static-regeneration-isr.js` | 10s Stale-While-Revalidate countdown timer demonstrating background regeneration live. |
| **11** | `/comparison` | `11-rendering-strategies-comparison-matrix.js` | Interactive decision engine: select page requirements to calculate the optimal rendering mode. |
| **12** | `/hydration-lifecycle` | `12-hydration-and-hydration-lifecycle.js` | The "Uncanny Valley" simulator: test button clicks failing before hydration attaches listeners. |
| **13** | `/hydration-mismatch` | `13-hydration-mismatch-errors-and-fixes.js` | Toggle between broken non-deterministic output and the clean mounting flag fix. |
| **14** | `/server-vs-client` | `14-server-components-vs-client-components.js` | Server Component querying data with 0 KB bundle passing props to an interactive Client Component. |
| **15** | `/server-client-composition` | `15-server-and-client-composition-patterns.js` | The Children Slot Pattern: nest zero-bundle Server Components inside interactive Client wrappers. |
| **16** | `/rsc-payload` | `16-rsc-payload-internals.js` | Raw streaming wire protocol inspector (`1:I[...]`, `0:[...]`) showing state preservation during navigation. |
| **17** | `/streaming` | `17-streaming-ssr-and-react-suspense.js` | Instant shell delivery with skeleton loaders, followed by slow data streaming over HTTP. |
| **18** | `/partial-prerendering` | `18-partial-prerendering-ppr.js` | Instant static CDN shell served in 15ms while dynamic holes stream personalized data in parallel. |
| **19** | `/caching-layers` | `19-static-vs-dynamic-rendering-in-nextjs.js` | Interactive cache purger: test `revalidateTag()`, `router.refresh()`, and Request Memoization. |
| **20** | `/client-navigation` | `20-client-side-navigation-and-prefetching.js` | Soft `<Link>` prefetching vs hard `<a href>` reload showing form state survival across routes. |
| **21** | `/code-splitting` | `21-code-splitting-lazy-loading-and-selective-hydration.js` | Dynamically import heavy analytical charts on demand, saving 420 KB on initial page load. |
| **22** | `/ecommerce-architecture` | `22-real-world-ecommerce-rendering-architecture.js` | Multi-strategy blueprint: Home (SSG), PDP (ISR+PPR), Search (SSR), and Checkout (CSR). |
| **23** | `/interview-quiz` | `23-rendering-interview-puzzles-and-troubleshooting.js` | Interactive quiz with instant feedback and architectural explanations. |
| **24** | `/core-web-vitals` | `24-core-web-vitals-and-performance-optimization.js` | Live CWV lab: optimize LCP (`priority`), INP (`startTransition`), and CLS (`aspect-ratio`). |

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16.4.6 (App Router)
- **Runtime:** React 19 (Server & Client Components)
- **Bundler / Compiler:** Turbopack
- **Styling:** Custom CSS Design System with dark mode palette and responsive layout grid
- **Zero Config:** Runs out of the box with zero external backend or database setup required.

