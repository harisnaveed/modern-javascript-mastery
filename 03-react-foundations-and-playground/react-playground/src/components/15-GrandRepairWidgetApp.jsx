import React, { useState, useMemo, useCallback, useRef, memo } from "react";
import { Wrench, CheckCircle2, AlertCircle, Loader2, DollarSign, Shield, ArrowRight, RotateCcw } from "lucide-react";

// Memoized Device Selector
const DeviceOption = memo(function DeviceOption({ id, label, selected, onSelect }) {
  return (
    <button
      className={`btn ${selected ? "btn-primary" : "btn-secondary"}`}
      onClick={() => onSelect(id)}
      style={{ flex: 1 }}
    >
      {label}
    </button>
  );
});

export default function GrandRepairWidgetApp() {
  // 1. Core State
  const [device, setDevice] = useState("smartphone");
  const [brand, setBrand] = useState("Apple");
  const [issue, setIssue] = useState("Screen Replacement");
  const [basePrice, setBasePrice] = useState(139);
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // 2. Submission & Async State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 3. Mutable Ref tracking attempts
  const submitCountRef = useRef(0);
  const abortControllerRef = useRef(null);

  const catalog = {
    smartphone: {
      brands: ["Apple", "Samsung", "Google Pixel", "Xiaomi"],
      issues: [
        { name: "Screen Replacement", price: 139 },
        { name: "Battery Replacement", price: 79 },
        { name: "Charging Port Fix", price: 59 },
        { name: "Back Glass Repair", price: 89 }
      ]
    },
    laptop: {
      brands: ["Apple MacBook", "Dell", "Lenovo", "ASUS"],
      issues: [
        { name: "Screen Replacement", price: 249 },
        { name: "Battery Replacement", price: 119 },
        { name: "Keyboard Repair", price: 139 },
        { name: "SSD Upgrade & Data Transfer", price: 159 }
      ]
    },
    tablet: {
      brands: ["Apple iPad", "Samsung Galaxy Tab", "Microsoft Surface"],
      issues: [
        { name: "Screen Replacement", price: 179 },
        { name: "Battery Replacement", price: 99 },
        { name: "Digitizer Touch Calibration", price: 89 }
      ]
    }
  };

  // useCallback to keep selectors stable for memoized children
  const handleSelectDevice = useCallback((newDevice) => {
    setDevice(newDevice);
    const defaultBrand = catalog[newDevice].brands[0];
    const defaultIssue = catalog[newDevice].issues[0];
    setBrand(defaultBrand);
    setIssue(defaultIssue.name);
    setBasePrice(defaultIssue.price);
  }, []);

  const handleSelectIssue = (issueName, price) => {
    setIssue(issueName);
    setBasePrice(price);
  };

  // Coupon code handler
  const handleApplyCoupon = (code) => {
    setCoupon(code);
    if (code.toUpperCase() === "HARIS20" || code.toUpperCase() === "REACT100") {
      setDiscountPercent(0.20); // 20% discount
    } else {
      setDiscountPercent(0);
    }
  };

  // useMemo for final invoice calculation
  const invoice = useMemo(() => {
    const labor = 40;
    const subtotal = basePrice + labor;
    const discount = subtotal * discountPercent;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.10; // 10% tax
    const total = taxableAmount + tax;

    return {
      parts: basePrice,
      labor,
      discount,
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }, [basePrice, discountPercent]);

  // Async Quote Submission
  const handleSubmitOrder = async () => {
    submitCountRef.current++;
    setIsSubmitting(true);
    setErrorMessage("");
    setConfirmedOrder(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Simulate backend API POST request with 1.5s latency
      const response = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve({
            ticketId: `REP-${Math.floor(100000 + Math.random() * 900000)}`,
            device: `${brand} (${device})`,
            issue,
            totalPaid: invoice.total,
            technician: "Alex Vance (Master Tech)",
            eta: "Today, 5:00 PM"
          });
        }, 1500);

        controller.signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("Submission cancelled by user."));
        });
      });

      setConfirmedOrder(response);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmission = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-emerald">Module 15</span>
          <span className="badge badge-purple">Grand Capstone</span>
        </div>
        <h3 className="content-title">Grand Capstone: The Complete Repair Widget System</h3>
        <p className="content-subtitle">
          Unifying all 14 concepts into an interactive, multi-step device repair booking application with async order processing.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Wrench size={16} /> Concepts at Work</h4>
            <p>
              - <strong>Immutability</strong>: Clean state updates.<br />
              - <strong>Callbacks & Props</strong>: Selector communication.<br />
              - <strong>React.memo & useCallback</strong>: Optimized selectors.<br />
              - <strong>useMemo</strong>: Cached invoice calculation.<br />
              - <strong>useRef</strong>: Submission attempt counter.<br />
              - <strong>Async/Await & AbortController</strong>: Reliable network pipeline.
            </p>
          </div>
          <div className="theory-box">
            <h4><Shield size={16} /> Production Ready</h4>
            <p>
              Experience seamless state coordination across parent and child components with zero wasted renders, robust cancellation, and instant quote calculation.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Wrench size={18} className="text-cyan-400" />
            Device Repair Booking Portal
          </div>
          <span className="badge badge-purple">Submission Attempts: {submitCountRef.current}</span>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            {/* Step Selection Form */}
            <div>
              {/* Step 1: Device */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  1. SELECT DEVICE TYPE (Memoized Selectors)
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <DeviceOption id="smartphone" label="Smartphone" selected={device === "smartphone"} onSelect={handleSelectDevice} />
                  <DeviceOption id="laptop" label="Laptop" selected={device === "laptop"} onSelect={handleSelectDevice} />
                  <DeviceOption id="tablet" label="Tablet" selected={device === "tablet"} onSelect={handleSelectDevice} />
                </div>
              </div>

              {/* Step 2: Brand */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  2. SELECT BRAND
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {catalog[device].brands.map(b => (
                    <button
                      key={b}
                      className={`btn ${brand === b ? "btn-emerald" : "btn-secondary"}`}
                      onClick={() => setBrand(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Issue */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  3. SELECT ISSUE / SERVICE
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {catalog[device].issues.map(iss => (
                    <button
                      key={iss.name}
                      className={`btn ${issue === iss.name ? "btn-primary" : "btn-secondary"}`}
                      style={{ justifyContent: "space-between" }}
                      onClick={() => handleSelectIssue(iss.name, iss.price)}
                    >
                      <span>{iss.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>${iss.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon Code Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                  PROMO CODE (Try: "HARIS20" for 20% off)
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    placeholder="Enter coupon code..."
                    value={coupon}
                    onChange={e => handleApplyCoupon(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", background: "var(--code-bg)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "white" }}
                  />
                  {discountPercent > 0 && (
                    <span className="badge badge-emerald" style={{ display: "flex", alignItems: "center" }}>
                      20% APPLIED
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Invoice & Confirmation */}
            <div className="state-inspector-card">
              <div className="inspector-title">Live Invoice Estimate (useMemo Cached)</div>

              <div style={{ padding: "16px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Parts Cost:</span>
                  <span>${invoice.parts.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Labor & Diagnostic:</span>
                  <span>${invoice.labor.toFixed(2)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "var(--accent-emerald)" }}>
                    <span>Promo Discount:</span>
                    <span>-${invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Sales Tax (10%):</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <hr style={{ borderColor: "var(--border-color)", margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Total Estimate:</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-emerald)" }}>${invoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting Order (Async/Await)...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Repair Order
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {isSubmitting && (
                  <button className="btn btn-danger" onClick={handleCancelSubmission}>
                    Cancel
                  </button>
                )}
              </div>

              {/* Confirmation Ticket */}
              {confirmedOrder && (
                <div style={{ padding: "16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px", color: "#a7f3d0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "1rem", marginBottom: "8px" }}>
                    <CheckCircle2 size={18} /> Order Confirmed! Ticket #{confirmedOrder.ticketId}
                  </div>
                  <div style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                    <div>Device: <strong>{confirmedOrder.device}</strong></div>
                    <div>Issue: <strong>{confirmedOrder.issue}</strong></div>
                    <div>Assigned Technician: <strong>{confirmedOrder.technician}</strong></div>
                    <div>Estimated Ready: <strong>{confirmedOrder.eta}</strong></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div style={{ padding: "12px", background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "6px", color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  <AlertCircle size={16} style={{ display: "inline", marginRight: "6px" }} />
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
