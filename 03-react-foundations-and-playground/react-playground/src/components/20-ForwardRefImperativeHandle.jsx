import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { ShieldCheck, Play, Square, Activity, Bell } from "lucide-react";

// Child Component exposing controlled handle
const CustomModalDialog = forwardRef(function CustomModalDialog(props, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  // Expose ONLY safe, designated methods to parent:
  useImperativeHandle(ref, () => ({
    open(msg) {
      setMessage(msg);
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
    },
    shake() {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }));

  if (!isOpen) return null;

  return (
    <div style={{
      marginTop: "16px",
      padding: "20px",
      background: "var(--bg-secondary)",
      border: "1px solid var(--accent-blue)",
      borderRadius: "8px",
      boxShadow: "0 0 20px rgba(56,189,248,0.2)",
      transform: isShaking ? "translateX(-6px)" : "none",
      transition: "transform 0.1s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <strong style={{ color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: "6px" }}>
          <Bell size={16} /> Modal Dialog (Rendered in Child)
        </strong>
        <span className="badge badge-emerald">Controlled Handle Active</span>
      </div>

      <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "16px" }}>
        {message}
      </p>

      <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => setIsOpen(false)}>
        Dismiss Modal
      </button>
    </div>
  );
});

export default function ForwardRefImperativeHandle() {
  const modalRef = useRef(null);

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-purple">Module 20</span>
          <span className="badge badge-emerald">Encapsulation</span>
        </div>
        <h3 className="content-title">forwardRef & useImperativeHandle — Controlled Imperative APIs</h3>
        <p className="content-subtitle">
          How to forward refs to functional child components and expose a safe, restricted API instead of leaking raw DOM nodes to parents.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><ShieldCheck size={16} /> Why Forward Refs?</h4>
            <p>
              By default, React does not pass the <code>ref</code> prop to functional components. <code>forwardRef</code> forwards the parent's ref pointer into the child function.
            </p>
          </div>
          <div className="theory-box">
            <h4><Activity size={16} /> useImperativeHandle</h4>
            <p>
              Instead of giving the parent full write access to raw DOM nodes (breaking encapsulation), <code>useImperativeHandle</code> defines a clean public API (e.g. <code>open()</code>, <code>close()</code>).
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <ShieldCheck size={18} className="text-emerald-400" />
            Imperative Modal Controller
          </div>
        </div>

        <div className="playground-body">
          {/* Parent Action Controls */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <button className="btn btn-primary" onClick={() => modalRef.current?.open("Confirm repair booking for MacBook Pro (Total: $249)?")}>
              modalRef.current.open()
            </button>

            <button className="btn btn-danger" onClick={() => modalRef.current?.close()}>
              modalRef.current.close()
            </button>

            <button className="btn btn-secondary" onClick={() => modalRef.current?.shake()}>
              modalRef.current.shake()
            </button>
          </div>

          <div className="state-inspector-card">
            <div className="inspector-title">Parent Ref Inspection:</div>
            <pre className="code-preview">
{`// Parent calls only designated methods:
modalRef.current.open("...");
modalRef.current.close();
modalRef.current.shake();

// Raw internal DOM nodes remain 100% private to Child!`}
            </pre>
          </div>

          {/* Child Component Instance */}
          <CustomModalDialog ref={modalRef} />
        </div>
      </div>
    </div>
  );
}
