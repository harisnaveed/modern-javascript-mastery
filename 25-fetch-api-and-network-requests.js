/**
 * ============================================================================
 * MODULE 25: Fetch API & Network Requests (with AbortController)
 * Specification: WHATWG Fetch Standard / ECMAScript Runtime (Node.js 18+)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 22 (Promises), Module 24 (Async/Await)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * Prior to `fetch()`, making network requests in JavaScript was notoriously painful:
 * 
 * A) The Browser XMLHTTPRequest (XHR) Nightmare:
 *    - To make a simple GET request in ES5, developers wrote 15 lines of boilerplate:
 *        var xhr = new XMLHttpRequest();
 *        xhr.open("GET", "/api/data", true);
 *        xhr.onreadystatechange = function() {
 *            if (xhr.readyState === 4 && xhr.status === 200) { ... }
 *        };
 *        xhr.send();
 *    - No native Promise support (callbacks only).
 * 
 * B) The Node.js Fragmentation:
 *    - Node.js historically lacked ANY native global fetch API!
 *    - Developers were forced to install heavy third-party packages (`request`,
 *      `axios`, `node-fetch`) just to make a standard HTTP call.
 * 
 * `fetch()` is now a native, universal global standard built into ALL modern
 * browsers AND Node.js (v18+).
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, HTTP requests are usually made with `file_get_contents($url)` or
 *   cURL (`curl_exec()`) or Guzzle.
 * - In JavaScript, `fetch()` is completely non-blocking, asynchronous, and
 *   returns a Promise resolving to a **Response Stream**.
 *
 *
 * 3. THE #1 CRITICAL FETCH GOTCHA: REJECTIONS VS HTTP ERRORS
 * ----------------------------------------------------------------------------
 * **`fetch()` DOES NOT REJECT ON HTTP 404 OR 500 ERRORS!**
 * 
 * Unlike libraries like Axios:
 * - A Promise returned by `fetch()` rejects ONLY if there is a literal network
 *   failure (e.g. computer is offline, DNS lookup failed, CORS blocked).
 * - If the server responds with a `404 Not Found` or `500 Internal Server Error`,
 *   the Promise still resolves SUCCESSFULLY!
 * - YOU MUST ALWAYS CHECK `response.ok` (which is true only for 200-299 status codes)!
 *
 *
 * 4. REQUEST CANCELLATION VIA ABORTCONTROLLER
 * ----------------------------------------------------------------------------
 * How do you cancel an ongoing HTTP request?
 * Example: The user types in a live search box ("a" -> "ap" -> "app" -> "apple").
 * If the user types quickly, the request for "app" might arrive AFTER "apple",
 * displaying stale, incorrect search results (a classic Race Condition).
 * 
 * The Solution: **`AbortController`**
 * - Create a controller: `const controller = new AbortController();`
 * - Pass its signal to fetch: `fetch(url, { signal: controller.signal })`
 * - Cancel anytime: `controller.abort()`
 * - In modern JS, you can also use `AbortSignal.timeout(ms)` for native auto-timeouts!
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React `useEffect` Cleanup:
 *     useEffect(() => {
 *         const controller = new AbortController();
 *         fetchData(controller.signal);
 *         return () => controller.abort(); // Cancels request if component unmounts!
 *     }, []);
 * - Next.js App Router Data Fetching:
 *     fetch("https://api...", { next: { revalidate: 3600 } })
 * - Consuming external REST APIs in Node.js backend microservices.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 25: Fetch API & Network Requests");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. STANDARD GET REQUEST WITH DEFENSIVE ERROR CHECKING
// ----------------------------------------------------------------------------
console.log("--- 1. STANDARD GET REQUEST WITH RESPONSE.OK CHECK ---");

async function fetchPost(postId) {
    try {
        console.log(`[HTTP GET] Fetching post #${postId} from JSONPlaceholder API...`);
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);

        // THE ESSENTIAL CHECK: Never assume response is successful without checking .ok:
        if (!response.ok) {
            throw new Error(`HTTP Request Failed with status: ${response.status} (${response.statusText})`);
        }

        // Parse response stream as JSON:
        const postData = await response.json();
        console.log("[HTTP 200 OK] Received Post Title:", postData.title);
        return postData;
    } catch (error) {
        console.error("[Fetch Error]:", error.message);
    }
}

// ----------------------------------------------------------------------------
// 2. STANDARD POST REQUEST (CREATING A RESOURCE)
// ----------------------------------------------------------------------------
console.log("--- 2. POST REQUEST (HEADERS & BODY SERIALIZATION) ---");

async function createNewPost(newPostData) {
    try {
        console.log("[HTTP POST] Sending payload to API...");
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json"
            },
            body: JSON.stringify(newPostData) // Always serialize body!
        });

        if (!response.ok) {
            throw new Error(`Creation failed: ${response.status}`);
        }

        const createdRecord = await response.json();
        console.log("[HTTP 201 Created] Server response record:", createdRecord);
        return createdRecord;
    } catch (error) {
        console.error("[Post Error]:", error.message);
    }
}

// ----------------------------------------------------------------------------
// 3. REQUEST CANCELLATION VIA ABORTCONTROLLER
// ----------------------------------------------------------------------------
console.log("--- 3. REQUEST CANCELLATION (ABORTCONTROLLER) ---");

async function demonstrateAbortController() {
    const controller = new AbortController();

    // Schedule abort after 10ms (simulating fast user cancellation):
    setTimeout(() => {
        console.log("[Action] Aborting request via controller.abort()...");
        controller.abort();
    }, 10);

    try {
        console.log("[HTTP] Starting cancellable request...");
        const response = await fetch("https://jsonplaceholder.typicode.com/photos", {
            signal: controller.signal // Link abort signal to fetch!
        });
        const data = await response.json();
        console.log("Received data count:", data.length);
    } catch (error) {
        // Checking if failure was an intentional cancellation:
        if (error.name === "AbortError") {
            console.log("[Clean Cancellation] Request was successfully aborted by user!");
        } else {
            console.error("Different network error:", error.message);
        }
    }
}

// ----------------------------------------------------------------------------
// 4. MODERN NATIVE TIMEOUTS WITH ABORTSIGNAL.TIMEOUT()
// ----------------------------------------------------------------------------
console.log("--- 4. NATIVE TIMEOUTS (ABORTSIGNAL.TIMEOUT) ---");

async function fetchWithNativeTimeout() {
    try {
        console.log("[HTTP] Requesting with strict 5000ms timeout signal...");
        const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
            // Native built-in timeout signal (no manual setTimeout needed!):
            signal: AbortSignal.timeout(5000)
        });

        const todo = await response.json();
        console.log("[Timeout Test] Successfully loaded within deadline:", todo.title);
    } catch (error) {
        if (error.name === "TimeoutError") {
            console.error("[Timeout Expired] Request cancelled because server exceeded 5000ms!");
        } else {
            console.error("Request failed:", error.message);
        }
    }
}

// ----------------------------------------------------------------------------
// 5. RUNNING THE SUITE SEQUENTIALLY
// ----------------------------------------------------------------------------
async function runNetworkSuite() {
    await fetchPost(1);
    await createNewPost({
        title: "Modern JavaScript (ES6+) Guide",
        body: "Fullstack concepts for React, Next.js and Node.js",
        userId: 101
    });
    await demonstrateAbortController();
    await fetchWithNativeTimeout();

    console.log("\n--- 5. FETCH API CHEAT SHEET ---");
    console.table([
        { Feature: "fetch(url, options)", Purpose: "Standard native HTTP request returning a Promise" },
        { Feature: "response.ok", Purpose: "MUST check! True only for 200-299 HTTP status codes" },
        { Feature: "response.json()", Purpose: "Reads and parses response stream as JSON (can only read once)" },
        { Feature: "AbortController", Purpose: "Cancels active network requests to eliminate race conditions" },
        { Feature: "AbortSignal.timeout(ms)", Purpose: "Native automatic timeout signal for network calls" }
    ]);

    console.log("Module 25 loaded and executed successfully.\n");
}

runNetworkSuite();

