(function(global) {
  const prefix = "/media-tracker/";

  function getRaw(key) {
    return localStorage.getItem(prefix + key);
  }

  function setRaw(key, value) {
    localStorage.setItem(prefix + key, value);
  }

  function getJSON(key) {
    const jsonString = getRaw(key);
    if (jsonString === null) {
      return null;
    }
    return JSON.parse(jsonString);
  }

  function setJSON(key, object) {
    setRaw(key, JSON.stringify(object));
  }

  const dataKey = "data";

  function getData() {
    return getJSON(dataKey) ?? [];
  }

  function setData(data) {
    if (!Array.isArray(data)) {
      throw Error("Invalid data to be stored");
    }
    return setJSON(dataKey, data);
  }

  global.storage = {
    getData,
    setData,
  };

  loadComplete("storage");
})(window);
