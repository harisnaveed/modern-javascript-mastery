# Modern JavaScript (ES6+ to ES2024) Masterclass Repository 🚀

> A complete, zero-dependency, sequentially numbered, production-grade guide to Modern and Advanced JavaScript. Built specifically for developers mastering **React**, **Next.js (App Router)**, and **Node.js** with deep comparisons to classical backend paradigms (PHP/Laravel).

---

## 📖 About This Repository

This repository transforms modern JavaScript from abstract theory into **35 self-contained, deeply documented, and executable JavaScript files**.

Every single file answers:

1. **The "Why"**: The historical bugs, memory leaks, and pre-ES6 pain points that forced the feature into the ECMAScript standard.
2. **PHP / Backend Mental Model**: Direct analogies for developers coming from PHP/Laravel or classical OOP.
3. **The Modern Solution**: Clean, modern idiomatic syntax and mechanics.
4. **Deep Dive & Gotchas**: Edge cases, strict mode differences, and silent traps.
5. **Real-World Framework Context**: How the exact concept powers React components, Next.js Server Actions, or Express middleware.
6. **Executable Code**: Fully runnable code with clear console outputs.

---

## 🛠️ How to Run & Learn

No build step or `npm install` is required! All files use native JavaScript and Node.js built-ins.

```bash
# Clone the repository
git clone https://github.com/harisnaveed/modern-javascript-mastery
cd modern-javascript-mastery

# Run all 35 modules through the automated test runner
node run-all.js

# Or run any individual module directly
node 01-var-let-const-and-scoping.js
node 07-array-iteration-and-transformation.js
node 12-closures-and-lexical-environment.js
node 21-asynchronous-foundations-and-event-loop.js
node 24-async-await-and-concurrency.js
node 29-javascript-in-react-patterns.js
node 32-debouncing-and-throttling.js
node 34-streams-buffers-and-data-pipelines.js
node 35-memory-management-and-leak-prevention.js
```

---

## 📚 Complete Curriculum & Table of Contents

### Phase 1: Core Fundamentals & Modern Syntax

| File                                                               | Concept                | Key Highlights                                                                              |
| ------------------------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------- |
| [01-var-let-const-and-scoping.js](01-var-let-const-and-scoping.js) | Scoping & Declarations | Function vs block scope, loop closure bug, `const` object mutation vs reassignment          |
| [02-template-literals.js](02-template-literals.js)                 | Template Literals      | String concatenation issues, multiline strings, Tagged Templates (styled-components/SQL)    |
| [03-arrow-functions.js](03-arrow-functions.js)                     | Arrow Functions        | Dynamic vs lexical `this`, implicit returns, why arrow functions cannot be constructors     |
| [04-default-parameters.js](04-default-parameters.js)               | Default Parameters     | The ES5 `\|\|` "Falsy Trap" (handling 0 and `""`), lazy evaluation, parameter destructuring |

### Phase 2: Data Structures & Modern Operators

| File                                                                                             | Concept                    | Key Highlights                                                                                          |
| ------------------------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| [05-destructuring-arrays-and-objects.js](05-destructuring-arrays-and-objects.js)                 | Destructuring Assignment   | Array and Object unpacking, renaming, nested defaults, React props patterns                             |
| [06-spread-and-rest-operators.js](06-spread-and-rest-operators.js)                               | Spread & Rest Operators    | Shallow copying traps, `structuredClone()`, function rest parameters, immutability                      |
| [07-array-iteration-and-transformation.js](07-array-iteration-and-transformation.js)             | Iteration & Transformation | `forEach`, `map`, `filter`, `find`, `findIndex`, ES2023 `findLast`, method chaining                     |
| [08-array-aggregation-and-immutability.js](08-array-aggregation-and-immutability.js)             | Aggregation & Immutability | Mastering `reduce()`, ES2023 immutable `toSorted()`, `toReversed()`, `toSpliced()`, `with()`            |
| [09-objects-and-modern-object-methods.js](09-objects-and-modern-object-methods.js)               | Modern Object Methods      | Enhanced literals, `keys`, `values`, `entries`, `fromEntries`, `freeze`, `seal`, recursive `deepFreeze` |
| [10-optional-chaining-and-nullish-coalescing.js](10-optional-chaining-and-nullish-coalescing.js) | Safe Access & Fallbacks    | `?.`, `??` vs `\|\|`, short-circuit evaluation, ES2021 logical assignments (`??=`, `\|=`, `&&=`)        |

### Phase 3: JavaScript Engine Internals & Mechanics

| File                                                                                       | Concept                  | Key Highlights                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------ | --------------------------------------------------------------------------------------------- |
| [11-scope-hoisting-and-temporal-dead-zone.js](11-scope-hoisting-and-temporal-dead-zone.js) | Hoisting & The TDZ       | V8 creation vs execution phase, why TDZ is temporal (time-based), variable shadowing          |
| [12-closures-and-lexical-environment.js](12-closures-and-lexical-environment.js)           | Closures & Environments  | Heap retention, private state encapsulation, memoization, the React **Stale Closure** bug     |
| [13-callback-and-higher-order-functions.js](13-callback-and-higher-order-functions.js)     | Callbacks & HOFs         | Functions as First-Class Citizens, Node.js error-first pattern, Currying, Function Piping     |
| [14-the-this-keyword-and-context.js](14-the-this-keyword-and-context.js)                   | The `this` Keyword       | **The 4 Rules of `this` Binding** (Default, Implicit, Explicit: `call`/`apply`/`bind`, `new`) |
| [15-prototypes-and-prototypal-inheritance.js](15-prototypes-and-prototypal-inheritance.js) | Prototypes & Inheritance | Prototype delegation, `[[Prototype]]` vs `.prototype`, `Object.create()`, Prototype Pollution |
| [16-classes-and-oop.js](16-classes-and-oop.js)                                             | Classes & OOP            | `constructor`, `extends`, `super()`, `static`, **ES2022 Native Private Fields (`#field`)**    |

