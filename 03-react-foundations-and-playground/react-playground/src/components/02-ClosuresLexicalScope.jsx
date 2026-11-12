import React, { useState } from "react";
import { Lock, Unlock, ShieldCheck, Calculator, ArrowRight } from "lucide-react";

// The pure JavaScript closure bank account factory
function createClosureAccount(initialDeposit) {
  let privateBalance = initialDeposit; // Truly private variable stored in closure heap

  return {
    deposit: (amount) => {
      privateBalance += amount;
      return privateBalance;
    },
    withdraw: (amount) => {
      if (amount > privateBalance) return { error: "Insufficient funds", balance: privateBalance };
      privateBalance -= amount;
      return { success: true, balance: privateBalance };
    },
    getBalance: () => privateBalance
  };
}

export default function ClosuresLexicalScope() {
  // We keep an instance of the closure in state
  const [account] = useState(() => createClosureAccount(1000));
  const [balance, setBalance] = useState(1000);
  const [logs, setLogs] = useState([
    "Closure scope initialized with privateBalance = $1000 in heap memory."
  ]);

  // Function Factory State
  const [taxRate, setTaxRate] = useState(0.15);
  const [productPrice, setProductPrice] = useState(100);
  const [factoryResult, setFactoryResult] = useState(115);

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  const handleDeposit = () => {
    const newBal = account.deposit(250);
    setBalance(newBal);
    addLog(`[Closure Access] account.deposit(250) ran. Outer function has long finished, but 'privateBalance' was safely incremented to $${newBal}!`);
  };

  const handleWithdraw = () => {
    const res = account.withdraw(150);
    if (res.error) {
      addLog(`[Closure Declined] Error: ${res.error}`);
    } else {
      setBalance(res.balance);
      addLog(`[Closure Access] account.withdraw(150) ran. Enclosed balance reduced to $${res.balance}!`);
    }
  };

  const handleCalculateTax = () => {
    // Closure function factory
    const calculateTax = (rate) => (price) => price + (price * rate);
    const taxCalculator = calculateTax(taxRate); // Closes over 'taxRate'
    const total = taxCalculator(productPrice);   // Invokes closure with 'productPrice'
    setFactoryResult(total);
    addLog(`[Function Factory] Created closure with taxRate = ${taxRate * 100}%. Calculated total on $${productPrice} = $${total}.`);
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-blue">Module 02</span>
          <span className="badge badge-purple">JavaScript Masterclass</span>
        </div>
        <h3 className="content-title">Closures, Lexical Scope & Data Encapsulation</h3>
        <p className="content-subtitle">
          How inner functions remember outer variables even after the outer function has returned, providing true privacy and function factories.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Lock size={16} /> Lexical Scoping & The Closure</h4>
            <p>
              "Lexical" means where code is physically written in source text. When an outer function finishes executing, its execution context is popped off the Call Stack. But if an inner function still references outer variables, JavaScript moves those variables to the Heap, creating a persistent <strong>Closure</strong>!
            </p>
          </div>
          <div className="theory-box">
            <h4><ShieldCheck size={16} /> PHP vs JavaScript Analogy</h4>
            <p>
              In PHP/Laravel, you must explicitly declare captured variables: <code>function() use ($var)</code>. In modern JavaScript, closures happen automatically! Every inner function implicitly encloses all accessible parent identifiers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Lab 1: Bank Account Encapsulation */}
        <div className="playground-card">
          <div className="playground-header">
            <div className="playground-title">
              <Lock size={18} className="text-emerald-400" />
              Private State via Closure (Bank Account)
            </div>
            <span className="badge badge-emerald">Balance: ${balance}</span>
          </div>

          <div className="playground-body">
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Notice that <code>account.privateBalance</code> is completely <code>undefined</code> from the outside. Only the returned methods retain a closure over the enclosed balance.
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button className="btn btn-emerald" onClick={handleDeposit}>
                Deposit $250
              </button>
              <button className="btn btn-danger" onClick={handleWithdraw}>
                Withdraw $150
              </button>
            </div>

            <pre className="code-preview">
{`// Direct property access check:
console.log(account.privateBalance); // -> undefined
console.log(account.getBalance());      // -> $${balance} (via Closure!)`}
            </pre>
          </div>
        </div>

        {/* Lab 2: Function Factory */}
        <div className="playground-card">
          <div className="playground-header">
            <div className="playground-title">
              <Calculator size={18} className="text-cyan-400" />
              Closure Function Factory (Preset Tax Calculator)
            </div>
          </div>

          <div className="playground-body">
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={taxRate * 100} 
                  onChange={e => setTaxRate(Number(e.target.value) / 100)}
                  style={{ width: "90px", padding: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "white" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Subtotal ($)</label>
                <input 
                  type="number" 
                  value={productPrice} 
                  onChange={e => setProductPrice(Number(e.target.value))}
                  style={{ width: "90px", padding: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "white" }}
                />
              </div>
              <button className="btn btn-primary" style={{ marginTop: "18px" }} onClick={handleCalculateTax}>
                Evaluate <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Calculated Total (Price + Tax): </span>
              <strong style={{ fontSize: "1.1rem", color: "var(--accent-blue)" }}>${factoryResult.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="terminal-box">
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>EVENT LOOP & CLOSURE EXECUTION AUDIT:</div>
        {logs.map((log, i) => (
          <div key={i} className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span>{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
