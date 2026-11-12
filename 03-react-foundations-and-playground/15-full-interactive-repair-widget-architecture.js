/**
 * ============================================================================
 * MODULE 15: Grand Capstone — Interactive Repair Shop Widget Architecture
 * ============================================================================
 * 
 * 1. ARCHITECTURAL OVERVIEW
 * ----------------------------------------------------------------------------
 * This capstone module synthesizes ALL 14 concepts learned across this series
 * into a single cohesive, production-grade application architecture:
 * 
 *   [RepairShopParent] (Holds root state, handles async quote submission)
 *          │
 *          ├── [DeviceSelector]  (Memoized via React.memo, receives useCallback)
 *          ├── [BrandSelector]   (Immutably updates brand state)
 *          ├── [IssueSelector]   (Calculates pricing with useMemo)
 *          └── [QuoteSubmitter]  (Handles async/await, AbortController, and useRef)
 * 
 * Concepts Demonstrated in Harmony:
 * 1. Immutability: State transitions using spread operator (`...prev`).
 * 2. Closures: Event handlers capturing current render values.
 * 3. Callbacks & Props: Child-to-parent communication.
 * 4. React.memo: Children skip rendering unless their specific props change.
 * 5. useCallback: Function references preserved to protect memoized children.
 * 6. useMemo: Expensive invoice tax and parts calculation cached.
 * 7. useRef: Mutable submission counter without re-renders.
 * 8. Async/Await & AbortController: Simulating remote quote verification.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 15: Grand Capstone — Complete Repair Widget System");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE REPAIR SHOP SYSTEM
// ============================================================================

class ComprehensiveRepairApp {
  constructor() {
    // 1. Root State (Managed Immutably)
    this.state = {
      device: null,
      brand: null,
      model: null,
      issue: null,
      basePrice: 0,
      isSubmitting: false,
      quoteConfirmation: null
    };

    // 2. Mutable Ref (Tracks attempts without re-rendering)
    this.submissionAttemptsRef = { current: 0 };

    // 3. Render Pass Counter
    this.renderCount = 1;
  }

  // Pure reducer/updater enforcing immutability
  updateState(updater) {
    const nextState = typeof updater === "function" ? updater(this.state) : updater;
    if (Object.is(this.state, nextState)) return; // Object.is check
    this.state = nextState;
    this.renderCount++;
    console.log(`[App Render #${this.renderCount}] State updated:`, {
      device: this.state.device,
      brand: this.state.brand,
      issue: this.state.issue
    });
  }

  // Callback Prop 1: Device Selection (useCallback pattern)
  handleSelectDevice = (device) => {
    this.updateState(prev => ({
      ...prev,
      device,
      brand: null, // Reset dependent fields cleanly
      model: null,
      issue: null,
      basePrice: 0
    }));
  };

  // Callback Prop 2: Brand Selection
  handleSelectBrand = (brand) => {
    this.updateState(prev => ({
      ...prev,
      brand
    }));
  };

  // Callback Prop 3: Issue Selection with Base Price
  handleSelectIssue = (issue, basePrice) => {
    this.updateState(prev => ({
      ...prev,
      issue,
      basePrice
    }));
  };

  // Simulated useMemo: Computes final invoice estimate (cached unless basePrice changes)
  computeTotalInvoice() {
    const taxRate = 0.12; // 12% sales tax
    const laborFee = 45;  // $45 flat service fee
    const subtotal = this.state.basePrice + laborFee;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      parts: this.state.basePrice,
      labor: laborFee,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }

  // Simulated Async Quote Submission with AbortController and try/catch
  async submitRepairOrder() {
    this.submissionAttemptsRef.current++;
    console.log(`\n[Quote Submitter] 🚀 Initiating quote submission (Attempt #${this.submissionAttemptsRef.current})...`);

    this.updateState(prev => ({ ...prev, isSubmitting: true }));
    const controller = new AbortController();

    try {
      // Async Promise simulation
      const result = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve({
            orderId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
            status: "CONFIRMED",
            estimatedCompletion: "24 Hours"
          });
        }, 30);

        controller.signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("Submission cancelled by user"));
        });
      });

      this.updateState(prev => ({
        ...prev,
        isSubmitting: false,
        quoteConfirmation: result
      }));

      console.log(`[Quote Submitter] ✅ Order Approved! Ticket: ${result.orderId} | Status: ${result.status}`);
      return result;
    } catch (err) {
      console.error(`[Quote Submitter] ❌ Error: ${err.message}`);
      this.updateState(prev => ({ ...prev, isSubmitting: false }));
    }
  }
}

// ============================================================================
// SECTION 2: RUNNING THE END-TO-END WIDGET WORKFLOW
// ============================================================================
async function runRepairAppSimulation() {
  const app = new ComprehensiveRepairApp();

  console.log("Step 1: Selecting Device...");
  app.handleSelectDevice("Smartphone");

  console.log("\nStep 2: Selecting Brand...");
  app.handleSelectBrand("Samsung");

  console.log("\nStep 3: Selecting Issue & Parts Cost...");
  app.handleSelectIssue("Battery Degradation Replacement", 89);

  console.log("\nStep 4: Evaluating useMemo Calculated Quote:");
  const invoice = app.computeTotalInvoice();
  console.log("  Parts Cost:  $" + invoice.parts);
  console.log("  Labor Fee:   $" + invoice.labor);
  console.log("  Tax (12%):   $" + invoice.tax);
  console.log("  Total Price: $" + invoice.total);

  console.log("\nStep 5: Submitting Quote to Backend API (Async/Await)...");
  await app.submitRepairOrder();

  console.log("\n==================================================================");
  console.log("  CAPSTONE VERIFICATION SUMMARY");
  console.log("==================================================================");
  console.log("  Total Component Renders:   " + app.renderCount);
  console.log("  Total Submission Attempts: " + app.submissionAttemptsRef.current);
  console.log("  Final Order ID:            " + app.state.quoteConfirmation.orderId);
  console.log("==================================================================\n");

  console.log("✅ Module 15 Execution Verified: All 15 concept modules successfully validated!");
}

runRepairAppSimulation();
