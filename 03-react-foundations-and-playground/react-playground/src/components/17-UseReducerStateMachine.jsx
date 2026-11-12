import React, { useReducer, useState } from "react";
import { ShoppingCart, CheckCircle, AlertCircle, Loader2, Plus, Minus, Trash2, ArrowRight, RotateCcw } from "lucide-react";

const initialCart = {
  status: "idle", // 'idle' | 'loading' | 'success' | 'error'
  items: [
    { id: "p1", name: "iPhone 15 Screen Assembly", price: 140, qty: 1 },
    { id: "p2", name: "Precision Screwdriver Kit", price: 25, qty: 1 }
  ],
  discount: 0,
  error: null
};

function cartReducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map(it => it.id === action.id ? { ...it, qty: it.qty + 1 } : it)
      };

    case "DECREMENT":
      return {
        ...state,
        items: state.items
          .map(it => it.id === action.id ? { ...it, qty: it.qty - 1 } : it)
          .filter(it => it.qty > 0)
      };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(it => it.id !== action.id)
      };

    case "APPLY_DISCOUNT":
      return {
        ...state,
        discount: action.percent
      };

    case "CHECKOUT_INIT":
      return {
        ...state,
        status: "loading",
        error: null
      };

    case "CHECKOUT_SUCCESS":
      return {
        ...state,
        status: "success",
        items: [],
        error: null
      };

    case "CHECKOUT_FAIL":
      return {
        ...state,
        status: "error",
        error: action.error
      };

    case "RESET":
      return initialCart;

    default:
      return state;
  }
}

export default function UseReducerStateMachine() {
  const [state, dispatch] = useReducer(cartReducer, initialCart);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = state.items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const discountAmount = subtotal * state.discount;
  const total = subtotal - discountAmount;

  const handleCheckout = (simulateError = false) => {
    dispatch({ type: "CHECKOUT_INIT" });
    setTimeout(() => {
      if (simulateError) {
        dispatch({ type: "CHECKOUT_FAIL", error: "Card Declined: 402 Insufficient Funds" });
      } else {
        dispatch({ type: "CHECKOUT_SUCCESS" });
      }
    }, 1200);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 17</span>
          <span className="badge badge-emerald">State Machines</span>
        </div>
        <h3 className="content-title">useReducer & Finite State Machine Architecture</h3>
        <p className="content-subtitle">
          Managing complex multi-variable state transitions predictably by dispatching actions to a pure reducer function.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><ShoppingCart size={16} /> Predictable State Transitions</h4>
            <p>
              Instead of scattering 5 different <code>useState</code> setters across your component, all state transitions pass through a single, unit-testable reducer: <code>(state, action) =&gt; nextState</code>.
            </p>
          </div>
          <div className="theory-box">
            <h4><CheckCircle size={16} /> Eliminates Impossible States</h4>
            <p>
              By structuring state as a Finite State Machine (e.g. <code>status: 'loading' | 'success'</code>), you mathematically eliminate contradictory flags like <code>isLoading === true && isSuccess === true</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <ShoppingCart size={18} className="text-purple-400" />
            Repair Parts Cart & State Machine Checkout
          </div>
          <span className={`badge ${state.status === "loading" ? "badge-amber" : state.status === "success" ? "badge-emerald" : state.status === "error" ? "badge-rose" : "badge-blue"}`}>
            FSM Status: {state.status.toUpperCase()}
          </span>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            {/* Cart Items List */}
            <div>
              <div className="inspector-title">Active Cart Items:</div>

              {state.items.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-secondary)", borderRadius: "8px" }}>
                  {state.status === "success" ? "🎉 Order placed successfully! Cart is cleared." : "Cart is empty."}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {state.items.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        padding: "12px 16px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--accent-emerald)" }}>${item.price} each</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={() => dispatch({ type: "DECREMENT", id: item.id })}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: "20px", textAlign: "center" }}>
                          {item.qty}
                        </span>
                        <button className="btn btn-secondary" style={{ padding: "4px 8px" }} onClick={() => dispatch({ type: "INCREMENT", id: item.id })}>
                          <Plus size={12} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: "4px 8px", marginLeft: "6px" }} onClick={() => dispatch({ type: "REMOVE", id: item.id })}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FSM Checkout Controls */}
            <div className="state-inspector-card">
              <div className="inspector-title">Order Summary & Action Dispatch:</div>

              <div style={{ padding: "16px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {state.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "var(--accent-emerald)" }}>
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border-color)" }}>
                  <strong style={{ fontSize: "1.1rem" }}>Total:</strong>
                  <strong style={{ fontSize: "1.3rem", color: "var(--accent-blue)" }}>${total.toFixed(2)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => handleCheckout(false)}
                    disabled={state.status === "loading" || state.items.length === 0}
                  >
                    {state.status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                    Checkout (Success Flow)
                  </button>

                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleCheckout(true)}
                    disabled={state.status === "loading" || state.items.length === 0}
                  >
                    Simulate Fail
                  </button>
                </div>

                <button className="btn btn-secondary" onClick={() => dispatch({ type: "RESET" })}>
                  <RotateCcw size={14} /> Reset Cart
                </button>

                {state.error && (
                  <div style={{ padding: "10px", background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "6px", color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                    <AlertCircle size={14} style={{ display: "inline", marginRight: "6px" }} />
                    {state.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
