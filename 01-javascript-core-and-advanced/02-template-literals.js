/**
 * ============================================================================
 * MODULE 02: Template Literals & String Interpolation
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 01 (Variable Declarations)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript (ES5 and earlier), strings were defined only with single
 * quotes ('...') or double quotes ("..."). There was no native string interpolation.
 * 
 * This caused several headaches:
 * 
 * A) Verbose & Fragile String Concatenation:
 *    - Developers had to constantly open and close quotes and chain plus (`+`)
 *      operators: "Hello " + firstName + " " + lastName + ", you have " + unreadCount + " messages."
 *    - Missed spaces or misaligned quotation marks were among the most frequent
 *      formatting bugs in early web development.
 * 
 * B) Multiline String Nightmare:
 *    - In ES5, a string literal could not span multiple lines without:
 *      1. Concatenating strings with `+ '\n'` at every single line.
 *      2. Or escaping newlines with a trailing backslash (`\`), which broke
 *         silently if any developer accidentally left a space after the backslash!
 * 
 * C) Cumbersome HTML & Dynamic Templating:
 *    - Building HTML snippets, email templates, or dynamic API endpoints was
 *      notoriously messy, leading developers to rely on heavy external templating
 *      engines (Handlebars, Mustache, Jade/Pug) for simple string assembly.
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, double-quoted strings natively interpolate variables:
 *     $message = "Hello $name, your role is {$user->role}";
 * - PHP also supports Heredoc syntax (`<<<HTML ... HTML;`) for multiline markup.
 * - Prior to ES6, JavaScript developers coming from PHP were shocked that JS
 *   did not have variable interpolation.
 * - ES6 Template Literals with backticks bring PHP-like string interpolation
 *   to JavaScript, and go a step further: inside `${...}` in JS, you can run
 *   ANY arbitrary JavaScript expression, including function calls and nested templates.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION (ES6: Template Literals)
 * ----------------------------------------------------------------------------
 * Defined using backticks (`` `...` ``) instead of single or double quotes:
 * 1. Expression Interpolation: `${expression}` executes any JS expression directly.
 * 2. Native Multiline Strings: Line breaks in your code become line breaks in the string.
 * 3. Tagged Template Literals: You can prefix a template literal with a function
 *    name to parse and sanitize the string (the foundation of styled-components and SQL builders).
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Multiline Strings Preserve Exact Indentation & Spaces
 *    - If you indent a multiline template literal inside an indented function,
 *      those leading spaces will be present in the output string!
 *    - Use `.trim()` or helper utilities if indentation needs to be stripped.
 * 
 * Gotcha 2: Nested Template Literals
 *    - You can nest backticks inside `${...}` expressions. This is very clean
 *      for conditional strings (e.g., ternaries).
 * 
 * Gotcha 3: Tagged Templates & `String.raw`
 *    - Tagged templates give you direct programmatic access to the string chunks
 *      and interpolated values before the final string is assembled.
 *    - `String.raw` ignores escape sequences (e.g., Windows paths like `C:\Users\name`).
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - Next.js dynamic routing & API calls:
 *     fetch(`/api/users/${userId}/orders?status=${filter}`)
 * - React dynamic className management (e.g., with Tailwind CSS):
 *     <div className={`card p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}>
 * - Tagged Templates in styled-components or emotion:
 *     const Button = styled.button`color: ${props => props.color};`;
 * - Safe SQL / ORM Queries (e.g., Prisma / sql-template-strings):
 *     Prevents SQL injection by parameterizing expressions.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 02: Template Literals & String Interpolation");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. OLD JAVASCRIPT VS MODERN JAVASCRIPT
// ----------------------------------------------------------------------------
console.log("--- 1. OLD CONCATENATION VS MODERN TEMPLATE LITERALS ---");

const user = {
    firstName: "Haris",
    lastName: "Ali",
    age: 25,
    role: "Fullstack Engineer",
    city: "Wah Cantt",
    country: "Pakistan"
};

// The Old ES5 way:
var oldGreeting = "Hello, my name is " + user.firstName + " " + user.lastName + 
                  ". I am " + user.age + " years old from " + user.city + ", " + user.country + ".";
console.log("Old ES5 way:\n", oldGreeting);

// The Modern ES6 way:
const modernGreeting = `Hello, my name is ${user.firstName} ${user.lastName}. I am ${user.age} years old from ${user.city}, ${user.country}.`;
console.log("\nModern ES6 way:\n", modernGreeting);

console.log();

// ----------------------------------------------------------------------------
// 2. EMBEDDING ARBITRARY JAVASCRIPT EXPRESSIONS
// ----------------------------------------------------------------------------
console.log("--- 2. EMBEDDING ARBITRARY EXPRESSIONS ---");

const price = 250;
const quantity = 3;
const taxRate = 0.05; // 5%

// You can perform math, calculations, and format numbers right inside ${}:
console.log(`Subtotal: $${price * quantity}`);
console.log(`Total (with tax): $${((price * quantity) * (1 + taxRate)).toFixed(2)}`);

// You can call functions inside ${}:
function formatRole(role) {
    return role.toUpperCase();
}
console.log(`Developer role: ${formatRole(user.role)}`);

// Ternary conditional logic inside ${}:
const isMember = true;
console.log(`Shipping cost: ${isMember ? "$0.00 (Free for members)" : "$15.00"}`);

console.log();

// ----------------------------------------------------------------------------
// 3. MULTILINE STRINGS & INDENTATION HANDLING
// ----------------------------------------------------------------------------
console.log("--- 3. MULTILINE STRINGS ---");

// In ES5, this was a syntax error. In ES6, it works natively:
const emailTemplate = `
Dear ${user.firstName},

Welcome to the Modern JavaScript series!
Your current role: ${user.role}.

Best regards,
The Development Team
`.trim(); // Using .trim() cleans up the leading/trailing newline

console.log(emailTemplate);

console.log();

// ----------------------------------------------------------------------------
// 4. NESTED TEMPLATE LITERALS
// ----------------------------------------------------------------------------
console.log("--- 4. NESTED TEMPLATE LITERALS ---");

const order = {
    id: 1042,
    items: ["MacBook Pro", "Wireless Mouse", "Keyboard"],
    isShipped: false
};

// Nesting backticks inside a ternary expression:
const orderStatus = `Order #${order.id} is currently ${
    order.isShipped 
        ? "SHIPPED" 
        : `PENDING (${order.items.length} items waiting in warehouse: ${order.items.join(", ")})`
}.`;

console.log(orderStatus);

console.log();

// ----------------------------------------------------------------------------
// 5. TAGGED TEMPLATE LITERALS (HOW STYLED-COMPONENTS & SQL SANITIZERS WORK)
// ----------------------------------------------------------------------------
console.log("--- 5. TAGGED TEMPLATE LITERALS ---");

/**
 * A tag function receives:
 * 1. An array of string literals (the static parts of the string).
 * 2. The evaluated expression values passed as rest arguments.
 */
