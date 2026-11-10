/**
 * ============================================================================
 * MODULE 30: Modern JavaScript in Node.js & Next.js Fullstack Architecture
 * Specification: Node.js Runtime / Next.js App Router Paradigms
 * Target Environment: Node.js (v18+) / Next.js (App Router)
 * Prerequisite: Module 24 (Async/Await), Module 26 (ES Modules), Module 29 (React)
 * ============================================================================
 *
 * 1. THE "WHY" (CONNECTING JAVASCRIPT TO FULLSTACK MODERN ARCHITECTURE)
 * ----------------------------------------------------------------------------
 * Modern fullstack development has evolved beyond separating "frontend React"
 * and "backend PHP/Express" into completely separate codebases.
 * 
 * In Next.js (App Router) and modern Node.js, JavaScript executes across both
 * environments simultaneously in a unified mental model.
 * 
 * To write production-grade Next.js and Node.js applications, you must master
 * four core server-side JavaScript paradigms:
 *   1. The Server vs Client Boundary (`"use client"` vs Server Components).
 *   2. Server Actions & Mutations with Web API `FormData` (`"use server"`).
 *   3. The Asynchronous Middleware Pipeline Pattern.
 *   4. Node.js Event-Driven Architecture (`EventEmitter`).
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP / Laravel:
 *   - Controllers receive `Request $request`, execute database queries, and return Blade views.
 *   - Middleware filters incoming requests before they reach the controller.
 *   - Events & Listeners decouple tasks (e.g. sending welcome emails).
 * - In Next.js & Node.js:
 *   - **Server Components** act like Laravel Controllers: they fetch data on the
 *     server and render HTML before streaming it to the browser.
 *   - **Server Actions** act like POST controllers: they run securely on the server
 *     when a user submits a form or clicks a button.
 *   - **Express / Next.js Middleware** acts like Laravel HTTP Middleware.
 *   - **Node.js `EventEmitter`** acts like Laravel's Event Dispatcher.
 *
 *
 * 3. THE 4 FULLSTACK JAVASCRIPT PATTERNS
 * ----------------------------------------------------------------------------
 * 
 * 1. SERVER COMPONENTS (DEFAULT IN NEXT.JS APP ROUTER):
 *    - Pages and layouts are Server Components by default.
 *    - Can be written directly as `async function Page()`!
 *    - Database secrets, API keys, and heavy backend packages NEVER leak to the browser.
 *    - The Server-to-Client Boundary: Props passed from a Server Component to a
 *      Client Component (`"use client"`) MUST be JSON-serializable!
 * 
 * 2. SERVER ACTIONS (`"use server"`):
 *    - Functions that execute securely on the server, invokable directly from client UI.
 *    - Consumes standard Web API `FormData` objects: `formData.get("title")`.
 * 
 * 3. MIDDLEWARE PIPELINE PATTERN:
 *    - Chain of functions: `async (req, res, next) => { ... next(); }`.
 * 
 * 4. EVENT-DRIVEN PUB/SUB (`EventEmitter`):
 *    - Decoupling background tasks (analytics, email, audit logging).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 30: Modern JavaScript in Node.js & Next.js Architecture");
console.log("==================================================================\n");

// Import Node's native EventEmitter:
const EventEmitter = require("node:events");

// ----------------------------------------------------------------------------
// 1. SIMULATING NEXT.JS SERVER COMPONENTS (DIRECT ASYNC RENDERING)
// ----------------------------------------------------------------------------
console.log("--- 1. NEXT.JS SERVER COMPONENT SIMULATION ---");

// Simulated Database service:
async function dbQueryUsers() {
    return [
        { id: 101, username: "haris_dev", role: "Architect" },
        { id: 102, username: "ayesha_tech", role: "Lead Engineer" }
    ];
}

// In Next.js App Router, Server Components can be async functions:
async function UsersPage() {
    console.log("[Next.js Server Component] Fetching data directly on the server...");
    const users = await dbQueryUsers();

    // Returns rendered HTML stream (mocked as string):
    const htmlOutput = `
    <div class="users-dashboard">
        <h1>Team Roster (${users.length} members)</h1>
        <ul>
            ${users.map(u => `<li>@${u.username} — ${u.role}</li>`).join("")}
        </ul>
    </div>
    `.trim();

    return htmlOutput;
}

// Execute the server component:
UsersPage().then(renderedHtml => {
    console.log("[Server Component Output]:\n" + renderedHtml);
});

console.log();

// ----------------------------------------------------------------------------
// 2. SIMULATING NEXT.JS SERVER ACTIONS WITH FORMDATA
// ----------------------------------------------------------------------------
console.log("--- 2. NEXT.JS SERVER ACTION WITH FORMDATA ---");

// Simulated Web API FormData:
class MockFormData {
    constructor(entries) {
        this.data = new Map(Object.entries(entries));
    }
    get(key) {
        return this.data.get(key) ?? null;
    }
}

// In Next.js, Server Actions are marked with "use server":
async function createProductAction(formData) {
    "use server"; // Tells Next.js compiler this runs exclusively on server

    const title = formData.get("title");
    const price = Number(formData.get("price"));

    // Server-side validation:
    if (!title || price <= 0) {
        return { success: false, error: "Validation error: Title and positive price are required." };
    }

    console.log(`[Server Action Executed] Persisting product to database: '${title}' at $${price}`);
    return {
        success: true,
        productId: `PROD-${Date.now()}`,
        title,
        price
    };
}

// Client submits form:
const mockClientSubmission = new MockFormData({
    title: "Mechanical Keyboard RGB",
    price: "149.99"
});

createProductAction(mockClientSubmission).then(result => {
    console.log("[Server Action Response to Client]:", result);
});

console.log();

// ----------------------------------------------------------------------------
// 3. NODE.JS EXPRESS-STYLE MIDDLEWARE PIPELINE PATTERN
// ----------------------------------------------------------------------------
console.log("--- 3. ASYNC MIDDLEWARE PIPELINE PATTERN ---");

class MiddlewarePipeline {
    constructor() {
        this.middlewares = [];
    }

    use(middlewareFn) {
        this.middlewares.push(middlewareFn);
        return this;
    }

    // Executes middlewares in sequence, passing req and next:
    async execute(req, res) {
        let index = 0;

        const next = async (error) => {
            if (error) {
                console.error("[Middleware Error Caught]:", error.message);
                return;
            }
            if (index < this.middlewares.length) {
                const currentMiddleware = this.middlewares[index++];
                await currentMiddleware(req, res, next);
            }
        };

        await next();
    }
}

// Instantiate pipeline:
const app = new MiddlewarePipeline();

// Middleware 1: Request Logger
app.use(async (req, res, next) => {
    req.timestamp = new Date().toISOString().slice(11, 19);
    console.log(`[Middleware: Logger] [${req.timestamp}] Incoming ${req.method} ${req.url}`);
    await next(); // Pass to next middleware
});

// Middleware 2: Authentication Guard
app.use(async (req, res, next) => {
    console.log("[Middleware: Auth] Validating Authorization header...");
    if (!req.headers.authorization) {
        return next(new Error("Unauthorized! Missing Bearer token."));
    }
    req.user = { id: 101, username: "haris_dev" }; // Attach user to request
    await next();
});

// Middleware 3: Route Handler Controller
app.use(async (req, res, next) => {
    console.log(`[Controller Handler] Request processed successfully for user @${req.user.username}`);
});

// Trigger pipeline with valid request:
const mockRequest = {
    method: "POST",
    url: "/api/checkout",
    headers: { authorization: "Bearer secret_jwt_token_123" }
};
app.execute(mockRequest, {});

console.log();

// ----------------------------------------------------------------------------
// 4. NODE.JS EVENT-DRIVEN ARCHITECTURE (EVENTEMITTER)
// ----------------------------------------------------------------------------
console.log("--- 4. EVENT-DRIVEN PUB/SUB ARCHITECTURE (EVENTEMITTER) ---");

class OrderService extends EventEmitter {
    placeOrder(orderId, customerEmail, amount) {
        console.log(`[OrderService] Order #${orderId} for $${amount} created successfully.`);

        // Emit decoupled events to any registered subscribers:
        this.emit("order:created", { orderId, customerEmail, amount });
    }
}

const orderService = new OrderService();

// Subscriber 1: Email Notification Service
orderService.on("order:created", (payload) => {
    console.log(` -> [Email Worker] Sent confirmation receipt to ${payload.customerEmail} for Order #${payload.orderId}`);
});

// Subscriber 2: Analytics & Metric Service
orderService.on("order:created", (payload) => {
    console.log(` -> [Analytics Worker] Tracked revenue +$${payload.amount} in data warehouse.`);
});

// Trigger order creation (both independent listeners fire automatically):
orderService.placeOrder("ORD-5501", "haris@dev.com", 299.99);

console.log();

// ----------------------------------------------------------------------------
// 5. SUMMARY CHEAT SHEET
// ----------------------------------------------------------------------------
console.log("--- 5. FULLSTACK ARCHITECTURE CHEAT SHEET ---");
console.table([
    { Paradigm: "Server Components", Context: "Next.js App Router", Benefit: "Direct DB queries on server, zero client bundle cost" },
    { Paradigm: "Server Actions", Context: "Next.js / React 19", Benefit: "Type-safe server mutations without building REST API routes" },
    { Paradigm: "Middleware Chain", Context: "Express / Next.js", Benefit: "Composable request processing pipeline with next()" },
    { Paradigm: "EventEmitter", Context: "Node.js Backend", Benefit: "Decoupled asynchronous event-driven microservices" }
]);

console.log("Module 30 loaded and executed successfully.\n");

