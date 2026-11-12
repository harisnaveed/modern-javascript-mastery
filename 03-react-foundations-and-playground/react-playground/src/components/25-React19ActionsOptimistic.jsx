import React, { useState, useOptimistic, useTransition } from "react";
import { Send, CheckCircle2, RotateCcw, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function React19ActionsOptimistic() {
  const [messages, setMessages] = useState([
    { id: "msg_1", text: "Device diagnosis complete: Needs new OLED display.", sending: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [simulateServerError, setSimulateServerError] = useState(false);
  const [isPending, startTransition] = useTransition();

  // React 19 useOptimistic Hook
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (currentMessages, newOptimisticText) => [
      ...currentMessages,
      { id: `opt_${Date.now()}`, text: newOptimisticText, sending: true }
    ]
  );

  const [notification, setNotification] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText("");
    setNotification("");

    // Start transition
    startTransition(async () => {
      // 1. Immediately apply optimistic message to UI
      setOptimisticMessages(textToSend);

      // 2. Simulate server round-trip latency
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (simulateServerError) {
              reject(new Error("Server Error 504: Network timeout"));
            } else {
              resolve();
            }
          }, 1000);
        });

        // 3. Server confirmed: commit permanent state
        setMessages(prev => [
          ...prev,
          { id: `msg_${Date.now()}`, text: textToSend, sending: false }
        ]);
        setNotification("✅ Message confirmed and saved to database!");
      } catch (err) {
        // 4. Server failed: useOptimistic AUTOMATICALLY ROLLS BACK!
        setNotification(`❌ ${err.message}. Message rolled back!`);
      }
    });
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-emerald">Module 25</span>
          <span className="badge badge-purple">React 19 Modern Era</span>
        </div>
        <h3 className="content-title">React 19 Actions & useOptimistic — Instant UI with Rollback</h3>
        <p className="content-subtitle">
          How React 19's new <code>useOptimistic</code> hook eliminates perceived latency by rendering temporary state immediately and rolling back automatically on failure.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Sparkles size={16} /> Instant User Feedback</h4>
            <p>
              Users shouldn't wait 1 second for a server round-trip to see a comment or chat message appear. <code>useOptimistic</code> renders the item instantaneously with a "sending" state.
            </p>
          </div>
          <div className="theory-box">
            <h4><RotateCcw size={16} /> Automatic Rollback</h4>
            <p>
              If the server rejects the request or the network drops, React automatically discards the optimistic update and reverts state without manual undo code!
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Sparkles size={18} className="text-emerald-400" />
            React 19 Optimistic Chat Stream
          </div>

          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
            <input 
              type="checkbox" 
              checked={simulateServerError} 
              onChange={e => setSimulateServerError(e.target.checked)} 
            />
            Simulate Server Network Failure (Test Rollback)
          </label>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            {/* Live Message Stream */}
            <div className="state-inspector-card">
              <div className="inspector-title">Live Message Stream (useOptimistic):</div>

              <div style={{ minHeight: "180px", maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {optimisticMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      padding: "10px 14px",
                      background: msg.sending ? "rgba(245,158,11,0.15)" : "var(--bg-secondary)",
                      border: `1px solid ${msg.sending ? "rgba(245,158,11,0.4)" : "var(--border-color)"}`,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "0.88rem" }}>{msg.text}</span>
                    <span className={`badge ${msg.sending ? "badge-amber" : "badge-emerald"}`} style={{ fontSize: "0.7rem" }}>
                      {msg.sending ? "SENDING (Optimistic)..." : "CONFIRMED"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  placeholder="Type a message (e.g. Can you expedite the repair?)..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  style={{ flex: 1, padding: "8px 12px", background: "var(--code-bg)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "white" }}
                />
                <button className="btn btn-primary" onClick={handleSendMessage} disabled={isPending || !inputText.trim()}>
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Send
                </button>
              </div>

              {notification && (
                <div style={{ marginTop: "12px", fontSize: "0.85rem", color: notification.includes("❌") ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                  {notification}
                </div>
              )}
            </div>

            {/* Explainer Box */}
            <div className="state-inspector-card">
              <div className="inspector-title">🧪 How to Test Optimistic Rollback:</div>
              <ol style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                <li>Check the <strong>"Simulate Server Network Failure"</strong> box at top right.</li>
                <li>Type a message like <code>"Please confirm my discount code"</code> and press Send.</li>
                <li>
                  Watch it render <strong>IMMEDIATELY</strong> with an amber <code>SENDING (Optimistic)</code> badge.
                </li>
                <li>
                  1 second later, the simulated server failure fires, and React <strong>AUTOMATICALLY REMOVES</strong> the message from the list without manual error state cleanup!
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
