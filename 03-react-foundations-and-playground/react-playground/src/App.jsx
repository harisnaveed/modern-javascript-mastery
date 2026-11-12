import React, { useState } from "react";
import { 
  Sparkles, Code, BookOpen, Search, Layers, Zap, 
  Shield, Cpu, Activity, Clock, CheckCircle2, 
  GitBranch, RefreshCw, Smartphone, Wrench, ListPlus,
  ShoppingCart, Eye, Filter, ShieldCheck, Radio, GitCommit,
  ShieldAlert, Send
} from "lucide-react";

import MutabilityImmutability from "./components/01-MutabilityImmutability";
import ClosuresLexicalScope from "./components/02-ClosuresLexicalScope";
import StaleClosureSolutions from "./components/03-StaleClosureSolutions";
import CallbacksAndProps from "./components/04-CallbacksAndProps";
import HocVsCustomHooks from "./components/05-HocVsCustomHooks";
import EventLoopTimeline from "./components/06-EventLoopTimeline";
import PromisesLab from "./components/07-PromisesLab";
import AsyncAwaitDoesAwaitStopJs from "./components/08-AsyncAwaitDoesAwaitStopJs";
import AsyncInReactAndRaceConditions from "./components/09-AsyncInReactAndRaceConditions";
import ReferentialEqualityAndMemo from "./components/10-ReferentialEqualityAndMemo";
import UseCallbackAndUseMemo from "./components/11-UseCallbackAndUseMemo";
import ReactArchitectureFiberReconciliation from "./components/12-ReactArchitectureFiberReconciliation";
import UseStateBatchingSnapshots from "./components/13-UseStateBatchingSnapshots";
import HooksToolkitRefContextCustom from "./components/14-HooksToolkitRefContextCustom";
import GrandRepairWidgetApp from "./components/15-GrandRepairWidgetApp";
import ImmutableArrayPatterns from "./components/16-ImmutableArrayPatterns";
import UseReducerStateMachine from "./components/17-UseReducerStateMachine";
import UseLayoutEffectVsEffect from "./components/18-UseLayoutEffectVsEffect";
import UseTransitionDeferredValue from "./components/19-UseTransitionDeferredValue";
import ForwardRefImperativeHandle from "./components/20-ForwardRefImperativeHandle";
import UseSyncExternalStoreTearing from "./components/21-UseSyncExternalStoreTearing";
import DeepReconciliationTwoPass from "./components/22-DeepReconciliationTwoPass";
import FiberLanesTimeSlicing from "./components/23-FiberLanesTimeSlicing";
import ErrorBoundaryResilience from "./components/24-ErrorBoundaryResilience";
import React19ActionsOptimistic from "./components/25-React19ActionsOptimistic";

