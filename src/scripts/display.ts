import {columnKeys, columns, rows, Row, Sort} from "./data";
import * as dom from "./dom";
import {assert} from "./standard";

const displayColumnKeys = columnKeys.filter(key => columns[key].display);
const displayColumns = Object.values(columns).filter(col => col.display);

const numHeaderRows = 1;

/*
 * Moves the user's selection at most rightOffset cells to the right and
 * at most downOffset cells downward, if the user has a cell selected.
 *
 * Note: Moves may occur by other means, e.g. if the user presses [tab].
 */
function move(rightOffset: number, downOffset: number) {
  rightOffset = Math.round(rightOffset);
  downOffset = Math.round(downOffset);

  const selectedCell = document.activeElement;
  if (selectedCell === null ||
      selectedCell.tagName.toLowerCase() !== "td") {
    return;
  }

  const containingRow = selectedCell.parentElement;
  assert(containingRow !== null);
  assert(containingRow.tagName.toLowerCase() === "tr");

  let columnNum = Array.prototype.indexOf.call(
    containingRow.children,
    selectedCell
  );
  assert(columnNum !== -1);

  const containingTable = containingRow.parentElement;
  assert(containingTable !== null);
  assert(containingTable.tagName.toLowerCase() === "table");

  let rowNum = Array.prototype.indexOf.call(
    containingTable.children,
    containingRow
  );
  assert(rowNum !== -1);

  columnNum += rightOffset;
  rowNum += downOffset;

  // Constrain rowNum to the existing rows (and not the header row).
  rowNum = Math.min(containingTable.children.length - 1, rowNum);
  rowNum = Math.max(numHeaderRows, rowNum);
  const newRow = containingTable.children[rowNum];

  // Constrain columnNum to existing columns.
  columnNum = Math.min(newRow.children.length - 1, columnNum);
  columnNum = Math.max(0, columnNum);
  const newCell = newRow.children[columnNum];

  assert(newCell instanceof HTMLElement);
  assert(newCell.tagName.toLowerCase() === "td");
  newCell.focus();
}

function createTableCell(
  text?: string,
  options?: dom.CreateOptions
): HTMLElement {
  const colEl = dom.create("td", Object.assign({
    editable: true,
    spellcheck: false,
    text: text,
  }, options ?? {}));

  colEl.addEventListener("keydown", (event) => {
    const selection = getSelection();
    let isAtLeft = false;
    let isAtRight = false;
    if (selection !== null && selection.rangeCount === 1) {
      const range = selection.getRangeAt(0);
      if (range.startContainer == range.endContainer) {
        const node = range.startContainer;
        isAtLeft = range.startOffset === 0;
        isAtRight = range.endOffset === node.textContent?.length ?? 0;
      }
    }

    switch (event.key) {
      case "ArrowUp":
        move(0, -1);
        event.preventDefault();
        break;
      case "ArrowDown":
        move(0, 1);
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (isAtLeft) {
          move(-1, 0);
          event.preventDefault();
        }
        break;
      case "ArrowRight":
        if (isAtRight) {
          move(1, 0);
          event.preventDefault();
        }
        break;
    }
  });

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

document.addEventListener("focusin", (event) => {
  const cell = event.target;
  if (!(cell instanceof HTMLElement) ||
      cell.tagName.toLowerCase() !== "td") {
    return;
  }

  const selection = getSelection();
  assert(selection !== null);
  assert(selection.anchorNode !== null);
  selection.removeAllRanges();

  assert(cell.childNodes.length <= 1);
  const toFocus =
    cell.childNodes.length === 0 ? cell : cell.childNodes[0];

  const range = document.createRange();
  range.setStart(toFocus, 0);
  range.setEnd(toFocus, toFocus.textContent?.length ?? 0);
  selection.addRange(range);
});

export default display;
