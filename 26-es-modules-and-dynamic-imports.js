/**
 * ============================================================================
 * MODULE 26: ES Modules (ESM) & Dynamic Imports
 * Specification: ECMAScript 2015 (ES6) / ES2020 (Dynamic import)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 22 (Promises), Module 24 (Async/Await)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * A) The Script Tag Global Pollution Nightmare:
 *    - In early web development, every script was loaded via `<script src="...">`.
 *    - All variables lived on the global `window` object.
 *    - Scripts had to be arranged in strict manual order: if `app.js` loaded before
 *      `jquery.js`, the entire web app crashed!
 * 
 * B) CommonJS (CJS) vs ES Modules (ESM):
 *    - In 2009, Node.js created **CommonJS**:
 *        const express = require("express");
 *        module.exports = app;
 *    - CommonJS was synchronous and designed for local hard drives. It could NOT
 *      run natively in web browsers without bundlers (Browserify, Webpack).
 *    - Furthermore, because `require()` is dynamic, bundlers could NOT easily
 *      determine which functions were unused, making **Tree Shaking** (dead-code
 *      elimination) impossible!
 * 
 * ES6 standardized **ES Modules (ESM)** natively in the JavaScript specification:
 * - Static analysis at compile time (enabling 100% dead-code elimination / tree-shaking).
 * - Asynchronous loading friendly for network protocols (HTTP/2, CDNs).
 * - Standardized across both browsers and Node.js.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP:
 *     use App\Models\User;
 *     use App\Services\PaymentService as Payment;
 * - In JavaScript:
 *     import User from "./models/User.js";
 *     import { processPayment as payment } from "./services/PaymentService.js";
 *
 *
 * 3. NAMED EXPORTS VS DEFAULT EXPORTS
 * ----------------------------------------------------------------------------
 * - **Named Exports**:
 *   - Can have MULTIPLE named exports per file.
 *   - Must be imported using curly braces `{}` with the exact matching name
 *     (unless aliased with `as`).
 *   - Syntax: `export const add = (a, b) => a + b;`
 *   - Import: `import { add } from "./math.js";`
 * 
 * - **Default Export**:
 *   - Can have ONLY ONE default export per module.
 *   - Imported WITHOUT curly braces, and the importer can choose ANY variable name.
 *   - Syntax: `export default class AuthService { ... }`
 *   - Import: `import AuthService from "./auth.js";`
 *
 *
 * 4. DYNAMIC IMPORTS: import() (ES2020)
 * ----------------------------------------------------------------------------
 * Static `import ... from ...` statements MUST be placed at the top level of a file.
 * You CANNOT place a static import inside an `if` statement or function!
 * 
 * What if you want to load a heavy 5MB Charting library ONLY when the user clicks
 * the "Analytics" tab?
 * 
 * The Solution: **Dynamic Imports `import(modulePath)`**
 * - Returns a Promise that resolves to the module namespace.
 * - Can be called inside functions, conditional statements, or event handlers!
 * - The fundamental technology behind **Code Splitting** in React, Next.js, and Vite.
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React Lazy Loading with Suspense:
 *     const HeavyModal = React.lazy(() => import("./components/HeavyModal"));
 * - Next.js Dynamic Component Loading:
 *     import dynamic from "next/dynamic";
 *     const Chart = dynamic(() => import("./Chart"), { ssr: false });
 * - Tree Shaking: Importing only `{ map }` from `lodash-es` reduces bundle sizes by 90%!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 26: ES Modules (ESM) & Dynamic Imports");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. SIMULATING NAMED & DEFAULT EXPORT PATTERNS
// ----------------------------------------------------------------------------
console.log("--- 1. NAMED VS DEFAULT EXPORT MECHANICS ---");

// Simulated Math Module (Named Exports):
const MathModule = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b,
    PI: 3.14159
};

// Simulated Auth Service (Default Export):
class AuthenticationService {
    login(username) {
        return `[Auth] Session active for @${username}`;
    }
}

console.log("Simulating Named Import:      { add, multiply } from './math.js'");
console.log("MathModule.add(15, 25):      ", MathModule.add(15, 25));

console.log("Simulating Default Import:    AuthService from './auth.js'");
const auth = new AuthenticationService();
console.log(auth.login("haris_fullstack"));

console.log();

// ----------------------------------------------------------------------------
// 2. DYNAMIC IMPORT() IN ACTION (CODE SPLITTING SIMULATION)
// ----------------------------------------------------------------------------
console.log("--- 2. DYNAMIC IMPORT() (LAZY LOADING ON DEMAND) ---");

// Dynamic import can load modules conditionally or lazily inside functions:
async function loadAnalyticsDashboard(userRole) {
    console.log(`[Permission Check] User role is '${userRole}'...`);

    if (userRole !== "ADMIN") {
        console.log("[Access Denied] Analytics bundle was NOT downloaded. (Saved bandwidth!)");
        return;
    }

    console.log("[Downloading] Role approved. Loading analytics module dynamically via import()...");

    // In modern Node.js / Browsers, import() returns a Promise:
    // Here we dynamically import Node's native 'node:os' module on demand:
    const osModule = await import("node:os");

    console.log("[Module Loaded Successfully] System Platform:", osModule.platform());
    console.log("[Module Loaded Successfully] CPU Architecture:", osModule.arch());
}

async function runDynamicImportDemo() {
    await loadAnalyticsDashboard("VIEWER"); // Does not load module
    console.log();
    await loadAnalyticsDashboard("ADMIN");  // Loads module dynamically on demand!
}

runDynamicImportDemo().then(() => {
    console.log();

    // ----------------------------------------------------------------------------
    // 3. BARREL FILES (RE-EXPORTING)
    // ----------------------------------------------------------------------------
    console.log("--- 3. BARREL FILES & RE-EXPORTING ---");
    console.log("Pattern: Creating an index.js that re-exports entire component libraries:");
    console.log(`
    // components/index.js (The Barrel File)
    export { default as Button } from './Button.js';
    export { default as Modal }  from './Modal.js';
    export { default as Card }   from './Card.js';

    // In another file, cleanly import all with a single line:
    import { Button, Modal, Card } from './components';
    `);

    // ----------------------------------------------------------------------------
    // 4. COMMONJS VS ES MODULES MATRIX
    // ----------------------------------------------------------------------------
    console.log("--- 4. COMMONJS VS ES MODULES CHEAT SHEET ---");
    console.table([
        { Feature: "Syntax (Import)", CommonJS: "const x = require('x')", ESModules: "import x from 'x'" },
        { Feature: "Syntax (Export)", CommonJS: "module.exports = x",    ESModules: "export default x / export { x }" },
        { Feature: "Loading Timing",  CommonJS: "Synchronous (Runtime)",  ESModules: "Asynchronous (Compile/Parse time)" },
        { Feature: "Tree Shaking",    CommonJS: "Difficult / Impossible", ESModules: "Native (100% dead-code removal)" },
        { Feature: "Conditional",     CommonJS: "if (c) require('x')",    ESModules: "if (c) await import('x')" }
    ]);

    console.log("Module 26 loaded and executed successfully.\n");
});

