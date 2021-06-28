import * as dom from "./dom";
import {fatalError} from "./standard";

type PopupHandler = (popupContainer: HTMLElement, close: () => void) => void;

function showPopup(popupHandler: PopupHandler): void {
  const body = dom.select("body") ?? fatalError("body not found");
  const shadowEl = dom.create("div");
  shadowEl.classList.add("overlay-shadow");

  const internalEl = dom.create("div");
  internalEl.classList.add("overlay-internal");

  const closeButtonContainer = dom.create("nav");
  closeButtonContainer.classList.add("nav-right");

  const closeButton = dom.create("button");
  closeButton.classList.add("close");

  const container = dom.create("div");
  container.classList.add("overlay");
  container.setAttribute("role", "dialog");

  closeButtonContainer.appendChild(closeButton);
  container.appendChild(closeButtonContainer);
  internalEl.appendChild(container);
  shadowEl.appendChild(internalEl);
  body.appendChild(shadowEl);

  let closed = false;
  function close() {
    if (!closed) {
      // TODO: Add a transition here
      body.removeChild(shadowEl);
      closed = true;
    }
  }

  closeButton.addEventListener("click", () => close());

  popupHandler(container, close);
}

export {showPopup};
export type {PopupHandler};
