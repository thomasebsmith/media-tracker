(async function(global) {
  await load(["display", "dom"]);

  display(dom.select(".data"));

  loadComplete("index");
})(window);
