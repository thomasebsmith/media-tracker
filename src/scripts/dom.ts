interface CreateOptions {
  text?: string
}

function create(
  type: string,
  options: CreateOptions = Object.create(null)
): HTMLElement {
  const el = document.createElement(type);
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
export type {CreateOptions};
