/**
 * ============================================================================
 * MODULE 02: Real DOM & The DOM Tree Architecture
 * ============================================================================
 *
 * 1. THE "WHY" & CORE DEFINITION
 * ----------------------------------------------------------------------------
 * DOM stands for Document Object Model.
 * It is an object-oriented programming interface provided by the browser that 
 * represents an HTML document as a structured hierarchy (tree) of JavaScript objects.
 *
 * When a web browser downloads an HTML file:
 *   <!DOCTYPE html>
 *   <html>
 *     <body>
 *       <div id="root">
 *         <h1>Hello World</h1>
 *       </div>
 *     </body>
 *   </html>
 *
 * The browser's C++ engine parses every tag and builds a tree structure in memory:
 * Document -> HTML -> BODY -> DIV (#root) -> H1 -> "Hello World" (Text Node)
 *
 *
 * 2. PHP / LARAVEL ANALOGY
 * ----------------------------------------------------------------------------
 * - In PHP / Laravel:
 *   PHP developers think in terms of arrays and nested associative dictionaries:
 *   $menu = ['Home' => '/', 'Products' => ['Laptops' => '/laptops', 'Phones' => '/phones']];
 *   Once rendered into an HTML string, PHP loses all awareness of the HTML structure.
 *   The server does not keep a living tree in memory.
 *
 * - In JavaScript / The Browser:
 *   The DOM is a LIVING, mutable in-memory graph. You can query any node at any millisecond 
 *   using `document.getElementById('root')`, append new elements, change styles, or remove nodes.
 *
 *
 * 3. TYPES OF DOM NODES
 * ----------------------------------------------------------------------------
 * Every node in the DOM tree inherits from the base `Node` interface:
 * 1. Document Node: The root of the entire document (`window.document`).
 * 2. Element Node: HTML tags (`<div>`, `<h1>`, `<button>`).
 * 3. Text Node: The actual text string inside an element (`"Hello World"`).
 * 4. Attribute Node: Properties attached to elements (`id`, `class`, `href`).
 * 5. Comment Node: Comments written in HTML (`<!-- comment -->`).
 *
 *
 * 4. THE COST OF DIRECT DOM MANIPULATION (WHY DIRECT DOM UPDATES ARE EXPENSIVE)
 * ----------------------------------------------------------------------------
 * Reading from and writing to the DOM in vanilla JavaScript or jQuery:
 *   document.getElementById('price').innerText = '$120';
 *
 * Why can this become a bottleneck in large applications?
 * Because whenever an element's text or style changes:
 * 1. The browser invalidates the computed styles of that element.
 * 2. If dimensions change, the browser triggers a REFLOW / LAYOUT recalculation 
 *    that cascades down through all child and sibling elements.
 * 3. The browser triggers a REPAINT to redraw pixels onto the GPU.
 *
 * If you update 50 DOM elements in a loop naively, you might trigger 50 synchronous 
 * layout recalcs (Layout Thrashing). This was the exact historical pain point 
 * that led to the creation of the Virtual DOM!
 * ============================================================================
 */

console.log("==================================================================");
console.log("  MODULE 02: Real DOM & The DOM Tree Architecture");
console.log("==================================================================\n");

// ============================================================================
// SECTION 1: SIMULATING THE DOM TREE IN MEMORY
// ============================================================================
console.log("--- 1. BUILDING AN IN-MEMORY DOM TREE ---");

class DOMNode {
  constructor(nodeType, nodeName, value = null) {
    this.nodeType = nodeType; // 1 = Element, 3 = Text, 8 = Comment
    this.nodeName = nodeName;
    this.nodeValue = value;
    this.attributes = {};
    this.childNodes = [];
    this.parentNode = null;
  }

  appendChild(childNode) {
    childNode.parentNode = this;
    this.childNodes.push(childNode);
    return childNode;
  }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  get textContent() {
    return this.childNodes
      .map((child) => (child.nodeType === 3 ? child.nodeValue : child.textContent))
      .join("");
  }

  set textContent(text) {
    this.childNodes = [new DOMNode(3, "#text", text)];
  }
}

// Constructing a simulated DOM tree:
const documentRoot = new DOMNode(9, "#document");
const html = documentRoot.appendChild(new DOMNode(1, "HTML"));
const body = html.appendChild(new DOMNode(1, "BODY"));
const divRoot = body.appendChild(new DOMNode(1, "DIV"));
divRoot.setAttribute("id", "root");

const heading = divRoot.appendChild(new DOMNode(1, "H1"));
heading.appendChild(new DOMNode(3, "#text", "Shop Inventory"));

const priceParagraph = divRoot.appendChild(new DOMNode(1, "P"));
priceParagraph.setAttribute("class", "product-price");
priceParagraph.appendChild(new DOMNode(3, "#text", "Price: $100"));

console.log(`DOM Tree successfully assembled!`);
console.log(`Root Node: <${divRoot.nodeName} id="${divRoot.attributes.id}">`);
console.log(`Child count of #root: ${divRoot.childNodes.length}`);
console.log(`Text content inside #root: "${divRoot.textContent.trim()}"\n`);


// ============================================================================
// SECTION 2: IMPERATIVE VS DECLARATIVE DOM UPDATES
// ============================================================================
console.log("--- 2. IMPERATIVE DOM UPDATES (JQUERY / VANILLA JS) ---");

/**
 * ❌ IMPERATIVE (Old Way):
 * You tell the browser step-by-step HOW to find and modify the node.
 */
function updatePriceImperatively(newPrice) {
  console.log(`[Imperative] 1. Searching DOM tree for <p class="product-price">...`);
  const targetNode = divRoot.childNodes.find((n) => n.attributes.class === "product-price");
  console.log(`[Imperative] 2. Found element: <${targetNode.nodeName}>`);
  console.log(`[Imperative] 3. Mutating nodeValue from "${targetNode.textContent}" to "Price: $${newPrice}"`);
  targetNode.textContent = `Price: $${newPrice}`;
}

updatePriceImperatively(120);
console.log(`Updated DOM textContent: "${divRoot.textContent.trim()}"\n`);


// ============================================================================
// SECTION 3: DOM NODE TYPES CHEAT SHEET
// ============================================================================
console.log("--- 3. DOM NODE TYPES CHEAT SHEET ---");

const domNodeTypes = [
  {
    NodeType: 1,
    Name: "Element Node",
    Examples: "<div>, <h1>, <button>, <section>",
    Role: "Represents an HTML tag with attributes and children.",
  },
  {
    NodeType: 3,
    Name: "Text Node",
    Examples: "'Hello World', 'Price: $100'",
    Role: "Holds textual content inside elements (cannot have child nodes).",
  },
  {
    NodeType: 8,
    Name: "Comment Node",
    Examples: "<!-- Next.js Suspense boundary -->",
    Role: "Represents comments in markup; used by React as placeholder markers.",
  },
  {
    NodeType: 9,
    Name: "Document Node",
    Examples: "window.document",
    Role: "The root owner of all elements in the browser window.",
  },
];

console.table(domNodeTypes);

console.log("\nModule 02 loaded and executed successfully.");

