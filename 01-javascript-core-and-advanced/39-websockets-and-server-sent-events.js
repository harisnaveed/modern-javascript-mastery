/**
 * ============================================================================
 * MODULE 39: WebSockets, Server-Sent Events (SSE) & Real-Time Architectures
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL EVOLUTION
 * ----------------------------------------------------------------------------
 * Classic HTTP/1.1 is fundamentally "request-response" and client-driven:
 * the client asks, the server answers, and the connection closes. The server 
 * CANNOT initiate communication or push data when something changes.
 *
 * The Evolution of Real-Time Web:
 * 1. Short Polling (1990s-2000s): Client fires `fetch()` every 2 seconds. 
 *    💥 High latency, massive server CPU load, wastes bandwidth on empty responses.
 * 2. Long Polling (Comet / 2000s): Server holds the HTTP request open until data 
 *    arrives, sends response, client immediately opens a new request.
 * 3. WebSockets (2011 / RFC 6455): Persistent, full-duplex, bidirectional TCP 
 *    connection allowing both client and server to send messages at any instant.
 * 4. Server-Sent Events (SSE / HTML5): Unidirectional HTTP streaming protocol 
 *    (`text/event-stream`) specifically optimized for Server -> Client real-time 
 *    feeds (AI token streaming, live stock prices, notification alerts).
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In Traditional PHP:
 *   Because PHP terminates at the end of each HTTP request, holding open 10,000 
 *   persistent WebSocket connections was virtually impossible without external 
 *   services (Pusher, Ably) or Node.js companion servers (Socket.io).
 *   Recently, Laravel introduced "Laravel Reverb" (a persistent PHP daemon) to 
 *   mimic what Node.js has done natively for a decade!
 *
 * - In Node.js & Next.js:
 *   The event-driven, non-blocking architecture makes handling 100,000 concurrent 
 *   open connections natural.
 *   In Next.js App Router, streaming AI responses with SSE is as simple as 
 *   returning a `new Response(readableStream, { headers: { 'Content-Type': 'text/event-stream' } })`.
 *
 *
 * 3. SSE VS WEBSOCKETS: WHICH ONE TO CHOOSE?
 * ----------------------------------------------------------------------------
 * Use Server-Sent Events (SSE) when:
 * - Communication is strictly ONE-WAY from Server to Client (e.g. ChatGPT text 
 *   streaming, live dashboard charts, news tickers).
 * - You want automatic browser reconnection, HTTP/2 multiplexing, and simple proxy traversal.
 *
 * Use WebSockets when:
 * - Communication is BI-DIRECTIONAL (e.g. Multiplayer online games, Figma-style 
 *   collaborative whiteboards, customer support live chat).
 * ============================================================================
 */

const http = require("node:http");

console.log("==================================================================");
console.log("  MODULE 39: Server-Sent Events (SSE) & Real-Time Architectures");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: CREATING A REAL-TIME SSE (SERVER-SENT EVENTS) ENDPOINT
// ============================================================================
console.log("--- 1. CREATING AN SSE STREAMING SERVER ---");

/**
 * Standard SSE HTTP Header requirements:
 * - Content-Type: text/event-stream
 * - Cache-Control: no-cache
 * - Connection: keep-alive
 *
 * SSE Data Format:
 * data: <payload>\n\n
 */

const server = http.createServer((req, res) => {
  if (req.url === "/stream") {
    // Set headers for Server-Sent Events
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    });

    // Simulate streaming AI tokens or live telemetry data
    const tokens = ["Hello", " ", "developer!", " ", "This", " ", "is", " ", "real-time", " ", "SSE!"];
    let index = 0;

    const timer = setInterval(() => {
      if (index < tokens.length) {
        const payload = JSON.stringify({ token: tokens[index], index });
        // Format strictly as SSE message
        res.write(`data: ${payload}\n\n`);
        index++;
      } else {
        clearInterval(timer);
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    }, 20); // Fast interval for demonstration

    req.on("close", () => {
      clearInterval(timer);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Start temporary local server on ephemeral port
server.listen(0, () => {
  const port = server.address().port;
  console.log(`[SSE Server] Listening on http://localhost:${port}/stream`);

  // ==========================================================================
  // SECTION 2: CLIENT CONSUMING THE SSE STREAM
  // ==========================================================================
  console.log("\n--- 2. CLIENT CONSUMING STREAMING CHUNKS ---");

  http.get(`http://localhost:${port}/stream`, (response) => {
    let accumulatedText = "";

    response.setEncoding("utf8");

    response.on("data", (chunk) => {
      // Parse SSE lines
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const rawData = line.replace("data: ", "").trim();
          if (rawData === "[DONE]") {
            console.log("\n[Stream Complete] Server signaled end of stream.");
            continue;
          }
          try {
            const parsed = JSON.parse(rawData);
            accumulatedText += parsed.token;
            process.stdout.write(parsed.token);
          } catch {
            // Raw text chunk
          }
        }
      }
    });

    response.on("end", () => {
      console.log(`\n\nFull Accumulated Stream Result: "${accumulatedText}"`);

      // Clean up server
      server.close(() => {
        console.log("[SSE Server] Closed cleanly.");

        // ====================================================================
        // SECTION 3: REAL-TIME ARCHITECTURE DECISION MATRIX
        // ====================================================================
        console.log("\n--- 3. REAL-TIME ARCHITECTURE COMPARISON ---");

        const comparisonTable = [
          {
            Technology: "Short Polling",
            Direction: "Client -> Server (Repeated)",
            Protocol: "HTTP/1.1 or HTTP/2",
            BestFor: "Low-frequency checks (e.g. checking status once every 5 minutes)",
          },
          {
            Technology: "Server-Sent Events (SSE)",
            Direction: "Server -> Client (Unidirectional)",
            Protocol: "Standard HTTP (text/event-stream)",
            BestFor: "AI Chat streaming (ChatGPT, Claude, Gemini), Live stock tickers, Alerts",
          },
          {
            Technology: "WebSockets",
            Direction: "Bidirectional (Full Duplex)",
            Protocol: "ws:// or wss:// (TCP Handshake)",
            BestFor: "Collaborative editors (Figma, Google Docs), Multiplayer games, Live chat",
          },
        ];

        console.table(comparisonTable);
        console.log("\nModule 39 loaded and executed successfully.");
      });
    });
  });
});

