/**
 * ============================================================================
 * MODULE 32: Debouncing & Throttling (Rate Limiting Event Handlers)
 * Specification: Advanced Functional JavaScript / Event Optimization
 * Target Environment: Node.js (v18+) / React / Next.js / Modern Browsers
 * Prerequisite: Module 12 (Closures), Module 13 (HOFs), Module 21 (Event Loop)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * Certain events in the browser fire hundreds of times per second:
 *   - `window.addEventListener("resize", ...)`
 *   - `window.addEventListener("scroll", ...)`
 *   - `input.addEventListener("input", ...)` (as user types in a live search box)
 *   - `mousemove` / drag & drop events.
 * 
 * If you attach an expensive operation (e.g. firing an HTTP fetch request, recalculating
 * complex layout dimensions, or filtering 10,000 table rows) directly to these
 * high-frequency events:
 * 
 * A) Severe Performance Degradation (UI Janky Stuttering):
 *    - Firing 60 DOM updates per second blocks the Event Loop and drops frame
 *      rates from 60fps to 5fps.
 * 
 * B) Server Denial of Service (API Hammering):
 *    - In an autocomplete search box, typing "javascript" in 1 second would fire
 *      10 separate HTTP requests to your backend database!
 * 
 * The two essential techniques to control execution frequency are:
 *   1. **DEBOUNCE**: Postpones execution until the user STOPS firing the event
 *      for a specified quiet period (e.g., "Wait until user stops typing for 300ms").
 *   2. **THROTTLE**: Guarantees execution at most ONCE every X milliseconds
 *      (e.g., "Run at most once every 200ms while user is scrolling").
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP / Laravel, API rate limiting is handled on the server via Redis token
 *   buckets (`RateLimiter::attempt(...)` or `throttle:60,1`).
 * - In JavaScript, debouncing and throttling are client-side performance shields:
 *   they prevent the browser from wasting CPU cycles and stop the frontend from
 *   overwhelming the server with redundant requests.
 *
 *
 * 3. CORE MECHANICS & DIFFERENCES
 * ----------------------------------------------------------------------------
 * - **Debounce**:
 *   - Resets the countdown timer on EVERY trigger.
 *   - Best for: Search inputs, auto-saving drafts, window resize layout recalculations.
 *   - Analogy: An elevator waiting for people. Every time someone steps in, the
 *     door timer resets and waits another 5 seconds before closing.
 * 
 * - **Throttle**:
 *   - Executes once, then blocks execution until the cooldown period expires.
 *   - Best for: Infinite scroll, scroll-based animations, mouse movement tracking.
 *   - Analogy: A machine gun firing at a fixed firing rate, or a subway turnstile
 *     allowing one person through every 2 seconds.
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Stale Closures in React Debouncing
 *    - In React, if you declare `const debouncedSearch = debounce(searchFn, 300)`
 *      inside the component render body, A NEW DEBOUNCE FUNCTION IS RECREATED
 *      ON EVERY RENDER, completely resetting the timer and breaking debouncing!
 *    - Solution in React: Wrap the debounced function in `useCallback` or `useMemo`
 *      with proper dependencies, or store the timer in a `useRef`.
 * 
 * Gotcha 2: Immediate / Leading Edge Execution
 *    - Sometimes you want the function to execute immediately on the FIRST click
 *      (e.g. preventing double-submit button clicks), and then debounce subsequent clicks.
 * 
 * Gotcha 3: Providing a `cancel()` Cleanup Method
 *    - Always expose a `.cancel()` method to clear pending timers when a React
 *      component unmounts to prevent memory leaks!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Next.js Search Bar with Server Actions: Debouncing input before triggering
 *   server action URL parameter updates (`useRouter.push('?q=...')`).
 * - Auto-saving user forms to database without hammering the server.
 * - Window scroll position tracking in modern landing pages.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 32: Debouncing & Throttling");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. PROFESSIONAL DEBOUNCE IMPLEMENTATION (WITH CANCELLATION)
// ----------------------------------------------------------------------------
console.log("--- 1. DEBOUNCE: DELAYING EXECUTION UNTIL ACTIVITY STOPS ---");

function debounce(fn, delayMs, immediate = false) {
    let timerId = null;

    // The wrapped debounced function:
    const debounced = function(...args) {
        const context = this;
        const callNow = immediate && !timerId;

        // Clear existing timer if triggered again during the quiet window:
        if (timerId) {
            clearTimeout(timerId);
        }

        // Schedule new execution after delayMs of silence:
        timerId = setTimeout(() => {
            timerId = null;
            if (!immediate) {
                fn.apply(context, args);
            }
        }, delayMs);

        // Immediate execution on leading edge if requested:
        if (callNow) {
            fn.apply(context, args);
        }
    };

    // Cancellation method (essential for React useEffect cleanup):
    debounced.cancel = function() {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
            console.log("[Debounce] Pending scheduled execution cancelled.");
        }
    };

    return debounced;
}

// Simulating search API:
const mockApiSearch = query => {
    console.log(`[API Fired] Executed backend search query for: '${query}'`);
};

const handleSearchInput = debounce(mockApiSearch, 50);

console.log("Simulating rapid user typing in search bar: 'r' -> 're' -> 'rea' -> 'react'");
handleSearchInput("r");
handleSearchInput("re");
handleSearchInput("rea");
handleSearchInput("react"); // ONLY this final call should fire after 50ms of quiet!

console.log();

// ----------------------------------------------------------------------------
// 2. PROFESSIONAL THROTTLE IMPLEMENTATION
// ----------------------------------------------------------------------------
console.log("--- 2. THROTTLE: ENFORCING MAXIMUM EXECUTION RATE ---");

function throttle(fn, limitMs) {
    let inThrottle = false;
    let lastArgs = null;
    let lastContext = null;

    return function(...args) {
        if (!inThrottle) {
            // Execute immediately on the first call:
            fn.apply(this, args);
            inThrottle = true;

            // Start cooldown period:
            setTimeout(() => {
                inThrottle = false;
                // If triggers occurred during throttle window, execute the trailing one:
                if (lastArgs) {
                    fn.apply(lastContext, lastArgs);
                    lastArgs = null;
                    lastContext = null;
                }
            }, limitMs);
        } else {
            // Save latest arguments to run on trailing edge:
            lastArgs = args;
            lastContext = this;
        }
    };
}

// Simulating window scroll listener:
let scrollEventCount = 0;
const handleScrollMetrics = scrollY => {
    scrollEventCount++;
    console.log(`[Throttle Triggered #${scrollEventCount}] Evaluated scroll position: ${scrollY}px`);
};

const throttledScroll = throttle(handleScrollMetrics, 40);

console.log("Simulating rapid scroll events fired 10 times in 20ms:");
for (let offset = 100; offset <= 1000; offset += 100) {
    throttledScroll(offset);
}

console.log();

// ----------------------------------------------------------------------------
// 3. REACT CUSTOM HOOK PATTERN (USEDEBOUNCE SIMULATION)
// ----------------------------------------------------------------------------
console.log("--- 3. REACT USEDEBOUNCE HOOK PATTERN ---");

/**
 * In React, you frequently want to debounce a state value rather than a function.
 * This simulates how `useDebounce(searchTerm, 300)` works:
 */
