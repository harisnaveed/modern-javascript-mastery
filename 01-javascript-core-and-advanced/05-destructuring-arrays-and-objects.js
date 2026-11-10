/**
 * ============================================================================
 * MODULE 05: Destructuring (Arrays & Objects)
 * Specification: ECMAScript 2015 (ES6)
 * Target Environment: Node.js (v18+) / Modern Browsers
 * Prerequisite: Module 01 (Variables), Module 04 (Default Parameters)
 * ============================================================================
 *
 * 1. THE "WHY" (HISTORICAL CONTEXT & OLD JAVASCRIPT PAIN POINTS)
 * ----------------------------------------------------------------------------
 * In pre-ES6 JavaScript (ES5 and earlier), extracting data from arrays and
 * objects was notoriously repetitive and verbose:
 * 
 *     var user = { name: "Haris", age: 25, city: "Wah Cantt" };
 *     // Repetitive boilerplate:
 *     var name = user.name;
 *     var age = user.age;
 *     var city = user.city;
 * 
 * For arrays:
 *     var coords = [10.5, 20.8, 30.1];
 *     var x = coords[0];
 *     var y = coords[1];
 *     var z = coords[2];
 * 
 * When dealing with nested API payloads (e.g., `user.data.profile.address.city`),
 * developers wrote dozens of lines of temporary assignment boilerplate just to
 * unpack variables into their local function scope.
 * 
 * Swapping two variables required a clunky temporary variable:
 *     var temp = a; a = b; b = temp;
 *
 *
 * 2. PHP / BACKEND MENTAL MODEL COMPARISON
 * ----------------------------------------------------------------------------
 * - In PHP, array destructuring exists via `list()` or short array syntax (PHP 7.1+):
 *     [$first, $second] = $items;
 * - However, PHP has no native concept of *Object Destructuring* because PHP
 *   classes and associative arrays do not unpack by property key in the same way.
 * - JavaScript's object destructuring binds by *property name*, meaning the order
 *   of properties does not matter at all.
 *
 *
 * 3. THE MODERN JAVASCRIPT SOLUTION (ES6: Destructuring Assignment)
 * ----------------------------------------------------------------------------
 * Destructuring allows you to unpack values from arrays, or properties from
 * objects, into distinct variables using a syntax that mirrors the construction
 * of array and object literals:
 * 
 * - Array Destructuring: Ordered unpacking based on index position.
 *     const [first, second, third] = array;
 * - Object Destructuring: Named unpacking based on property keys.
 *     const { name, age, city } = object;
 *
 *
 * 4. DEEP DIVE & GOTCHAS (EDGE CASES)
 * ----------------------------------------------------------------------------
 * Gotcha 1: Unpacking Already-Declared Variables (Parentheses Requirement)
 *    - If you destructure an object into variables that are already declared:
 *        let a, b;
 *        { a, b } = { a: 1, b: 2 }; // SYNTAX ERROR!
 *    - The JS engine parses `{ a, b }` as an opening block statement.
 *    - Fix: Wrap the entire statement in parentheses: `({ a, b } = { a: 1, b: 2 });`
 * 
 * Gotcha 2: Nested Destructuring with Missing Parent Objects
 *    - `const { address: { city } } = user;` works if `user.address` exists.
 *    - If `user.address` is `undefined`, JavaScript throws:
 *      `TypeError: Cannot destructure property 'city' of undefined or null.`
 *    - Fix: Provide default objects: `const { address: { city } = {} } = user;`
 * 
 * Gotcha 3: Renaming vs Default Values
 *    - Renaming uses a colon (`:`): `{ property: newVariableName }`
 *    - Default values use an equals sign (`=`): `{ property = defaultValue }`
 *    - Both combined: `{ property: newVariableName = defaultValue }`
 * 
 * Gotcha 4: Destructuring Primitive Values
 *    - String destructuring works because strings are iterable:
 *        const [firstChar, secondChar] = "Hello"; // 'H', 'e'
 *    - Number or boolean destructuring accesses methods on their wrappers:
 *        const { length } = "Hello"; // 5
 *
 *
 * 5. REAL-WORLD USAGE IN REACT, NEXT.JS & NODE.JS
 * ----------------------------------------------------------------------------
 * - React Hook returns (Array destructuring):
 *     const [count, setCount] = useState(0);
 *     const [data, setData] = useState(null);
 * - React Functional Component Props (Object destructuring):
 *     function UserProfile({ name, avatar = "/default.png", role = "Viewer" })
 * - Express.js / Node.js Request Parsing:
 *     const { username, email, password } = req.body;
 *     const { id } = req.params;
 *     const { page = 1, limit = 20 } = req.query;
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 05: Destructuring (Arrays & Objects)");
console.log("==================================================================\n");

// ----------------------------------------------------------------------------
// 1. ARRAY DESTRUCTURING: BASIC, SKIPPING & DEFAULTS
// ----------------------------------------------------------------------------
console.log("--- 1. ARRAY DESTRUCTURING ---");

const languages = ["JavaScript", "TypeScript", "Python", "PHP", "Go"];

// Basic extraction by positional index:
const [primaryLang, secondaryLang] = languages;
console.log("Primary:", primaryLang);       // JavaScript
console.log("Secondary:", secondaryLang);   // TypeScript

// Skipping elements with commas:
const [, , thirdLang, , fifthLang] = languages;
console.log("Third language:", thirdLang);  // Python
console.log("Fifth language:", fifthLang);  // Go

// Default values for missing elements:
const [teamLead, architect, intern = "Unassigned"] = ["Haris", "Ayesha"];
console.log("Intern (defaulted):", intern); // Unassigned

// Elegant variable swapping without a temporary variable:
let valA = "Alpha";
let valB = "Beta";
console.log(`Before swap: valA=${valA}, valB=${valB}`);
[valA, valB] = [valB, valA];
console.log(`After swap:  valA=${valA}, valB=${valB}`);

console.log();

// ----------------------------------------------------------------------------
// 2. OBJECT DESTRUCTURING: BASIC, RENAMING & DEFAULTS
// ----------------------------------------------------------------------------
console.log("--- 2. OBJECT DESTRUCTURING ---");

const serverConfig = {
    host: "127.0.0.1",
    port: 8080,
    protocol: "https",
    database: "production_db"
};

// Basic extraction matching property names:
const { host, port } = serverConfig;
console.log(`Server listening on ${host}:${port}`);

// Renaming variables with alias colon (:):
const { database: dbName, protocol: netProtocol } = serverConfig;
console.log(`Connected to database '${dbName}' via protocol '${netProtocol}'`);

// Providing default values with equal sign (=):
const account = {
    username: "haris_fullstack",
    email: "haris@example.com"
};

const { username, role = "Standard User", status = "Active" } = account;
console.log("Account info:", { username, role, status });

// Combining Renaming AND Default Value:
const { plan: membershipTier = "Free Tier" } = account;
console.log("Membership tier:", membershipTier);

console.log();

// ----------------------------------------------------------------------------
// 3. NESTED DESTRUCTURING & DEFENSIVE DEFAULTS
// ----------------------------------------------------------------------------
console.log("--- 3. NESTED DESTRUCTURING ---");

const apiResponse = {
    status: 200,
    data: {
        user: {
            id: 101,
            profile: {
                firstName: "Haris",
                lastName: "Ali",
                location: {
                    city: "Wah Cantt",
                    country: "Pakistan"
                }
            }
        }
    }
};

// Deeply unpacking nested properties:
const {
    data: {
        user: {
            profile: {
                firstName,
                location: { city, country }
            }
        }
    }
} = apiResponse;

console.log(`User: ${firstName} from ${city}, ${country}`);

// Defensive nested destructuring (preventing crashes if nested objects are null/undefined):
const incompletePayload = { status: 404, data: {} };
const {
    data: {
        user: {
            profile: { bio = "No bio available" } = {}
        } = {}
    } = {}
} = incompletePayload;

console.log("Safely unpacked missing nested bio:", bio);

console.log();

// ----------------------------------------------------------------------------
// 4. REST SYNTAX IN DESTRUCTURING
// ----------------------------------------------------------------------------
console.log("--- 4. REST IN DESTRUCTURING ---");

// A) Array Rest: Collects remaining items into an array
const scores = [95, 88, 82, 75, 71, 64];
const [gold, silver, bronze, ...honorableMentions] = scores;
console.log("Podium medals:", { gold, silver, bronze });
console.log("Honorable mentions (rest array):", honorableMentions);

// B) Object Rest: Omits specific properties and gathers the rest
const employee = {
    empId: "EMP-401",
    fullName: "Haris Ali",
    salary: 95000,
    ssn: "000-12-3456",
    department: "Engineering"
};

// Sanitize sensitive data by separating salary and SSN from public profile:
const { salary, ssn, ...publicEmployeeProfile } = employee;
console.log("Public profile (sensitive fields stripped):", publicEmployeeProfile);

console.log();

// ----------------------------------------------------------------------------
// 5. DESTRUCTURING IN FUNCTION PARAMETERS (THE REACT STANDARD)
// ----------------------------------------------------------------------------
console.log("--- 5. PARAMETER DESTRUCTURING (REACT COMPONENT PATTERN) ---");

// In React, component props are always passed as a single object:
function UserCard({ name, role = "Developer", tags = [], isOnline = false }) {
    console.log(`[Component Render] <UserCard />:`);
    console.log(` - Name:   ${name}`);
    console.log(` - Role:   ${role}`);
    console.log(` - Online: ${isOnline ? "🟢 Yes" : "⚪ No"}`);
    console.log(` - Tags:   ${tags.join(", ") || "None"}`);
}

UserCard({
    name: "Haris Ali",
    role: "Senior Fullstack Engineer",
    tags: ["React", "Next.js", "Node.js", "Laravel"],
    isOnline: true
});

console.log();

// ----------------------------------------------------------------------------
// 6. CHEAT SHEET SUMMARY
// ----------------------------------------------------------------------------
console.log("--- 6. DESTRUCTURING CHEAT SHEET ---");
console.table([
    { Syntax: "const [a, b] = arr", Purpose: "Array destructuring", KeyRule: "Order matters (positional)" },
    { Syntax: "const { x, y } = obj", Purpose: "Object destructuring", KeyRule: "Keys must match object property names" },
    { Syntax: "const { x: alias } = obj", Purpose: "Renaming variables", KeyRule: "Colon defines new variable name" },
    { Syntax: "const { x = 10 } = obj", Purpose: "Default fallback", KeyRule: "Applies only when property is undefined" },
    { Syntax: "const [a, ...rest] = arr", Purpose: "Rest in destructuring", KeyRule: "Must be the last element" }
]);

console.log("Module 05 loaded and executed successfully.\n");

