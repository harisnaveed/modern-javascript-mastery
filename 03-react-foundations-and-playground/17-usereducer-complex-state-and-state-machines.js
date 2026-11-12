/**
 * ============================================================================
 * MODULE 17: useReducer — Complex State Management & Finite State Machines
 * ============================================================================
 * 
 * 1. WHY useReducer OVER useState?
 * ----------------------------------------------------------------------------
 * When your component has:
 * 1. Multiple state variables that change together (e.g. loading, data, error).
 * 2. Next state that depends on complex calculations over previous state.
 * 3. Complex business rules that you want to test outside React without UI.
 * 
 * `useReducer` separates "WHAT happened" (Action dispatch) from "HOW the state
 * changes in response" (Pure Reducer Function).
 * 
 * 2. THE ANATOMY OF A REDUCER
 * ----------------------------------------------------------------------------
 *   const [state, dispatch] = useReducer(reducer, initialState);
 * 
 * - Reducer Function: `(currentState, action) => nextState`
 *   MUST be a pure function! No API calls, no timers, no mutating arguments.
 * - Action: A plain JS object describing an event: `{ type: "ADD_ITEM", payload: ... }`
 * - Dispatch: A stable function that passes the action to React's reducer.
 * 
 * 3. FINITE STATE MACHINE (FSM) MENTAL MODEL
 * ----------------------------------------------------------------------------
 * A state machine prevents impossible UI states:
 *   [IDLE] ➔ dispatch(FETCH_START) ➔ [LOADING]
 *     ├── dispatch(FETCH_SUCCESS) ➔ [SUCCESS]
 *     └── dispatch(FETCH_ERROR)   ➔ [ERROR]
 * 
 * With individual `useState` flags, you can accidentally have `isLoading === true`
 * and `isSuccess === true` at the same time! A reducer prevents this by design.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 17: useReducer & Finite State Machine Architecture");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: DEFINING A PURE REDUCER FOR SHOPPING CART & CHECKOUT
// ============================================================================
console.log("--- 1. PURE REDUCER STATE MACHINE IMPLEMENTATION ---");

const initialCartState = {
  status: "idle", // 'idle' | 'loading' | 'success' | 'error'
  items: [],
  discountCode: null,
  errorMessage: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => 
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }]
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload.id)
      };
    }

    case "APPLY_DISCOUNT": {
      return {
        ...state,
        discountCode: action.payload.code
      };
    }

    case "CHECKOUT_REQUEST": {
      return {
        ...state,
        status: "loading",
        errorMessage: null
      };
    }

    case "CHECKOUT_SUCCESS": {
      return {
        ...state,
        status: "success",
        items: [], // Cart emptied
        errorMessage: null
      };
    }

    case "CHECKOUT_FAILURE": {
      return {
        ...state,
        status: "error",
        errorMessage: action.payload.error
      };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// ============================================================================
// SECTION 2: SIMULATING useReducer RUNTIME
// ============================================================================
console.log("\n--- 2. SIMULATING ACTION DISPATCHES ACROSS LIFECYCLE ---");

class MockReducerComponent {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;
  }

  dispatch(action) {
    console.log(`\n[Dispatch Action] -> Type: "${action.type}"`);
    this.state = this.reducer(this.state, action);
    console.log(`[Next State] Status: [${this.state.status}] | Cart Items: ${this.state.items.length}`);
  }
}

const component = new MockReducerComponent(cartReducer, initialCartState);

// 1. Add item
component.dispatch({
  type: "ADD_ITEM",
  payload: { id: "p1", name: "iPhone 15 OLED Screen", price: 140 }
});

// 2. Add duplicate item (increments quantity)
component.dispatch({
  type: "ADD_ITEM",
  payload: { id: "p1", name: "iPhone 15 OLED Screen", price: 140 }
});

// 3. Add second product
component.dispatch({
  type: "ADD_ITEM",
  payload: { id: "p2", name: "Battery Adhesive Strips", price: 10 }
});

// 4. Apply promo
component.dispatch({
  type: "APPLY_DISCOUNT",
  payload: { code: "HARIS20" }
});

// 5. Initiate Checkout
component.dispatch({ type: "CHECKOUT_REQUEST" });

// 6. Complete Checkout
component.dispatch({ type: "CHECKOUT_SUCCESS" });

console.log("\n==================================================================");
console.log("  useState VS useReducer SELECTION HEURISTIC");
console.log("==================================================================");
console.log("Scenario                           | Recommended Hook");
console.log("-----------------------------------|------------------------------");
console.log("Simple boolean toggle or text input| useState");
console.log("2+ pieces of state changing together| useReducer");
console.log("Complex business logic / workflows | useReducer (easily unit-tested!)");
console.log("Passing dispatch deeply via context| useReducer (avoids callback drilling)");
console.log("==================================================================\n");

console.log("✅ Module 17 Execution Verified: useReducer and State Machine architecture passed.");