### Phase 4: Advanced Collections, Iterators & Error Handling

| File                                                                             | Concept                      | Key Highlights                                                                                  |
| -------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| [17-set-and-map-collections.js](17-set-and-map-collections.js)                   | Set, Map, WeakMap & WeakSet  | One-line array deduplication, arbitrary keys, garbage-collected memory-safe collections         |
| [18-iterators-and-generators.js](18-iterators-and-generators.js)                 | Iterators & Generators       | `[Symbol.iterator]()`, `next()`, `function*` & `yield`, infinite lazy sequences, Redux-Saga     |
| [19-error-handling-and-custom-errors.js](19-error-handling-and-custom-errors.js) | Error Handling & Hierarchies | `try/catch/finally` mechanics, custom domain errors, **ES2022 Error Cause Chaining**            |
| [20-json-and-data-serialization.js](20-json-and-data-serialization.js)           | JSON & Serialization         | Replacer filters, `.toJSON()` hooks, Date revivers, `structuredClone` circular reference safety |

### Phase 5: Asynchronous JavaScript & Engine Runtime

| File                                                                                           | Concept                   | Key Highlights                                                                                                        |
| ---------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [21-asynchronous-foundations-and-event-loop.js](21-asynchronous-foundations-and-event-loop.js) | The Event Loop            | Call Stack, Macrotask Queue, Microtask Queue priority (why Promises beat `setTimeout(0)`)                             |
| [22-promises-and-promise-chaining.js](22-promises-and-promise-chaining.js)                     | Promises & Chaining       | 3 immutable states, horizontal chaining, centralized error bubbling, Promisification                                  |
| [23-promise-combinators.js](23-promise-combinators.js)                                         | Promise Combinators       | `Promise.all` (fail-fast), `Promise.allSettled`, `Promise.race` (timeouts), `Promise.any`, **ES2024 `withResolvers`** |
| [24-async-await-and-concurrency.js](24-async-await-and-concurrency.js)                         | Async/Await & Concurrency | Syntactic sugar, fixing the **Accidental Waterfall**, fixing the **`forEach` async trap**                             |

### Phase 6: Modern Web & Node.js Runtime Features

| File                                                                                           | Concept                     | Key Highlights                                                                                    |
| ---------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------- |
| [25-fetch-api-and-network-requests.js](25-fetch-api-and-network-requests.js)                   | Fetch API & AbortController | Why fetch does NOT reject on 404/500, checking `response.ok`, canceling requests, native timeouts |
| [26-es-modules-and-dynamic-imports.js](26-es-modules-and-dynamic-imports.js)                   | ESM & Dynamic Imports       | CommonJS vs ESM, Barrel re-export files, dynamic `import()` for on-demand Code Splitting          |
| [27-modern-javascript-gems-es2020-to-es2024.js](27-modern-javascript-gems-es2020-to-es2024.js) | Modern Language Gems        | **`Object.groupBy()` (ES2024)**, `.at(-1)`, `replaceAll()`, `BigInt`, `Symbol`, native `Intl` API |
| [28-dom-manipulation-and-event-delegation.js](28-dom-manipulation-and-event-delegation.js)     | DOM & Event Delegation      | Bubbling & Capturing phases, Event Delegation pattern, how React Synthetic Events work            |

### Phase 7: Real-World Framework Patterns (React, Next.js & Node.js)

| File                                                                       | Concept                     | Key Highlights                                                                                               |
| -------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [29-javascript-in-react-patterns.js](29-javascript-in-react-patterns.js)   | JavaScript in React         | State immutability idioms, list rendering with keys, avoiding the JSX **Zero Trap**, custom hooks            |
| [30-javascript-in-node-and-nextjs.js](30-javascript-in-node-and-nextjs.js) | Next.js & Node.js Fullstack | Server Components vs `"use client"`, Server Actions (`"use server"`, `FormData`), Middleware, `EventEmitter` |

### Phase 8: Advanced Production Systems & Performance Mastery

| File                                                                                         | Concept                              | Key Highlights                                                                                  |
| -------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [31-bonus-practice-exercises-and-solutions.js](31-bonus-practice-exercises-and-solutions.js) | 28 Comprehensive Practice Challenges | Hands-on tested solutions covering all core & advanced handbook exercises                       |
| [32-debouncing-and-throttling.js](32-debouncing-and-throttling.js)                           | Debounce & Throttle                  | Rate-limiting UI inputs, search autocomplete, scroll handlers, React `useDebounce` hook         |
| [33-proxy-and-reflect-metaprogramming.js](33-proxy-and-reflect-metaprogramming.js)           | Proxy & Reflect Metaprogramming      | Reactivity engines (Vue 3/MobX), input schema validation, dynamic RPC & API virtualization      |
| [34-streams-buffers-and-data-pipelines.js](34-streams-buffers-and-data-pipelines.js)         | Streams, Buffers & Streaming SSR     | Raw binary buffers, backpressure pipelines, Next.js App Router HTTP streaming & React Suspense  |
| [35-memory-management-and-leak-prevention.js](35-memory-management-and-leak-prevention.js)   | V8 Memory & Leak Prevention          | V8 heap spaces, Scavenger vs Mark-Sweep, 5 classic React/Node memory leaks, bounded LRU caching |

---

## 📊 Progress & Status Tracker

See [TRACKING.md](TRACKING.md) for full historical tracking metrics and module checklists.

---

## 🌟 License

This educational repository is open-source and free for personal and community learning.