function highlight(strings, ...values) {
    // Interleave the static strings with transformed/highlighted values
    return strings.reduce((accumulator, currentString, index) => {
        const val = values[index] !== undefined ? `[[${values[index]}]]` : "";
        return accumulator + currentString + val;
    }, "");
}

const productName = "iPhone 15 Pro";
const productPrice = 999;

// Notice: no parentheses! We invoke the tag function by prefixing the backticks:
const formattedNotice = highlight`Special Deal: Get ${productName} for only $${productPrice} today!`;
console.log("Tagged output:", formattedNotice);

// Practical security application: Sanitizing malicious user input
function sanitizeHtml(strings, ...values) {
    return strings.reduce((acc, str, i) => {
        let val = values[i];
        if (typeof val === "string") {
            // Escape dangerous characters to prevent XSS:
            val = val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
        return acc + str + (val !== undefined ? val : "");
    }, "");
}

const maliciousInput = "<script>alert('hacked!');</script>";
const safeHtml = sanitizeHtml`<div>User comment: ${maliciousInput}</div>`;
console.log("Sanitized HTML output:", safeHtml);

console.log();

// ----------------------------------------------------------------------------
// 6. STRING.RAW (ESCAPING SPECIAL CHARACTERS)
// ----------------------------------------------------------------------------
console.log("--- 6. STRING.RAW ---");

// Normal template literal interprets \n as newline and \t as tab:
console.log(`Normal path: C:\new_folder\test`);

// String.raw preserves raw backslashes without escaping:
console.log(String.raw`Raw path: C:\new_folder\test`);
console.log(String.raw`Preserves raw regex: \d+\.\w+`);

console.log();

// ----------------------------------------------------------------------------
// 7. SUMMARY & TAKEAWAYS FOR REACT & NEXT.JS
// ----------------------------------------------------------------------------
console.log("--- 7. CHEAT SHEET: TEMPLATE LITERALS IN MODERN FRAMEWORKS ---");
console.table([
    { UseCase: "Dynamic API URL", Example: "`/api/products/${id}?sort=${order}`", Benefit: "Clean, readable, eliminates '+' concatenation bugs" },
    { UseCase: "React Tailwind Classes", Example: "`px-4 py-2 ${active ? 'bg-blue-600' : 'bg-gray-400'}`", Benefit: "Dynamic styling without complex string helpers" },
    { UseCase: "Tagged Templates", Example: "styled.button`background: ${theme.primary};`", Benefit: "Powers CSS-in-JS and SQL injection defense" },
    { UseCase: "Multiline Strings", Example: "`Line 1\\nLine 2` directly in backticks", Benefit: "Natural formatting for emails, markdown, SQL" }
]);

console.log("Module 02 loaded and executed successfully.\n");

