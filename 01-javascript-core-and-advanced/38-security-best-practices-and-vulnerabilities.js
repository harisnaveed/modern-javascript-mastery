/**
 * ============================================================================
 * MODULE 38: Security Best Practices & Vulnerability Prevention in Fullstack JS
 * ============================================================================
 *
 * 1. THE "WHY" & HISTORICAL BACKGROUND
 * ----------------------------------------------------------------------------
 * As JavaScript evolved from basic browser scripting to running entire enterprise 
 * stacks (Node.js, Express, React, Next.js), it became the primary target for 
 * web exploits. Because JavaScript is dynamically typed, features prototype-based 
 * inheritance, and relies on an asynchronous event loop, it introduces unique 
 * vulnerability vectors that don't exist in compiled languages.
 *
 * Notable Examples:
 * - Prototype Pollution: Malicious JSON payloads modifying `Object.prototype`, 
 *   compromising authentication logic across the entire server.
 * - ReDoS (Regular Expression Denial of Service): Poorly crafted regexes causing 
 *   catastrophic backtracking, freezing the single-threaded Node.js event loop.
 * - Timing Attacks: String comparisons (`===`) leaking secret token lengths and 
 *   characters via CPU execution timing.
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In Laravel:
 *   - Blade templates automatically escape HTML using `{{ $variable }}` to prevent XSS.
 *   - CSRF tokens are injected automatically in `@csrf` and verified by middleware.
 *   - Eloquent ORM parameterizes all queries via PDO to prevent SQL injection.
 *   - Password hashing uses `Hash::check()` with constant-time string comparisons.
 *
 * - In React, Next.js & Node.js:
 *   - React JSX escapes variables automatically, BUT `dangerouslySetInnerHTML` or 
 *     `<a href={userLink}>` can still execute malicious JavaScript (`javascript:alert(1)`).
 *   - Node.js APIs parsing arbitrary JSON must defend against `__proto__` pollution.
 *   - Server token verification must use `crypto.timingSafeEqual()` instead of `===`.
 *
 *
 * 3. THE 5 CRITICAL JAVASCRIPT VULNERABILITIES COVERED
 * ----------------------------------------------------------------------------
 * 1. XSS (Cross-Site Scripting): Unescaped HTML/script execution in the DOM.
 * 2. Prototype Pollution: Contaminating the global object prototype via recursive merges.
 * 3. Timing Attacks: Leaking secrets via variable-time string comparisons.
 * 4. ReDoS: Catastrophic backtracking blocking the Node.js Event Loop.
 * 5. Secure Cookies & CSRF: HttpOnly, Secure, SameSite flags in modern web apps.
 * ============================================================================
 */

const crypto = require("node:crypto");

console.log("==================================================================");
console.log("  MODULE 38: Security Best Practices & Vulnerabilities in JS");
console.log("==================================================================\n");

// ============================================================================
// VULNERABILITY 1: PROTOTYPE POLLUTION & HOW TO PREVENT IT
// ============================================================================
console.log("--- 1. PROTOTYPE POLLUTION (VULNERABILITY & FIX) ---");

/**
 * ❌ VULNERABLE FUNCTION: Naive recursive object merge
 * If an attacker sends: {"__proto__": {"isAdmin": true}}
 * It modifies Object.prototype, granting admin access to ALL plain objects!
 */
function unsafeDeepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      if (!target[key]) target[key] = {};
      unsafeDeepMerge(target[key], source[key]); // 💥 Doesn't block __proto__ or constructor!
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * ✅ SECURE MERGE FUNCTION:
 * Explicitly guards against dangerous prototype keys: __proto__, constructor, prototype.
 */
function secureDeepMerge(target, source) {
  for (const key of Object.keys(source)) {
    // 🛡️ Guard against prototype keys:
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      console.warn(`[Security Alert] Blocked attempt to pollute prototype key: "${key}"!`);
      continue;
    }

    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = Object.create(null); // Dictionary without prototype!
      }
      secureDeepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Testing Secure Merge against malicious payload:
const maliciousPayload = JSON.parse('{"name": "Attacker", "__proto__": {"isAdmin": true}}');
const safeTarget = {};

secureDeepMerge(safeTarget, maliciousPayload);

const randomUser = {};
console.log("Is normal object polluted with isAdmin?", Boolean(randomUser.isAdmin)); // false!


// ============================================================================
// VULNERABILITY 2: TIMING ATTACKS IN TOKEN / PASSWORD COMPARISONS
// ============================================================================
console.log("\n--- 2. TIMING ATTACKS & CONSTANT-TIME COMPARISONS ---");

