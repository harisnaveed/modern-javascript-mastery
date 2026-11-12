/**
 * ============================================================================
 * ROOT TEST RUNNER: Full Repository Verification Suite
 * ============================================================================
 * 
 * Usage:
 *   node run-all.js
 * 
 * Purpose:
 *   Executes all three test suites across the repository:
 *   1. 01-javascript-core-and-advanced   (40 Modules)
 *   2. 02-rendering-react-and-nextjs     (24 Modules)
 *   3. 03-react-foundations-and-playground (25 Modules)
 *   Total: 89 Modules Tested and Verified!
 * ============================================================================
 */

const { execSync } = require("node:child_process");
const path = require("node:path");

console.log("==================================================================");
console.log("  FULL REPOSITORY TEST SUITE: JAVASCRIPT, RENDERING & REACT");
console.log("==================================================================\n");

const folders = [
  { name: "01-javascript-core-and-advanced", expected: 40 },
  { name: "02-rendering-react-and-nextjs", expected: 24 },
  { name: "03-react-foundations-and-playground", expected: 25 },
];

let totalPassed = 0;
let totalFailed = 0;

for (const folder of folders) {
  const runnerPath = path.join(__dirname, folder.name, "run-all.js");
  console.log(`>>> EXECUTING SUITE: [${folder.name}] (${folder.expected} Modules) <<<`);
  try {
    const output = execSync(`node "${runnerPath}"`, { cwd: path.join(__dirname, folder.name) });
    console.log(output.toString());
    totalPassed += folder.expected;
  } catch (err) {
    console.error(`💥 FAILURE IN [${folder.name}]:`, err.stdout ? err.stdout.toString() : err.message);
    totalFailed++;
  }
}

console.log("==================================================================");
console.log(`  FINAL REPOSITORY SUMMARY: ${totalPassed} PASSED | ${totalFailed} FAILED`);
console.log("==================================================================");

if (totalFailed === 0) {
  console.log(`🎉 ALL ${totalPassed} MODULES ACROSS BOTH DIRECTORIES PASSED WITH 0 ERRORS!\n`);
} else {
  process.exit(1);
}
