import {columnKeys, columns, rows, Row, Sort} from "./data";
import * as dom from "./dom";
import {assert} from "./standard";

const displayColumnKeys = columnKeys.filter(key => columns[key].display);
const displayColumns = Object.values(columns).filter(col => col.display);

function createTableCell(
  text?: string,
  options?: dom.CreateOptions
): HTMLElement {
  const colEl = dom.create("td", Object.assign({
    editable: true,
    spellcheck: false,
    text: text,
  }, options ?? {}));
  return colEl;
}

function addRowForNewEntry(tableEl: HTMLElement) {
  let thisIsLastRow = true;

  const editRowEl = dom.create("tr", {classes: ["new"]});
  for (let i = 0; i < displayColumnKeys.length; ++i) {
    const colEl = createTableCell();
    colEl.addEventListener("input", () => {
      if (colEl.textContent !== "" && thisIsLastRow) {
        thisIsLastRow = false;
        addRowForNewEntry(tableEl);
      }
    });
    editRowEl.appendChild(colEl);
  }
  tableEl.appendChild(editRowEl);

}

function display(containerEl: HTMLElement) {
  const tableEl = dom.create("table");

  const headerRow = dom.create("tr");
  for (const column of displayColumns) {
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
    const rowEl = dom.create("tr", {
      data: {
        id: `${row.id}`,
      },
    });

    // We need the `as` since TS doesn't support reflection.
    for (const key of displayColumnKeys) {
      rowEl.appendChild(createTableCell(`${row[key]}`));
    }
    tableEl.appendChild(rowEl);
  }

  addRowForNewEntry(tableEl);
  
  containerEl.appendChild(tableEl);
}

export default display;
