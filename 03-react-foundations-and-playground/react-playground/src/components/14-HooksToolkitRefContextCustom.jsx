import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { Clock, Search, Sun, Moon, Palette, Play, Square, RotateCcw } from "lucide-react";

// Context Definition
const ThemeContext = createContext({
  theme: "dark",
  accent: "blue",
  setTheme: () => {},
  setAccent: () => {}
});

// Custom Hook: useDebounce
function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export default function HooksToolkitRefContextCustom() {
  // Theme state for Context
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("blue");

  // State & Ref for Stopwatch
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalIdRef = useRef(null); // Mutable ref survives renders without causing renders

  // State for useDebounce
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Stopwatch Handlers
  const handleStartTimer = () => {
    if (isTimerActive) return;
    setIsTimerActive(true);
    intervalIdRef.current = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
  };

  const handleStopTimer = () => {
    setIsTimerActive(false);
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  const handleResetTimer = () => {
    handleStopTimer();
    setTimerSeconds(0);
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent }}>
      <div>
        <div className="theory-card">
          <div className="module-meta-wrap">
            <span className="badge badge-purple">Module 14</span>
            <span className="badge badge-emerald">Hook Toolkit</span>
          </div>
          <h3 className="content-title">useRef, useContext & Building Reusable Custom Hooks</h3>
          <p className="content-subtitle">
            Three foundational tools for production applications: mutable instance variables with <code>useRef</code>, avoiding prop drilling with <code>useContext</code>, and packaging logic with custom hooks.
          </p>

          <div className="theory-grid">
            <div className="theory-box">
              <h4><Clock size={16} /> useRef (Escape Hatch)</h4>
              <p>
                Holds a mutable <code>ref.current</code> pointer that persists across all renders. Modifying it does <strong>NOT</strong> trigger a re-render! Perfect for timer intervals and direct DOM focus.
              </p>
            </div>
            <div className="theory-box">
              <h4><Search size={16} /> Custom Hooks</h4>
              <p>
                Functions starting with <code>use...</code> that encapsulate React hooks. For example, <code>useDebounce</code> waits for user typing to settle before firing an API query.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Lab 1: useRef Stopwatch */}
          <div className="playground-card">
            <div className="playground-header">
              <div className="playground-title">
                <Clock size={18} className="text-amber-400" />
                useRef Stopwatch (No Re-render Leaks)
              </div>
              <span className="badge badge-amber">{timerSeconds}s</span>
            </div>

            <div className="playground-body">
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                The timer ID is stored in <code>intervalIdRef.current</code>, which persists across state updates without triggering infinite render cycles.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  className={`btn ${isTimerActive ? "btn-secondary" : "btn-emerald"}`}
                  onClick={handleStartTimer}
                  disabled={isTimerActive}
                >
                  <Play size={14} /> Start
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleStopTimer}
                  disabled={!isTimerActive}
                >
                  <Square size={14} /> Pause
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleResetTimer}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Lab 2: useDebounce Live Search */}
          <div className="playground-card">
            <div className="playground-header">
              <div className="playground-title">
                <Search size={18} className="text-cyan-400" />
                Custom Hook: useDebounce(value, 400ms)
              </div>
            </div>

            <div className="playground-body">
              <input 
                type="text" 
                placeholder="Type device name rapidly (e.g. MacBook Pro M3)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--code-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "white",
                  marginBottom: "16px"
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                <div style={{ color: "var(--text-muted)" }}>
                  Immediate Input Value: <strong style={{ color: "var(--text-primary)" }}>"{searchTerm}"</strong>
                </div>
                <div style={{ color: "var(--accent-blue)" }}>
                  Debounced Query Dispatched: <strong style={{ color: "var(--accent-emerald)" }}>"{debouncedSearch}"</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
