(async function(global) {
  await load(["data", "dom"]);

  function display(containerEl) {
    const tableEl = dom.create("table");

    const headerRow = dom.create("tr");
    for (const column of data.columns) {
      headerRow.appendChild(dom.create("th", {text: column.name}));
    }
    tableEl.appendChild(headerRow);

    // TODO: Make this customizable.
    const sortColumnKey = "title";
    const maxRows = 100;

    const dataToShow = data.rows.sort(sortColumnKey).take(maxRows);

    for (const row of dataToShow) {
      const rowEl = dom.create("tr");
      for (const column of data.columns) {
        rowEl.appendChild(dom.create("td", {text: row[column.key]}));
      }
      tableEl.appendChild(rowEl);
    }

    containerEl.appendChild(tableEl);
  }

  global.display = display;

  loadComplete("display");
})(window);
