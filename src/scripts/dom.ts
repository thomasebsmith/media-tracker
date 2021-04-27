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

function select(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

function selectAll(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}
 
export {create, select, selectAll};
export type {CreateData, CreateOptions};