/**
 * ❌ VULNERABLE COMPARISON:
 * function verifyApiKey(clientKey, serverKey) {
 *   return clientKey === serverKey; // 💥 Leaks character positions via execution time!
 * }
 *
 * If the first letter fails, `===` returns in 10 nanoseconds.
 * If the first 30 letters match, it returns in 200 nanoseconds.
 * Attackers use statistical timing analysis to guess API keys byte by byte!
 *
 * ✅ SECURE CONSTANT-TIME COMPARISON:
 * Uses crypto.timingSafeEqual(). Both buffers take the exact same time regardless of content!
 */

function safeCompareTokens(tokenA, tokenB) {
  // Hash both inputs using SHA-256 to ensure identical byte length
  const hashA = crypto.createHash("sha256").update(tokenA).digest();
  const hashB = crypto.createHash("sha256").update(tokenB).digest();

  // crypto.timingSafeEqual compares in constant time
  return crypto.timingSafeEqual(hashA, hashB);
}

const secretServerToken = "sk_live_99482948294829482019";
const clientSubmittedToken = "sk_live_99482948294829482019";
const wrongSubmittedToken = "sk_live_00000000000000000000";

console.log("Valid token matched safely:", safeCompareTokens(clientSubmittedToken, secretServerToken)); // true
console.log("Invalid token rejected safely:", safeCompareTokens(wrongSubmittedToken, secretServerToken)); // false


// ============================================================================
// VULNERABILITY 3: CROSS-SITE SCRIPTING (XSS) & DANGEROUS PATTERNS
// ============================================================================
console.log("\n--- 3. XSS SANITIZATION & DANGEROUS URLS ---");

/**
 * In React, JSX safely escapes strings: <div>{userInput}</div> -> SAFE!
 * BUT two major vulnerabilities remain in React/Next.js:
 * 1. dangerouslySetInnerHTML={{ __html: userInput }}
 * 2. Unsanitized href attributes: <a href={userWebsite}>Visit</a>
 *    If userWebsite is "javascript:alert(document.cookie)", clicking executes code!
 */

function sanitizeUrl(url) {
  const trimmed = url.trim().toLowerCase();
  // Disallow javascript: or data: protocols
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("vbscript:")) {
    console.warn(`[Security Alert] Blocked dangerous URL protocol: "${url}"`);
    return "about:blank"; // Safe fallback
  }
  return url;
}

const userProfileLink = "javascript:alert('Attacking via XSS!')";
console.log("Sanitized safe URL:", sanitizeUrl(userProfileLink));

const legitimateLink = "https://github.com/developer";
console.log("Legitimate safe URL:", sanitizeUrl(legitimateLink));


// ============================================================================
// VULNERABILITY 4: REGULAR EXPRESSION DENIAL OF SERVICE (ReDoS)
// ============================================================================
console.log("\n--- 4. REGULAR EXPRESSION DENIAL OF SERVICE (ReDoS) ---");

/**
 * Catastrophic Backtracking:
 * When a regex with nested quantifiers (e.g. `/(a+)+$/`) encounters a non-matching string,
 * the number of backtracking operations grows exponentially (O(2^n)).
 * 
 * 30 characters can freeze the Node.js event loop for seconds!
 * 
 * Rules to prevent ReDoS:
 * 1. Avoid nested quantifiers like `(a+)+` or `(x*)*`.
 * 2. Avoid overlapping alternations inside loops like `(a|a)+`.
 * 3. Use timeouts or specialized safe regex engines in production (e.g. `re2`).
 */
console.log("Demonstrating safe bounded regex parsing:");
const safeEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log("Is valid email:", safeEmailRegex.test("user@example.com")); // true


// ============================================================================
// SECTION 5: SECURITY CHEAT SHEET FOR REACT, NEXT.JS & NODE.JS
// ============================================================================
console.log("\n--- 5. FULLSTACK SECURITY GOLDEN RULES ---");

const securityGoldenRules = [
  {
    Risk: "XSS via dangerouslySetInnerHTML",
    Prevention: "Always sanitize with DOMPurify before setting HTML in React components.",
  },
  {
    Risk: "XSS via <a href>",
    Prevention: "Validate that protocols start strictly with 'https://' or 'http://'.",
  },
  {
    Risk: "Cookie Hijacking (XSS Session Theft)",
    Prevention: "Store JWTs/session tokens in HttpOnly, Secure, SameSite=Lax cookies, NOT localStorage.",
  },
  {
    Risk: "Prototype Pollution in Node.js",
    Prevention: "Reject payloads containing '__proto__', or use Map / Object.create(null).",
  },
  {
    Risk: "Secret Token Timing Attack",
    Prevention: "Always compare hashes using crypto.timingSafeEqual().",
  },
];

console.table(securityGoldenRules);
console.log("\nModule 38 loaded and executed successfully.");

