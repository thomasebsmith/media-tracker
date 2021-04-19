(async function(global) {
  await load(["storage"]);

  const columns = [
    {
      name: "Type",
      key: "type",
    },
    {
      name: "Title",
      key: "title",
    },
    {
      name: "Creators",
      key: "creators",
    },
  ];

  class Data {
    constructor(data = null) {
      if (data === null) {
        this.data = storage.getData();
      } else {
        this.data = data;
      }
    }

    take(n) {
      return new Data(this.data.slice(0, n));
    }

    drop(n) {
      return new Data(this.data.slice(n));
    }
  }

  const rows = new Data();

  global.data = {
    columns,
    rows,
  };
  
  loadComplete("data");
})(window);
