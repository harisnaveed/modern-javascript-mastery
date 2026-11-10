/**
 * ============================================================================
 * MODULE 01: What is Rendering & The Browser Rendering Pipeline
 * ============================================================================
 *
 * 1. THE "WHY" & CORE DEFINITION
 * ----------------------------------------------------------------------------
 * Rendering means converting your application code (components, state, and props) 
 * into something visual that can be displayed on the user's screen.
 *
 * In React, you write JSX:
 *   function App() {
 *     return <h1>Hello World</h1>;
 *   }
 *
 * However, web browsers (Chrome, Safari, Firefox) do NOT understand JSX!
 * Browsers understand only three things:
 * 1. HTML (Document structure)
 * 2. CSS (Styling rules)
 * 3. JavaScript (Imperative scripting engine)
 *
 * Therefore, React, its compiler (Babel/SWC), and the browser must work together 
 * to transform JSX into browser DOM nodes and finally paint pixels on the monitor.
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In Traditional PHP (Blade / Core PHP):
 *   <?php
 *     $name = "Haris";
 *     echo "<h1>Welcome $name</h1>";
 *   ?>
 *   PHP executes 100% on the server. It interpolates the string and outputs 
 *   raw HTML text directly into the HTTP response stream. The browser receives 
 *   the text and paints it. When something changes, PHP must reload the entire page.
 *
 * - In React:
 *   React does NOT simply output static HTML text during client execution.
 *   React maintains an in-memory representation of the UI, continuously watches 
 *   for state changes, and calculates surgical updates to the browser DOM without 
 *   refreshing the page!
 *
 *
 * 3. THE 5-STAGE BROWSER RENDERING PIPELINE
 * ----------------------------------------------------------------------------
 * When the browser receives HTML/CSS/JS, it executes 5 critical steps:
 * 1. DOM Tree Construction: Parses raw HTML bytes into DOM element nodes.
 * 2. CSSOM Construction: Parses CSS rules into the CSS Object Model.
 * 3. Render Tree: Combines DOM and CSSOM, ignoring hidden elements (`display: none`).
 * 4. Layout (Reflow): Calculates exact geometric dimensions (width, height, coordinates).
 * 5. Painting & Compositing: Fills in pixels (colors, borders, text) and combines layers.
 *
 * ⚠️ CRITICAL DISTINCTION:
 * React Rendering is NOT the same as Browser Painting!
 * - React Rendering: Calling component functions to calculate what the UI looks like.
 * - Browser Rendering/Painting: Drawing pixels onto the physical screen.
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 01: What is Rendering & The Browser Rendering Pipeline");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE BROWSER RENDERING PIPELINE IN JAVASCRIPT
// ============================================================================
console.log("--- 1. BROWSER RENDERING PIPELINE SIMULATION ---");

class BrowserPipelineSimulator {
  static parseHTML(htmlString) {
    console.log(`[1. HTML Parsing] Parsing HTML bytes into DOM Node Tree...`);
    // Simulated DOM node
    return {
      nodeType: "ELEMENT_NODE",
      tagName: "H1",
      attributes: { id: "welcome-title", class: "hero-text" },
      textContent: "Welcome to React Rendering!",
    };
  }

  static parseCSS(cssRules) {
    console.log(`[2. CSSOM Construction] Parsing CSS rules into CSS Object Model...`);
    return {
      color: "#2563EB",
      fontSize: "32px",
      margin: "16px",
      display: "block",
    };
  }

  static calculateLayout(domNode, styles) {
    console.log(`[3. Layout / Reflow] Computing box geometry (x, y, width, height)...`);
    return {
      x: 100,
      y: 150,
      width: 480,
      height: 48,
      styles,
    };
  }

  static paintAndComposite(layoutBox) {
    console.log(`[4. Painting & Compositing] Drawing pixels onto GPU layers...`);
    return {
      paintedPixels: `${layoutBox.width}x${layoutBox.height}`,
      rasterizedColor: layoutBox.styles.color,
      renderStatus: "VISIBLE_ON_SCREEN",
    };
  }
}

// Running the pipeline:
const rawHtml = `<h1 id="welcome-title" class="hero-text">Welcome to React Rendering!</h1>`;
const cssRules = `h1 { color: #2563EB; font-size: 32px; margin: 16px; }`;

const domNode = BrowserPipelineSimulator.parseHTML(rawHtml);
const cssom = BrowserPipelineSimulator.parseCSS(cssRules);
const layoutBox = BrowserPipelineSimulator.calculateLayout(domNode, cssom);
const paintResult = BrowserPipelineSimulator.paintAndComposite(layoutBox);

console.log("\nFinal Painted Screen Output:", paintResult);


// ============================================================================
// SECTION 2: HOW REACT MAPS JSX TO BROWSER DOM
// ============================================================================
console.log("\n--- 2. HOW REACT TRANSFORMS JSX INTO DOM ---");

/**
 * When you write:
 * const element = <h1 className="title">Hello World</h1>;
 *
 * The compiler (Babel / SWC) transforms it into:
 * const element = React.createElement('h1', { className: 'title' }, 'Hello World');
 *
 * Which evaluates to a plain JavaScript Object:
 */
const simulatedReactElement = {
  $$typeof: Symbol.for("react.element"), // Security tag against JSON injection!
  type: "h1",
  key: null,
  ref: null,
  props: {
    className: "title",
    children: "Hello World",
  },
  _owner: null,
};

console.log("Simulated React Element Object Descriptor:");
console.log(simulatedReactElement);


// ============================================================================
// SECTION 3: PIPELINE STAGES COMPARISON CHEAT SHEET
// ============================================================================
console.log("\n--- 3. RENDERING TERMINOLOGY CHEAT SHEET ---");

const renderingStages = [
  {
    Stage: "React Rendering",
    ExecutedBy: "React Engine (V8)",
    WhatItDoes: "Calls component functions, compares element descriptors (diffing).",
  },
  {
    Stage: "DOM Commit",
    ExecutedBy: "ReactDOM",
    WhatItDoes: "Mutates actual browser DOM nodes (e.g. node.textContent = 'new').",
  },
  {
    Stage: "Layout (Reflow)",
    ExecutedBy: "Browser Layout Engine",
    WhatItDoes: "Recalculates geometric dimensions and positions of all elements.",
  },
  {
    Stage: "Painting",
    ExecutedBy: "Browser GPU / Skia",
    WhatItDoes: "Fills in pixels, text glyphs, shadows, and images onto screen.",
  },
];

console.table(renderingStages);

console.log("\nModule 01 loaded and executed successfully.");