const MODULES = [
  // Phase 1: JS Foundations
  { id: 1, title: "Mutable vs Immutable State", phase: "Phase 1: JS Foundations", icon: RefreshCw, component: MutabilityImmutability },
  { id: 2, title: "Closures & Lexical Scope", phase: "Phase 1: JS Foundations", icon: Code, component: ClosuresLexicalScope },
  { id: 3, title: "Stale Closures & 3 Solutions", phase: "Phase 1: JS Foundations", icon: Clock, component: StaleClosureSolutions },
  { id: 4, title: "Callbacks & Callback Props", phase: "Phase 1: JS Foundations", icon: Smartphone, component: CallbacksAndProps },

  // Phase 2: Logic & Async Concurrency
  { id: 5, title: "HOC vs Custom Hooks", phase: "Phase 2: Logic & Async", icon: Shield, component: HocVsCustomHooks },
  { id: 6, title: "Event Loop & Microtasks", phase: "Phase 2: Logic & Async", icon: Cpu, component: EventLoopTimeline },
  { id: 7, title: "Promises & 4 Combinators", phase: "Phase 2: Logic & Async", icon: Zap, component: PromisesLab },
  { id: 8, title: "Does Await Stop JS? (Proof)", phase: "Phase 2: Logic & Async", icon: Activity, component: AsyncAwaitDoesAwaitStopJs },

  // Phase 3: Core Hooks & Optimization
  { id: 9, title: "Async in React & Race Conditions", phase: "Phase 3: Core Hooks", icon: Zap, component: AsyncInReactAndRaceConditions },
  { id: 10, title: "Referential Equality & React.memo", phase: "Phase 3: Core Hooks", icon: CheckCircle2, component: ReferentialEqualityAndMemo },
  { id: 11, title: "useCallback & useMemo Lab", phase: "Phase 3: Core Hooks", icon: Activity, component: UseCallbackAndUseMemo },
  { id: 12, title: "React Architecture: Fiber & VDOM", phase: "Phase 3: Core Hooks", icon: GitBranch, component: ReactArchitectureFiberReconciliation },
  { id: 13, title: "useState Snapshots & Batching", phase: "Phase 3: Core Hooks", icon: Layers, component: UseStateBatchingSnapshots },
  { id: 14, title: "Hooks Toolkit: Ref, Context, Custom", phase: "Phase 3: Core Hooks", icon: BookOpen, component: HooksToolkitRefContextCustom },
  { id: 15, title: "Grand Capstone: Repair Shop Widget", phase: "Phase 3: Core Hooks", icon: Wrench, component: GrandRepairWidgetApp },

  // Phase 4: Advanced Hooks, Fiber & Modern React 19
  { id: 16, title: "Immutable Arrays & Spread Deep Dive", phase: "Phase 4: Advanced Hooks & Fiber", icon: ListPlus, component: ImmutableArrayPatterns },
  { id: 17, title: "useReducer & State Machines", phase: "Phase 4: Advanced Hooks & Fiber", icon: ShoppingCart, component: UseReducerStateMachine },
  { id: 18, title: "useLayoutEffect (No Layout Flicker)", phase: "Phase 4: Advanced Hooks & Fiber", icon: Eye, component: UseLayoutEffectVsEffect },
  { id: 19, title: "useTransition & Concurrent Mode", phase: "Phase 4: Advanced Hooks & Fiber", icon: Filter, component: UseTransitionDeferredValue },
  { id: 20, title: "forwardRef & useImperativeHandle", phase: "Phase 4: Advanced Hooks & Fiber", icon: ShieldCheck, component: ForwardRefImperativeHandle },
  { id: 21, title: "useSyncExternalStore (No Tearing)", phase: "Phase 4: Advanced Hooks & Fiber", icon: Radio, component: UseSyncExternalStoreTearing },
  { id: 22, title: "Deep Reconciliation (2-Pass Diffing)", phase: "Phase 4: Advanced Hooks & Fiber", icon: GitCommit, component: DeepReconciliationTwoPass },
  { id: 23, title: "Fiber Internals & 32-Bit Lanes", phase: "Phase 4: Advanced Hooks & Fiber", icon: Cpu, component: FiberLanesTimeSlicing },
  { id: 24, title: "Error Boundaries & Resilience", phase: "Phase 4: Advanced Hooks & Fiber", icon: ShieldAlert, component: ErrorBoundaryResilience },
  { id: 25, title: "React 19 Actions & useOptimistic", phase: "Phase 4: Advanced Hooks & Fiber", icon: Send, component: React19ActionsOptimistic }
];

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];
  const ActiveComponent = activeModule.component;

  const filteredModules = MODULES.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const phases = Array.from(new Set(MODULES.map(m => m.phase)));

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-badge">
            <Sparkles size={13} />
            React Mastery Playground
          </div>
          <h1 className="sidebar-title">React Foundations</h1>
          
          {/* Quick Search */}
          <div style={{ marginTop: "14px", position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "var(--text-muted)" }} />
            <input 
              type="text" 
              placeholder="Search (closure, fiber, reducer, lanes)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px 8px 30px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                color: "white",
                fontSize: "0.8rem"
              }}
            />
          </div>
        </div>

        <nav className="sidebar-nav">
          {phases.map(phaseName => {
            const phaseModules = filteredModules.filter(m => m.phase === phaseName);
            if (phaseModules.length === 0) return null;

            return (
              <div key={phaseName} style={{ marginBottom: "12px" }}>
                <div className="nav-phase-heading">{phaseName}</div>
                {phaseModules.map(mod => {
                  const isActive = mod.id === activeModuleId;

                  return (
                    <button
                      key={mod.id}
                      className={`nav-item-btn ${isActive ? "active" : ""}`}
                      onClick={() => setActiveModuleId(mod.id)}
                    >
                      <span className="module-number-pill">{String(mod.id).padStart(2, "0")}</span>
                      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.title}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <div className="module-meta-wrap">
              <span className="badge badge-blue">Interactive Lab #{activeModule.id}</span>
              <span className="badge badge-emerald">{activeModule.phase}</span>
            </div>
            <h2 className="content-title">{activeModule.title}</h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Haris Ali Modern JS Series • 25 Comprehensive Labs</span>
          </div>
        </header>

        <section className="content-body">
          <ActiveComponent />
        </section>
      </main>
    </div>
  );
}
