(function(global) {
  function hasProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  function create(type, options = Object.create(null)) {
    const el = document.createElement(type);
    if (hasProp(options, "text")) {
      el.textContent = options.text;
    }
    return el;
  }

  function select(selector) {
    return document.querySelector(selector);
  }

  function selectAll(selector) {
    return document.querySelectorAll(selector);
  }
  
  global.dom = {
    create,
    select,
    selectAll,
  };

  loadComplete("dom");
})(window);
