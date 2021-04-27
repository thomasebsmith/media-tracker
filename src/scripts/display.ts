import {columns, rows, Row, Sort} from "./data";
import * as dom from "./dom";

function display(containerEl: HTMLElement) {
  const tableEl = dom.create("table");

  const headerRow = dom.create("tr");
  for (const column of Object.values(columns)) {
    headerRow.appendChild(dom.create("th", {text: column.name}));
  }
  tableEl.appendChild(headerRow);

  // TODO: Make this customizable.
  const sort: Sort = [
    ["rating", true],
    ["type", false],
    ["title", false],
    ["creators", false],
  ];
  const maxRows = 100;

  const dataToShow = rows.sort(sort).take(maxRows);

  for (const row of dataToShow) {
    const rowEl = dom.create("tr");

    // We need the `as` since TS doesn't support reflection.
    for (const key of Object.keys(columns) as (keyof Row)[]) {
      rowEl.appendChild(dom.create("td", {text: `${row[key]}`}));
    }
    tableEl.appendChild(rowEl);
  }

  containerEl.appendChild(tableEl);
}

export default display;
