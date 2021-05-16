import {lastOfSplit} from "./type-utils";

type CreateData = {[key: string]: string|undefined};

interface CreateOptions {
  classes?: string[],
  data?: CreateData,
  editable?: boolean|"true"|"false"|"inherit",
  id?: string,
  popupText?: string,
  spellcheck?: boolean,
  text?: string,
}

type ElementTypeByTagName = {
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
  "a": HTMLAnchorElement,
  "br": HTMLBRElement,
  "data": HTMLDataElement,
  "q": HTMLQuoteElement,
  "span": HTMLSpanElement,
  "time": HTMLTimeElement,
  "area": HTMLAreaElement,
  "audio": HTMLAudioElement,
  "img": HTMLImageElement,
  "map": HTMLMapElement,
  "track": HTMLTrackElement,
  "video": HTMLVideoElement,
  "embed": HTMLEmbedElement,
  "iframe": HTMLIFrameElement,
  "object": HTMLObjectElement,
  "param": HTMLParamElement,
  "picture": HTMLPictureElement,
  "source": HTMLSourceElement,
  "canvas": HTMLCanvasElement,
  "script": HTMLScriptElement,
  "del": HTMLModElement,
  "ins": HTMLModElement,
  "caption": HTMLTableCaptionElement,
  "col": HTMLTableColElement,
  "colgroup": HTMLTableColElement,
  "table": HTMLTableElement,
  "tbody": HTMLTableSectionElement,
  "td": HTMLTableCellElement,
  "tfoot": HTMLTableSectionElement,
  "th": HTMLTableCellElement,
  "thead": HTMLTableSectionElement,
  "tr": HTMLTableRowElement,
  "button": HTMLButtonElement,
  "datalist": HTMLDataListElement,
  "fieldset": HTMLFieldSetElement,
  "form": HTMLFormElement,
  "input": HTMLInputElement,
  "label": HTMLLabelElement,
  "legend": HTMLLegendElement,
  "meter": HTMLMeterElement,
  "optgroup": HTMLOptGroupElement,
  "option": HTMLOptionElement,
  "output": HTMLOutputElement,
  "progress": HTMLProgressElement,
  "select": HTMLSelectElement,
  "textarea": HTMLTextAreaElement,
  "details": HTMLDetailsElement,
  "dialog": HTMLDialogElement,
  "menu": HTMLMenuElement,
  "slot": HTMLSlotElement,
  "template": HTMLTemplateElement,
};

type CreatedElement<TypeString extends string> =
  TypeString extends keyof ElementTypeByTagName ?
    ElementTypeByTagName[TypeString] :
    HTMLElement;

type SelectedElement<SelectString extends string> =
  lastOfSplit<SelectString, " "> extends keyof ElementTypeByTagName ?
    ElementTypeByTagName[lastOfSplit<SelectString, " ">] :
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
  if (typeof options.id === "string") {
    el.setAttribute("id", options.id);
  }
  if (typeof options.popupText === "string") {
    el.setAttribute("title", options.popupText);
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

function select<SelectString extends string>(
  selector: SelectString
): SelectedElement<SelectString> | null {
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
