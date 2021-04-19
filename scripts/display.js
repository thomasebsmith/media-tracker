(async function(global) {
  await load(["data", "dom"]);

  function display(containerEl) {
    const tableEl = dom.create("table");

    const headerRow = dom.create("tr");
    for (const column of data.columns) {
      headerRow.appendChild(dom.create("th", {text: column.name}));
    }
    tableEl.appendChild(headerRow);

    containerEl.appendChild(tableEl);
  }

  global.display = display;

  loadComplete("display");
})(window);
