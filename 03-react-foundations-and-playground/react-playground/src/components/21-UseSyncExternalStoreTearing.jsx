import React, { useSyncExternalStore, useState } from "react";
import { Wifi, WifiOff, Radio, RefreshCw, Layers } from "lucide-react";

// Mock external reactive store
class NetworkMonitorStore {
  constructor() {
    this.state = { isOnline: true, latency: 28, lastUpdated: new Date().toLocaleTimeString() };
    this.listeners = new Set();
  }

  getSnapshot = () => {
    return this.state;
  };

  setState = (nextState) => {
    this.state = { ...this.state, ...nextState, lastUpdated: new Date().toLocaleTimeString() };
    this.listeners.forEach(fn => fn());
  };

  subscribe = (callback) => {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  };
}

const globalNetworkStore = new NetworkMonitorStore();

export default function UseSyncExternalStoreTearing() {
  // Subscribe to external store with useSyncExternalStore
  const network = useSyncExternalStore(
    globalNetworkStore.subscribe,
    globalNetworkStore.getSnapshot
  );

  return (
    <div>
      <div className="theory-card">
        <div className="module-meta-wrap">
          <span className="badge badge-emerald">Module 21</span>
          <span className="badge badge-blue">Concurrent Architecture</span>
        </div>
        <h3 className="content-title">useSyncExternalStore — Eliminating State Tearing</h3>
        <p className="content-subtitle">
          How React 18 & 19 prevent inconsistent UI renders when reading from external mutable stores (Redux, Zustand, browser APIs) during concurrent time-sliced renders.
        </p>

        <div className="theory-grid">
          <div className="theory-box">
            <h4><Radio size={16} /> What is State Tearing?</h4>
            <p>
              When a render is split across frames, an external store could mutate midway through. Half your components render with the OLD value, and half with the NEW value!
            </p>
          </div>
          <div className="theory-box">
            <h4><Layers size={16} /> The useSyncExternalStore Guarantee</h4>
            <p>
              React checks snapshots synchronously. If a snapshot changed mid-render, React discards the in-flight work and re-renders the whole tree atomically.
            </p>
          </div>
        </div>
      </div>

      <div className="playground-card">
        <div className="playground-header">
          <div className="playground-title">
            <Radio size={18} className="text-cyan-400" />
            External Network Store Monitor
          </div>
          <span className={`badge ${network.isOnline ? "badge-emerald" : "badge-rose"}`}>
            {network.isOnline ? "ONLINE (Connected)" : "OFFLINE (Disconnected)"}
          </span>
        </div>

        <div className="playground-body">
          <div className="grid-2">
            <div className="state-inspector-card">
              <div className="inspector-title">Active Store Snapshot:</div>
              <div style={{ padding: "16px", background: "var(--code-bg)", borderRadius: "8px", border: "1px solid var(--border-color)", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  {network.isOnline ? <Wifi size={20} className="text-emerald-400" /> : <WifiOff size={20} className="text-rose-400" />}
                  <strong style={{ fontSize: "1.1rem" }}>{network.isOnline ? "Internet Connected" : "Connection Dropped"}</strong>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Simulated Latency: <strong>{network.latency}ms</strong>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Last Snapshot Emit: {network.lastUpdated}
                </div>
              </div>
            </div>

            <div className="state-inspector-card">
              <div className="inspector-title">Simulate External Store Mutations:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button 
                  className="btn btn-danger"
                  onClick={() => globalNetworkStore.setState({ isOnline: false, latency: 999 })}
                >
                  <WifiOff size={14} /> Mutate External Store: Go Offline
                </button>

                <button 
                  className="btn btn-emerald"
                  onClick={() => globalNetworkStore.setState({ isOnline: true, latency: Math.floor(20 + Math.random() * 40) })}
                >
                  <Wifi size={14} /> Mutate External Store: Reconnect Online
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
