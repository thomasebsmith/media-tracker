import {columns, rows} from "./data";
import * as dom from "./dom";

function display(containerEl: HTMLElement) {
  const tableEl = dom.create("table");

  const headerRow = dom.create("tr");
  for (const column of columns) {
    headerRow.appendChild(dom.create("th", {text: column.name}));
  }
  tableEl.appendChild(headerRow);

  // TODO: Make this customizable.
  const sortColumnKey = "title";
  const maxRows = 100;

  const dataToShow = rows.sort(sortColumnKey).take(maxRows);

  for (const row of dataToShow) {
    const rowEl = dom.create("tr");
    for (const column of columns) {
      rowEl.appendChild(dom.create("td", {text: `${row[column.key]}`}));
    }
    tableEl.appendChild(rowEl);
  }

  containerEl.appendChild(tableEl);
}

export default display;
