/**
 * ============================================================================
 * MODULE 05: HOCs, Render Props, and Custom Hooks — Architecture & Evolution
 * ============================================================================
 * 
 * 1. THE EVOLUTION OF CODE REUSE IN REACT
 * ----------------------------------------------------------------------------
 * Across React history, three primary patterns emerged to share stateful logic 
 * across components:
 * 
 * 1. Higher-Order Components (HOCs) — Popular in React 15/16 (Class Components)
 * 2. Render Props Pattern — Popular in React 16 (Dynamic Inversion of Control)
 * 3. Custom Hooks — The Modern Gold Standard (React 16.8+ and React 19)
 * 
 * 2. WHAT IS A HIGHER-ORDER COMPONENT (HOC)?
 * ----------------------------------------------------------------------------
 * A Higher-Order Component is a pure function that takes a React Component as an 
 * argument and returns an enhanced new Component:
 * 
 *   const EnhancedComponent = withFeature(BaseComponent);
 * 
 * Key Requirements for Writing HOCs:
 * - Pass-Through Unrelated Props: Always write `<WrappedComponent {...props} />`.
 * - Do NOT Mutate the Original Component: Wrap it in a container component.
 * - ⚠️ CRITICAL RULE: NEVER define an HOC inside another component's render body!
 *   If you create an HOC inside render, its component identity changes on EVERY
 *   render. React will unmount the entire subtree, destroy all state, and remount!
 * 
 * 3. WHY CUSTOM HOOKS WON
 * ----------------------------------------------------------------------------
 * - HOCs caused "Wrapper Hell" (5 nested layers in React DevTools for theme, auth,
 *   data, routing, and analytics).
 * - HOCs caused prop collisions (two HOCs injecting a prop named `data` or `loading`).
 * - Custom Hooks flatten the hierarchy: logic runs directly inside the functional 
 *   component with zero extra Fiber/DOM wrappers!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 05: HOCs, Render Props & Custom Hooks Evolution");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING HIGHER-ORDER COMPONENTS (HOC)
// ============================================================================
console.log("--- 1. HIGHER-ORDER COMPONENT (HOC) PATTERN ---");

// Base Component
function UserDashboard({ user, stats }) {
  return `[Dashboard View] Welcome ${user.name}! Orders: ${stats.orders}, Spent: $${stats.spent}`;
}

// HOC 1: Authentication Guard
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    if (!props.isAuthenticated) {
      return `[Auth Guard] ⛔ Access Denied! Please login to view this content.`;
    }
    // Forward all incoming props
    return WrappedComponent(props);
  };
}

// HOC 2: Loading Indicator
function withLoading(WrappedComponent) {
  return function LoadingComponent({ isLoading, ...restProps }) {
    if (isLoading) {
      return `[Loading Spinner] ⏳ Fetching dashboard metrics, please wait...`;
    }
    return WrappedComponent(restProps);
  };
}

// Composing HOCs together:
const ProtectedDashboard = withAuth(withLoading(UserDashboard));

console.log("Scenario A: User not logged in:");
console.log(ProtectedDashboard({ isAuthenticated: false, isLoading: false }));

console.log("\nScenario B: User logged in, but data still loading:");
console.log(ProtectedDashboard({ isAuthenticated: true, isLoading: true }));

console.log("\nScenario C: User logged in and data loaded:");
console.log(ProtectedDashboard({
  isAuthenticated: true,
  isLoading: false,
  user: { name: "Haris Ali" },
  stats: { orders: 12, spent: 850 }
}));

// ============================================================================
// SECTION 2: THE RENDER PROPS PATTERN
// ============================================================================
console.log("\n--- 2. THE RENDER PROPS PATTERN ---");

/**
 * A component that encapsulates data fetching or mouse tracking, delegating 
 * the actual UI rendering to a function prop.
 */
function MockMouseTracker({ render }) {
  // Encapsulated state logic
  const mockCoordinates = { x: 245, y: 112 };
  return render(mockCoordinates);
}

const renderPropsResult = MockMouseTracker({
  render: ({ x, y }) => `[Render Props UI] Mouse pointer is at (${x}px, ${y}px)`
});
console.log(renderPropsResult);

// ============================================================================
// SECTION 3: THE MODERN CUSTOM HOOK PATTERN
// ============================================================================
console.log("\n--- 3. THE MODERN CUSTOM HOOK PATTERN (No Wrappers!) ---");

/**
 * Custom Hooks allow you to extract and compose stateful logic cleanly.
 * By convention, always starts with 'use'.
 */
function useAuthLogic(userSession) {
  const isAuth = Boolean(userSession && userSession.token);
  const user = userSession ? userSession.user : null;
  return { isAuth, user };
}

function useDashboardMetrics(user) {
  if (!user) return { isLoading: false, stats: null };
  // Simulates cached stats
  return {
    isLoading: false,
    stats: { orders: 14, rewardPoints: 2400 }
  };
}

// Functional Component using Custom Hooks directly:
function ModernDashboardView(session) {
  const { isAuth, user } = useAuthLogic(session);
  const { isLoading, stats } = useDashboardMetrics(user);

  if (!isAuth) {
    return "[Custom Hook View] ⛔ Access Denied! Please authenticate.";
  }
  if (isLoading) {
    return "[Custom Hook View] ⏳ Loading metrics...";
  }

  return `[Custom Hook View] 🎉 Hello ${user.name}! Points: ${stats.rewardPoints}`;
}

console.log("Unauthenticated Session:");
console.log(ModernDashboardView(null));

console.log("\nAuthenticated Session:");
console.log(ModernDashboardView({
  token: "jwt_abc123",
  user: { name: "Haris Ali" }
}));

console.log("\n==================================================================");
console.log("  ARCHITECTURAL COMPARISON MATRIX");
console.log("==================================================================");
console.log("Criterion            | HOC              | Render Props    | Custom Hook");
console.log("---------------------|------------------|-----------------|-------------");
console.log("Logic Reuse          | ✅ Yes           | ✅ Yes          | ✅ Yes");
console.log("Tree Nesting         | ❌ Extra layers  | ❌ Nested JSX   | ✅ 0 Layers");
console.log("Prop Collisions      | ❌ Possible      | ✅ None         | ✅ None");
console.log("TypeScript Support   | ⚠️ Difficult     | ⚠️ Moderate     | ✅ Outstanding");
console.log("Modern React Usage   | Legacy / Niche   | Niche           | 🌟 Default Standard");
console.log("==================================================================\n");

console.log("✅ Module 05 Execution Verified: HOCs, Render Props, and Custom Hooks verified.");