function simulateUseDebounce(initialValue, delayMs) {
    let debouncedValue = initialValue;
    let timer = null;

    return {
        update(newValue, onSettledCallback) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                debouncedValue = newValue;
                onSettledCallback(debouncedValue);
            }, delayMs);
        }
    };
}

const searchDebouncer = simulateUseDebounce("", 60);

searchDebouncer.update("n", () => {});
searchDebouncer.update("ne", () => {});
searchDebouncer.update("next", () => {});
searchDebouncer.update("nextjs", (finalValue) => {
    console.log("[useDebounce settled] React state updated to:", finalValue);
});

console.log();

// ----------------------------------------------------------------------------
// 4. SUMMARY CHEAT SHEET
// ----------------------------------------------------------------------------
console.log("--- 4. DEBOUNCE VS THROTTLE DECISION MATRIX ---");
console.table([
    { Technique: "Debounce", BestFor: "Search inputs, form autosave, window resize", ExecutionPattern: "Waits until events STOP firing for X ms" },
    { Technique: "Throttle", BestFor: "Infinite scroll, mouse tracking, gaming controls", ExecutionPattern: "Executes at a steady interval (at most once every X ms)" },
    { Technique: "Leading Edge", BestFor: "Submit buttons, login buttons", ExecutionPattern: "Fires immediately on first trigger, blocks spam clicks" }
]);

console.log("Module 32 loaded and executed successfully.\n");

