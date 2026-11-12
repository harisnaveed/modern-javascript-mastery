/**
 * ============================================================================
 * MODULE 20: forwardRef & useImperativeHandle — Controlled Imperative APIs
 * ============================================================================
 * 
 * 1. THE PROBLEM: FUNCTIONAL COMPONENTS CANNOT TAKE REFS BY DEFAULT
 * ----------------------------------------------------------------------------
 * In React, `ref` is a reserved prop (like `key`).
 * If you write `<MyCustomInput ref={inputRef} />`, React will not pass `ref`
 * into `props`.
 * 
 * Solution: `forwardRef`
 *   const MyCustomInput = forwardRef((props, ref) => {
 *     return <input ref={ref} {...props} />;
 *   });
 * 
 * 2. WHAT IS `useImperativeHandle`?
 * ----------------------------------------------------------------------------
 * Exposing a raw DOM node (e.g. `<video>` or `<input>`) gives the parent unrestricted
 * power to mutate styles, attributes, and internal nodes, breaking encapsulation.
 * 
 * `useImperativeHandle(ref, createHandle, [deps])` allows a Child component to 
 * define a CUSTOM, RESTRICTED API object that the parent receives:
 * 
 *   useImperativeHandle(ref, () => ({
 *     focus() { realInputRef.current.focus(); },
 *     clear() { realInputRef.current.value = ""; }
 *   }));
 * 
 * The parent can ONLY call `.focus()` and `.clear()`. They cannot access raw DOM!
 * 
 * 3. REAL-WORLD USE CASES:
 * ----------------------------------------------------------------------------
 * 1. Modal Dialogs: `modalRef.current.open()` / `modalRef.current.close()`.
 * 2. Media Players: `playerRef.current.play()` / `playerRef.current.seekTo(sec)`.
 * 3. Form Input Reset: Scrolling to and highlighting first invalid input.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 20: forwardRef & useImperativeHandle Encapsulation");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING CUSTOM IMPERATIVE HANDLE (Modal Dialog)
// ============================================================================
console.log("--- 1. RESTRICTED IMPERATIVE MODAL CONTROLLER ---");

class MockDOMElement {
  constructor(tag) {
    this.tag = tag;
    this.isOpen = false;
    this.innerText = "";
  }
}

// Simulates child component wrapping internal DOM and exposing custom handle
function createChildModalHandle(parentRef) {
  // Child's private internal DOM node
  const internalDialogDOM = new MockDOMElement("dialog");

  // useImperativeHandle assigns a sanitized object to parentRef.current:
  parentRef.current = {
    open(message) {
      internalDialogDOM.isOpen = true;
      internalDialogDOM.innerText = message;
      console.log(`  [Child Modal Handle] 📢 Dialog opened with: "${message}"`);
    },
    close() {
      internalDialogDOM.isOpen = false;
      console.log(`  [Child Modal Handle] 🔒 Dialog closed.`);
    },
    isOpen() {
      return internalDialogDOM.isOpen;
    }
  };

  return internalDialogDOM;
}

// Parent Component
const modalRef = { current: null }; // Simulates useRef()
const internalNode = createChildModalHandle(modalRef);

console.log("Parent inspecting received ref:");
console.log("  Exposed Methods on modalRef.current:", Object.keys(modalRef.current));
console.log("  Can parent access raw DOM node directly?:", modalRef.current === internalNode ? "Yes (Leaky)" : "No (Encapsulated!)");

console.log("\nParent invoking controlled methods:");
modalRef.current.open("Confirm deletion of Repair Ticket #8492?");
console.log("Is Modal Open?:", modalRef.current.isOpen());
modalRef.current.close();
console.log("Is Modal Open?:", modalRef.current.isOpen());

console.log("\n✅ Module 20 Execution Verified: forwardRef and useImperativeHandle patterns verified.");
