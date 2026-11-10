/**
 * ============================================================================
 * MODULE 34: Streams, Buffers & Next.js Streaming Architecture
 * Specification: Node.js Core / WHATWG Web Streams API
 * Target Environment: Node.js (v18+) / Next.js (App Router)
 * Prerequisite: Module 21 (Event Loop), Module 22 (Promises)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * What happens when you read a 2GB log file or process a 500MB CSV export using
 * standard methods like `fs.readFile()`?
 * 
 * V8 HEAP OUT-OF-MEMORY CRASH:
 * - V8's JavaScript heap has a default memory ceiling (~1.4GB to 2GB on 64-bit systems).
 * - Attempting to read a 2GB file into a single string causes:
 *     `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`
 * - The entire Node.js server crashes, taking down every active user session!
 * 
 * NEXT.JS STREAMING SSR:
 * - In traditional SSR, the server must wait for ALL database queries on the page
 *   to finish before sending any HTML to the browser (Time To First Byte is slow).
 * - Modern Next.js App Router uses **Streaming SSR**:
 *   It flushes the instant layout and skeleton UI immediately, and streams in
 *   slow components via chunked HTTP transfer as they finish resolving!
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, streams exist via `fopen('php://temp')` and output buffering (`ob_flush()`, `flush()`).
 * - In Node.js, **Streams** and **Buffers** are foundational primitives:
 *     - **Buffer**: Fixed-length sequences of raw binary bytes allocated in
 *       C++ memory outside the V8 heap.
 *     - **Stream**: Processing data chunk-by-chunk over time, enabling massive
 *       files to be handled with negligible RAM (e.g. 20MB of RAM for a 50GB video file!).
 *
 *
 * 3. THE 4 TYPES OF STREAMS
 * ----------------------------------------------------------------------------
 * 1. `Readable`: Data sources you read from (e.g., `fs.createReadStream`, `req`).
 * 2. `Writable`: Data destinations you write to (e.g., `fs.createWriteStream`, `res`).
 * 3. `Duplex`: Both readable and writable (e.g., TCP network sockets).
 * 4. `Transform`: A duplex stream that modifies data as it flows (e.g., Gzip compression).
 * 
 * THE GOLDEN RULE OF STREAMS: BACKPRESSURE
 * - If data is being read from a fast SSD faster than a slow network client can receive it,
 *   the system automatically pauses reading to avoid filling memory.
 * - Modern Node.js provides `stream.pipeline` (and `stream/promises`) to manage
 *   backpressure and error cleanup automatically!
 *
 *
 * 4. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - **Next.js Streaming with React Suspense**:
 *     <Suspense fallback={<Skeleton />}>
 *         <SlowDatabaseComponent />
 *     </Suspense>
 * - Direct S3 Cloud Storage Uploads without saving files to disk.
 * - Real-time CSV / Excel export generation for thousands of rows.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 34: Streams, Buffers & Next.js Streaming Architecture");
console.log("==================================================================\n");

const { Readable, Transform } = require("node:stream");
const { pipeline } = require("node:stream/promises");

// ----------------------------------------------------------------------------
// 1. BUFFERS: RAW BINARY MEMORY OUTSIDE THE V8 HEAP
// ----------------------------------------------------------------------------
console.log("--- 1. BUFFERS (RAW BINARY ALLOCATION) ---");

// Allocating a buffer from a UTF-8 string:
const textBuffer = Buffer.from("Hello Modern JavaScript!");
console.log("Raw Buffer (Hex Byte Array):", textBuffer);
console.log("Buffer Byte Length:         ", textBuffer.length); // 24 bytes

// Converting to base64 encoding (e.g. for image or auth headers):
const base64Encoded = textBuffer.toString("base64");
console.log("Base64 Encoded:             ", base64Encoded);

// Decoding base64 back to string:
const decodedString = Buffer.from(base64Encoded, "base64").toString("utf-8");
console.log("Decoded back to UTF-8:      ", decodedString);

console.log();

// ----------------------------------------------------------------------------
// 2. STREAMS: CHUNK-BY-CHUNK PROCESSING WITH ZERO RAM BLOAT
// ----------------------------------------------------------------------------
console.log("--- 2. STREAM PIPELINE (READABLE -> TRANSFORM -> CONSUMER) ---");

// Simulating a stream of database customer records (Readable Stream):
const customerRecords = [
    { id: 1, name: "Haris Ali", tier: "Gold" },
    { id: 2, name: "Ayesha Khan", tier: "Silver" },
    { id: 3, name: "Usman Tariq", tier: "Platinum" }
];

// Create a Readable stream emitting chunks:
const dataStream = Readable.from(customerRecords.map(rec => JSON.stringify(rec) + "\n"));

// Create a Transform stream (e.g. converting chunks to uppercase):
const uppercaseTransform = new Transform({
    transform(chunk, encoding, callback) {
        const transformedChunk = chunk.toString().toUpperCase();
        // Emit transformed piece:
        callback(null, transformedChunk);
    }
});

// Using modern stream/promises pipeline for error safety & backpressure:
async function runStreamPipeline() {
    console.log("[Pipeline Started] Streaming data through transform pipeline:");

    // We can iterate over the output stream using asynchronous iteration (for await...of):
    const processedChunks = [];
    dataStream.pipe(uppercaseTransform);

    for await (const chunk of uppercaseTransform) {
        processedChunks.push(chunk.toString().trim());
        console.log(" - Received Stream Chunk:", chunk.toString().trim());
    }

    console.log("[Pipeline Finished] Stream closed and memory released automatically.");
}

runStreamPipeline().then(() => {
    console.log();

    // ----------------------------------------------------------------------------
    // 3. NEXT.JS APP ROUTER STREAMING SSR EXPLANATION
    // ----------------------------------------------------------------------------
    console.log("--- 3. HOW NEXT.JS STREAMING SSR WORKS ---");
    console.log(`
    Next.js App Router HTTP Chunked Transfer Flow:
    
    1. User requests: GET /dashboard
    2. Server sends immediate HTTP 200 with HTML Shell (Header, Navigation, Sidebar)
       -> User sees instant UI (TTFB = 30ms)!
    3. <Suspense fallback={<CardSkeleton />}> shows skeleton loaders.
    4. Database query finishes in background after 200ms.
    5. Server streams final <Component /> HTML chunk down the SAME open connection!
    6. Browser receives chunk and swaps skeleton with final UI seamlessly.
    `);

    // ----------------------------------------------------------------------------
    // 4. SUMMARY CHEAT SHEET
    // ----------------------------------------------------------------------------
    console.log("--- 4. STREAMS & BUFFERS CHEAT SHEET ---");
    console.table([
        { Concept: "Buffer", Role: "Binary memory block outside V8 heap (Base64, Hex, Bytes)" },
        { Concept: "Readable Stream", Role: "Source of data chunks (files, network requests, databases)" },
        { Concept: "Writable Stream", Role: "Destination for data chunks (files, HTTP responses)" },
        { Concept: "Transform Stream", Role: "Modifies or compresses data while in transit (Gzip, Crypto)" },
        { Concept: "pipeline()", Role: "Safe chaining of streams with automatic backpressure and cleanup" },
        { Concept: "Streaming SSR", Role: "Next.js flushing HTML shell early and streaming components lazily" }
    ]);

    console.log("Module 34 loaded and executed successfully.\n");
});

