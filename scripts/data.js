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
    {
      name: "Rating",
      key: "rating",
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

    // Sorts the data by columnKey, by default ascending.
    sort(columnKey, descending = false) {
      const toBeSorted = this.data.slice();
      const reverseMultiplier = descending ? -1 : 1;
      toBeSorted.sort((a, b) => {
        if (a[columnKey] < b[columnKey]) {
          return -1 * reverseMultiplier;
        } else if (a[columnKey] > b[columnKey]) {
          return 1 * reverseMultiplier;
        } else {
          return 0;
        }
      });
      return new Data(toBeSorted);
    }
  }

  const rows = new Data();

  global.data = {
    columns,
    rows,
  };
  
  loadComplete("data");
})(window);
