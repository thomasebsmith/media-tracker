import {
  columnKeys,
  columns,
  columnFromString,
  register,
  rows,
  takeID,
  updateRowWithSameID,
  Row,
  Sort
} from "./data";
import * as dom from "./dom";
import {assert} from "./standard";

const displayColumnKeys = columnKeys.filter(key => columns[key].display);
const displayColumns = Object.values(columns).filter(col => col.display);

const numHeaderRows = 1;

let dirty = false;

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
  return colEl;
}

function getRow(rowEl: HTMLElement): Row {
  const idString = rowEl.dataset.id ?? "";

  const row: Record<string, any> = {
    id: idString,
  };

  for (let i = 0; i < displayColumnKeys.length; ++i) {
    const key = displayColumnKeys[i];
    const cellEl = rowEl.children[i];
    row[key] = cellEl.textContent;
  }

  for (const key of columnKeys) {
    const result = columnFromString(row[key], key);
    // TODO: Better error handling
    assert(result.hasValue);
    row[key] = result.value;
  }

  return row as Row;
}

function addRowForNewEntry(
  tableEl: HTMLElement,
  addRow: (row: Row) => void
) {
  const editRowEl = dom.create("tr", {classes: ["new"]});
  const listener = (event: Event) => {
    assert(event.target instanceof HTMLElement);
    if (event.target.textContent !== "") {
      editRowEl.dataset.id = takeID().toString();
      addRow(getRow(editRowEl));

      editRowEl.classList.remove("new");
      addRowForNewEntry(tableEl, addRow);
      editRowEl.removeEventListener("input", listener);
    }
  };
  editRowEl.addEventListener("input", listener);

  for (let i = 0; i < displayColumnKeys.length; ++i) {
    const colEl = createTableCell();
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

  tableEl.addEventListener("input", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    const rowEl = dom.findAncestorElement(event.target, "tr");
    if (rowEl === null) {
      return;
    }
    assert(rowEl instanceof HTMLElement);

    // TODO: This is sub-optimal.
    dirty = true;

    // TODO: Update this row
    updateRowWithSameID(getRow(rowEl));
  });


  // TODO: Make this customizable.
  const sort: Sort = [
    ["rating", true],
    ["type", false],
    ["title", false],
    ["creators", false],
    ["id", false],
  ];
  const maxRows = 100;

  let dataToShow = rows.sort(sort).take(maxRows);

  function addRow(row: Row) {
    register(row);
    dataToShow = dataToShow.append(row);
  }
  function saveRows() {
    if (dirty) {
      dataToShow.update();
      dirty = false;
    }
  }
  setInterval(() => saveRows(), 10 * 1000);
  window.addEventListener("beforeunload", () => {
    saveRows();
  });

  for (const row of dataToShow) {
    const rowEl = dom.create("tr", {
      data: {
        id: `${row.id}`,
      },
    });

    for (const key of displayColumnKeys) {
      rowEl.appendChild(createTableCell(`${row[key]}`));
    }
    tableEl.appendChild(rowEl);
  }

  addRowForNewEntry(tableEl, addRow);
  
  containerEl.appendChild(tableEl);
}

document.addEventListener("focusin", (event) => {
  const cell = event.target;
  if (!(cell instanceof HTMLElement) ||
      cell.tagName.toLowerCase() !== "td") {
    return;
  }

  if (cell.textContent !== null && cell.textContent?.length !== 0) {
    const selection = getSelection();
    assert(selection !== null);
    selection.removeAllRanges();

    const range = document.createRange();
    range.selectNodeContents(cell);
    selection.addRange(range);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.shiftKey) {
    return;
  }

  if (!(event.target instanceof HTMLElement) ||
      event.target.tagName.toLowerCase() !== "td") {
    return;
  }

  const selection = getSelection();
  let isAtLeft = false;
  let isAtRight = false;
  if (selection !== null && selection.rangeCount === 1) {
    const range = selection.getRangeAt(0);
    const containingTD = dom.findAncestorElement(
      range.commonAncestorContainer,
      "td"
    );
    if (containingTD !== null) {
      isAtLeft = range.startOffset === 0 && dom.isLeftmost(
        range.startContainer,
        containingTD
      );
      const end = range.endContainer;
      if (end instanceof Text ||
          end instanceof Comment ||
          end instanceof CDATASection) {
        isAtRight = range.endOffset === end.textContent?.length ?? 0;
      } else {
        let minEndOffset = end.childNodes.length;
        for (let i = end.childNodes.length - 1; i >= 0; --i) {
          if ((end.childNodes[i]?.textContent ?? "") === "") {
            --minEndOffset;
          } else {
            break;
          }
        }
        isAtRight = range.endOffset >= minEndOffset;
      }
      isAtRight &&= dom.isRightmost(end, containingTD);
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
    case "Enter":
      move(0, 1);
      event.preventDefault();
      break;
    case "Escape":
      selection?.removeAllRanges();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      event.preventDefault();
      break;
  }
});

export default display;
