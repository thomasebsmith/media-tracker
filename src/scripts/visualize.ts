import {rows} from "./data";
import * as dom from "./dom";
import {showPopup} from "./popup";

function visualizeData(): void {
  showPopup(container => {
    const heading = dom.create("h1");
    heading.textContent = "Your media";
    container.appendChild(heading);

    // TODO
    const description = dom.create("p");
    description.textContent = rows.length + " items";
    container.appendChild(description);
  });
}

export {visualizeData};
