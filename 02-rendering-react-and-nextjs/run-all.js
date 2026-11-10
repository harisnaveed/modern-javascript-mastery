/**
 * ============================================================================
 * TEST RUNNER: Automated Execution Suite for Rendering Modules (01 to 23)
 * ============================================================================
 * 
 * Usage:
 *   node run-all.js
 * 
 * Purpose:
 *   Executes every single numbered rendering module sequentially in a child process
 *   to verify that all 23 concept files run with 0 errors.
 * ============================================================================
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const files = fs.readdirSync(__dirname)
    .filter(file => /^\d{2}-.*\.js$/.test(file))
    .sort();

console.log("==================================================================");
console.log(`  RUNNING RENDERING TEST SUITE: ${files.length} MODULES DISCOVERED`);
console.log("==================================================================\n");

let passedCount = 0;
let failedCount = 0;

for (const file of files) {
    process.stdout.write(`Testing [${file}] ... `);
    try {
        execSync(`node "${path.join(__dirname, file)}"`, { stdio: "pipe" });
        console.log("✅ PASSED");
        passedCount++;
    } catch (error) {
        console.log("❌ FAILED");
        console.error(`Error in ${file}:\n`, error.stderr ? error.stderr.toString() : error.message);
        failedCount++;
    }
}

console.log("\n==================================================================");
console.log(`  TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
console.log("==================================================================");

if (failedCount === 0) {
    console.log(`🎉 ALL ${passedCount} RENDERING MODULES ARE 100% HEALTHY!\n`);
} else {
    process.exit(1);
}

