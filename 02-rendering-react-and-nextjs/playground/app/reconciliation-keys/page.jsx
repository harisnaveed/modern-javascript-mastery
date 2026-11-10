"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReconciliationKeysPage() {
  const [usersIndex, setUsersIndex] = useState([
    { id: "u1", name: "Ali Khan" },
    { id: "u2", name: "Ahmed Raza" },
    { id: "u3", name: "Haris Tariq" },
  ]);

  const [usersStable, setUsersStable] = useState([
    { id: "u1", name: "Ali Khan" },
    { id: "u2", name: "Ahmed Raza" },
    { id: "u3", name: "Haris Tariq" },
  ]);

  function prependUser() {
    const newId = `u_${Date.now()}`;
    const newUser = { id: newId, name: `New User (${newId.slice(-4)})` };

    setUsersIndex([newUser, ...usersIndex]);
    setUsersStable([newUser, ...usersStable]);
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          The Golden Rule of Keys: Index vs Stable ID
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Type a custom note in the input fields below for Ali or Ahmed. Then click 
          <strong> "Prepend New User"</strong> and watch what happens to your typed text!
        </p>
      </div>

      <div style={{ margin: "16px 0 24px" }}>
        <button onClick={prependUser} className="btn" style={{ padding: "10px 20px", fontSize: "1rem" }}>
          ➕ Prepend New User to Top of Both Lists
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* COLUMN A: ANTI-PATTERN (INDEX AS KEY) */}
        <div className="demo-box" style={{ borderColor: "var(--accent-red)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#f87171" }}>❌ Buggy: key=&#123;index&#125;</h3>
            <span className="badge badge-amber">State Corrupted</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            React thinks the item at index 0 is always the same component, so it retains DOM state in place!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {usersIndex.map((user, index) => (
              <div key={index} style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{user.name}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Index: [{index}]</span>
                </div>
                <input
                  type="text"
                  placeholder={`Type note for ${user.name}...`}
                  style={{ width: "100%", background: "var(--bg-card)", color: "#fff", border: "1px solid var(--border-color)", padding: "8px", borderRadius: "6px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN B: RECOMMENDED PATTERN (STABLE ID AS KEY) */}
        <div className="demo-box" style={{ borderColor: "var(--accent-green)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#4ade80" }}>✅ Correct: key=&#123;user.id&#125;</h3>
            <span className="badge badge-green">State Preserved</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            React tracks each item by its unique ID. The input text moves seamlessly with the correct user!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {usersStable.map((user) => (
              <div key={user.id} style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "0.95rem" }}>{user.name}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-green)" }}>Key: {user.id}</span>
                </div>
                <input
                  type="text"
                  placeholder={`Type note for ${user.name}...`}
                  style={{ width: "100%", background: "var(--bg-card)", color: "#fff", border: "1px solid var(--border-color)", padding: "8px", borderRadius: "6px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

