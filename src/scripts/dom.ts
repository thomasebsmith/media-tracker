type CreateData = {[key: string]: string|undefined};

interface CreateOptions {
  classes?: string[],
  data?: CreateData,
  editable?: boolean|"true"|"false"|"inherit",
  spellcheck?: boolean,
  text?: string,
}

type CreatedElementDict = {
  "html": HTMLHtmlElement,
  "base": HTMLBaseElement,
  "head": HTMLHeadElement,
  "link": HTMLLinkElement,
  "meta": HTMLMetaElement,
  "style": HTMLStyleElement,
  "title": HTMLTitleElement,
  "body": HTMLBodyElement,
  "h1": HTMLHeadingElement,
  "h2": HTMLHeadingElement,
  "h3": HTMLHeadingElement,
  "h4": HTMLHeadingElement,
  "h5": HTMLHeadingElement,
  "h6": HTMLHeadingElement,
  "blockquote": HTMLQuoteElement,
  "div": HTMLDivElement,
  "dl": HTMLDListElement,
  "hr": HTMLHRElement,
  "li": HTMLLIElement,
  "ol": HTMLOListElement,
  "p": HTMLParagraphElement,
  "pre": HTMLPreElement,
  "ul": HTMLUListElement,
  "td": HTMLTableCellElement,
  "tr": HTMLTableRowElement,
  "table": HTMLTableElement,
};

type CreatedElement<TypeString> =
  TypeString extends keyof CreatedElementDict ?
    CreatedElementDict[TypeString] :
    HTMLElement;

function create<TypeString extends string>(
  type: TypeString,
  options: CreateOptions = Object.create(null)
): CreatedElement<Lowercase<TypeString>> {
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
  return el as CreatedElement<Lowercase<TypeString>>;
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
