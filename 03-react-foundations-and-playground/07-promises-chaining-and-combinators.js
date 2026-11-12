/**
 * ============================================================================
 * MODULE 07: Promises, Chaining, and Combinators (all, allSettled, race, any)
 * ============================================================================
 * 
 * 1. WHY PROMISES WERE CREATED (The Callback Hell Problem)
 * ----------------------------------------------------------------------------
 * In legacy Node.js/JavaScript, asynchronous workflows led to the "Pyramid of Doom":
 *   getUser(id, (user) => {
 *     getOrders(user.id, (orders) => {
 *       getOrderDetails(orders[0].id, (details) => {
 *         getPayment(details.paymentId, (receipt) => {
 *           // 5 levels of nesting, painful error handling, indentation creep!
 *         });
 *       });
 *     });
 *   });
 * 
 * 2. WHAT IS A PROMISE?
 * ----------------------------------------------------------------------------
 * A Promise is a first-class JavaScript object representing the eventual completion 
 * (or failure) of an asynchronous operation and its resulting value.
 * 
 * A Promise is a state machine with 3 mutually exclusive states:
 * 1. PENDING: Initial state, operation is still running.
 * 2. FULFILLED: Operation completed successfully (`resolve(value)` was called).
 * 3. REJECTED: Operation encountered an error (`reject(reason)` was called).
 * 
 * Once a Promise is Fulfilled or Rejected, it is "SETTLED". A settled Promise's 
 * state is completely IMMUTABLE and will never transition again.
 * 
 * 3. CONSUMING PROMISES
 * ----------------------------------------------------------------------------
 * - `.then(onFulfilled)`: Handles success and returns a new Promise (enabling chaining).
 * - `.catch(onRejected)`: Catches any rejection anywhere along the upstream chain.
 * - `.finally(onSettled)`: Executes cleanup logic (closing DB connections, turning off spinners)
 *   regardless of success or failure.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 07: Promises, Chaining & The 4 Modern Combinators");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: CREATING & CONSUMING A PROMISE
// ============================================================================
console.log("--- 1. PROMISE LIFECYCLE (Pending -> Fulfilled) ---");

function simulatePaymentProcess(amount, shouldSucceed = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({ transactionId: "txn_987654", amount, status: "PAID" });
      } else {
        reject(new Error(`Card declined for amount $${amount}`));
      }
    }, 20);
  });
}

simulatePaymentProcess(150, true)
  .then(receipt => {
    console.log(`[Promise .then] Success! Transaction ID: ${receipt.transactionId}`);
  })
  .catch(err => {
    console.error(`[Promise .catch] Error: ${err.message}`);
  })
  .finally(() => {
    console.log(`[Promise .finally] Payment cycle concluded (hide loader).\n`);
  });

// ============================================================================
// SECTION 2: PROMISE CHAINING (Linear Pipeline)
// ============================================================================
console.log("--- 2. PROMISE CHAINING PIPELINE ---");

Promise.resolve(10)
  .then(val => {
    console.log(`Step 1 received: ${val} -> multiplying by 2`);
    return val * 2; // Returns 20
  })
  .then(val => {
    console.log(`Step 2 received: ${val} -> adding 15`);
    return val + 15; // Returns 35
  })
  .then(val => {
    console.log(`Step 3 final result: ${val}\n`);
  });

// ============================================================================
// SECTION 3: THE 4 PROMISE COMBINATORS IN ACTION
// ============================================================================
console.log("--- 3. THE 4 PROMISE COMBINATORS (Parallel Concurrency) ---");

const slowTask = new Promise(resolve => setTimeout(() => resolve("Slow (60ms)"), 60));
const fastTask = new Promise(resolve => setTimeout(() => resolve("Fast (20ms)"), 20));
const failingTask = new Promise((_, reject) => setTimeout(() => reject(new Error("Quick Fail (30ms)")), 30));

// 1. Promise.all() -> All must fulfill; rejects immediately on first error
Promise.all([slowTask, fastTask])
  .then(results => {
    console.log("✅ Promise.all Results (Both succeeded):", results);
  })
  .catch(err => console.error("❌ Promise.all failed:", err.message));

// 2. Promise.allSettled() -> Never rejects! Returns outcome of every single promise
Promise.allSettled([slowTask, fastTask, failingTask])
  .then(outcomes => {
    console.log("\n📋 Promise.allSettled Results (Complete audit):");
    outcomes.forEach((outcome, idx) => {
      if (outcome.status === "fulfilled") {
        console.log(`  Task ${idx + 1}: ✅ Fulfilled with value "${outcome.value}"`);
      } else {
        console.log(`  Task ${idx + 1}: ❌ Rejected with reason "${outcome.reason.message}"`);
      }
    });
  });

// 3. Promise.race() -> Returns the FIRST settled promise (success OR failure)
Promise.race([slowTask, fastTask])
  .then(winner => {
    console.log("\n🏁 Promise.race Winner:", winner);
  });

// 4. Promise.any() -> Returns the FIRST FULFILLED promise (ignores rejections unless ALL fail)
Promise.any([failingTask, slowTask, fastTask])
  .then(firstSuccess => {
    console.log("🎯 Promise.any First Success (Ignored earlier rejection):", firstSuccess);
  });

console.log("\n==================================================================");
console.log("  PROMISE COMBINATOR CHEAT SHEET");
console.log("==================================================================");
console.log("Method              | Fulfills When...               | Rejects When...");
console.log("--------------------|--------------------------------|-----------------");
console.log("Promise.all()       | ALL promises fulfill           | ANY promise rejects");
console.log("Promise.allSettled()| ALL promises settle (success/fail) NEVER rejects");
console.log("Promise.race()      | FIRST promise settles          | FIRST promise settles");
console.log("Promise.any()       | FIRST promise fulfills         | ALL promises reject");
console.log("==================================================================\n");
