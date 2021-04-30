type CreateData = {[key: string]: string|undefined};

interface CreateOptions {
  classes?: string[],
  data?: CreateData,
  editable?: boolean|"true"|"false"|"inherit",
  spellcheck?: boolean,
  text?: string,
}

function create(
  type: string,
  options: CreateOptions = Object.create(null)
): HTMLElement {
  const el = document.createElement(type);
  if (Array.isArray(options.classes)) {
    for (const theClass of options.classes) {
      el.classList.add(theClass);
    }
  }
  if (typeof options.data === "object") {
    for (const [key, value] of Object.entries(options.data)) {
      if (typeof value === "string") {
        el.dataset[key] = value;
      }
    }
  }
  if (typeof options.editable === "boolean") {
    el.contentEditable = `${options.editable}`;
  } else if (typeof options.editable === "string") {
    el.contentEditable = options.editable;
  }
  if (typeof options.spellcheck === "boolean") {
    el.spellcheck = options.spellcheck;
  }
  if (typeof options.text === "string") {
    el.textContent = options.text;
  }
  return el;
}

function findAncestorElement(
  node: Node,
  selector: string
): Element | null {
  let traversalNode: Node | null = node;
  do {
    if (traversalNode instanceof Element) {
      return traversalNode.closest(selector);
    }
    traversalNode = traversalNode.parentNode;
  } while (traversalNode !== null);
  return null;
}

function isLeftmost(node: Node, inNode: Node): boolean {
  let traversalNode: Node | null = node;
  do {
    if (traversalNode === inNode) {
      return true;
    }
    if (traversalNode.previousSibling !== null) {
      return false;
    }
    traversalNode = traversalNode.parentNode;
  } while (traversalNode !== null);
  return false;
}

function isRightmost(node: Node, inNode: Node): boolean {
  let traversalNode: Node | null = node;
  do {
    if (traversalNode === inNode) {
      return true;
    }
    if (traversalNode.nextSibling !== null) {
      return false;
    }
    traversalNode = traversalNode.parentNode;
  } while (traversalNode !== null);
  return false;
}

function select(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

function selectAll(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}
 
export {
  create,
  findAncestorElement,
  isLeftmost,
  isRightmost,
  select,
  selectAll
};
export type {CreateData, CreateOptions};
