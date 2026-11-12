/**
 * ============================================================================
 * MODULE 24: React Error Boundaries & Application Resilience
 * ============================================================================
 * 
 * 1. THE PROBLEM: THE BLANK WHITE SCREEN OF DEATH
 * ----------------------------------------------------------------------------
 * Prior to React 16 (and still today if unhandled), an unhandled JavaScript error
 * thrown during rendering, in a lifecycle method, or in a constructor unmounts 
 * the ENTIRE React component tree!
 * A single broken review component could crash the entire checkout page!
 * 
 * 2. WHAT IS AN ERROR BOUNDARY?
 * ----------------------------------------------------------------------------
 * An Error Boundary is a React component that catches JavaScript errors anywhere 
 * in its child component tree, logs those errors to an observability service (e.g. Sentry),
 * and displays a fallback UI instead of unmounting the whole app.
 * 
 * Required Methods (Class Component):
 * - `static getDerivedStateFromError(error)`:
 *   Updates state so the next render shows the fallback UI. (Must be pure!).
 * - `componentDidCatch(error, info)`:
 *   Side effects like sending error stack traces and component stack to the backend.
 * 
 * 3. WHAT ERROR BOUNDARIES DO NOT CATCH:
 * ----------------------------------------------------------------------------
 * 1. Event Handlers: `<button onClick={handleCrash}>` (Use `try...catch` here!).
 * 2. Asynchronous Code: `setTimeout` or `requestAnimationFrame`.
 * 3. Server-Side Rendering (SSR).
 * 4. Errors thrown inside the Error Boundary itself (it only catches errors in its children).
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 24: React Error Boundaries & Resilient Architecture");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING AN ERROR BOUNDARY WRAPPER
// ============================================================================
console.log("--- 1. ERROR BOUNDARY ENGINE SIMULATION ---");

class MockErrorBoundary {
  constructor(fallbackRender) {
    this.fallbackRender = fallbackRender;
    this.hasError = false;
    this.capturedError = null;
  }

  // Simulates static getDerivedStateFromError
  static getDerivedStateFromError(error) {
    return { hasError: true, capturedError: error };
  }

  // Simulates componentDidCatch
  componentDidCatch(error, errorInfo) {
    console.log(`  [Sentry Telemetry] Error reported: "${error.message}"`);
    console.log(`  [Sentry Telemetry] Component Stack:`, errorInfo.componentStack);
  }

  // Simulates rendering child subtree with catch guard
  render(childComponentFn) {
    if (this.hasError) {
      return this.fallbackRender(this.capturedError);
    }

    try {
      return childComponentFn();
    } catch (err) {
      const stateUpdate = MockErrorBoundary.getDerivedStateFromError(err);
      this.hasError = stateUpdate.hasError;
      this.capturedError = stateUpdate.capturedError;
      this.componentDidCatch(err, { componentStack: "at FlakyPaymentWidget\n    at CheckoutApp" });
      return this.fallbackRender(this.capturedError);
    }
  }

  // Recovery mechanism
  resetErrorBoundary() {
    this.hasError = false;
    this.capturedError = null;
    console.log(`[Error Boundary Reset] User clicked 'Try Again'. State restored to healthy.`);
  }
}

// ============================================================================
// SECTION 2: TESTING APPLICATION RESILIENCE
// ============================================================================
console.log("\n--- 2. CRASH RECOVERY IN ISOLATED WIDGETS ---");

const paymentBoundary = new MockErrorBoundary((error) => {
  return `[Fallback UI] ⚠️ Payment service temporarily unavailable (${error.message}). [Try Again Button]`;
});

// Healthy Widget
function healthySidebar() {
  return "[Sidebar UI] Navigation links loaded successfully.";
}

// Crashing Child Widget
let shouldCrash = true;
function flakyPaymentWidget() {
  if (shouldCrash) {
    throw new Error("Stripe API Token Expired: 401 Unauthorized");
  }
  return "[Payment UI] Credit Card input ready.";
}

console.log("Rendering Healthy Sidebar (Not affected):");
console.log(healthySidebar());

console.log("\nRendering Flaky Payment Widget with Error Boundary:");
console.log(paymentBoundary.render(flakyPaymentWidget));

console.log("\nFixing error and recovering with resetErrorBoundary():");
shouldCrash = false;
paymentBoundary.resetErrorBoundary();
console.log(paymentBoundary.render(flakyPaymentWidget));

console.log("\n✅ Module 24 Execution Verified: Error Boundaries and recovery mechanics validated.");
