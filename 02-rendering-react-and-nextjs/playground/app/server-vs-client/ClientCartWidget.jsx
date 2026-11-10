"use client";

import { useState } from "react";

export default function ClientCartWidget({ productId, initialStock, productName }) {
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    setCartItems((prev) => [...prev, { name: productName, qty: quantity, time: new Date().toLocaleTimeString() }]);
    setMessage(`✅ Added ${quantity} item(s) to Cart!`);
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "8px", border: "1px solid var(--accent-blue)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span className="badge badge-blue">Client Component ("use client")</span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Stock Available: {initialStock}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="btn btn-secondary"
          style={{ width: "36px", height: "36px", padding: 0 }}
        >
          -
        </button>
        <span style={{ fontSize: "1.2rem", fontWeight: 700, minWidth: "24px", textAlign: "center" }}>
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => Math.min(initialStock, q + 1))}
          className="btn btn-secondary"
          style={{ width: "36px", height: "36px", padding: 0 }}
        >
          +
        </button>

        <button onClick={handleAddToCart} className="btn" style={{ marginLeft: "12px" }}>
          🛒 Add To Cart
        </button>
      </div>

      {message && <p style={{ color: "var(--accent-green)", fontSize: "0.9rem", fontWeight: 600 }}>{message}</p>}

      {cartItems.length > 0 && (
        <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
          <h5 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>Cart Contents:</h5>
          {cartItems.map((item, idx) => (
            <p key={idx} style={{ fontSize: "0.85rem", color: "#e4e4e7" }}>
              • {item.qty}x {item.name} (Added at {item.time})
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

