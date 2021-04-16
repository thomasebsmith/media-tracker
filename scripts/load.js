(function(global) {
  const loaded = new Set();
  const requested = new Set();
  const waiting = new Map();

  function fulfillCallback(callback, value) {
    try {
      callback(value);
    } catch (_) {}
  }

  function waitForLoad(scriptName, callback) {
    if (loaded.has(scriptName)) {
      fulfillCallback(callback, scriptName);
      return;
    }

    if (!waiting.has(scriptName)) {
      waiting.set(scriptName, []);
    }
    waiting.get(scriptName).push(callback);
  }

  function loadOne(scriptName) {
    if (!requested.has(scriptName)) {
      requested.add(scriptName);

      const scriptEl = document.createElement("script");
      scriptEl.setAttribute("src", `scripts/${scriptName}.js`);
      document.body.appendChild(scriptEl);
    }

    return new Promise((resolve) => {
      waitForLoad(scriptName, resolve);
    });
  }

  function load(scriptNames) {
    if (!Array.isArray(scriptNames)) {
      scriptNames = [`${scriptNames}`];
    }
    for (const name of scriptNames) {
      if (!(/^[a-zA-Z0-9_-]+$/).test(name)) {
        throw Error(`Invalid script name "${name}"`);
      }
    }
    return Promise.all(scriptNames.map(name => loadOne(name)));
  }

  function loadComplete(scriptName) {
    loaded.add(scriptName);
    for (const waiter of waiting.get(scriptName) ?? []) {
      fulfillCallback(waiter, scriptName);
    }
    waiting.delete(scriptName);
  }

  global.load = load;
  global.loadComplete = loadComplete;
})(window);
