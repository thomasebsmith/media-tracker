import {getData} from "./storage";

interface Row {
  id: number,
  type: string,
  title: string,
  creators: string,
  rating: number,
}

interface Column {
  display: boolean,
  name: string,
}

type Sort = [key: keyof Row, descending: boolean][];

const columns: {[key in keyof Row]: Column} = {
  id: {
    display: false,
    name: "ID",
  },
  type: {
    display: true,
    name: "Type",
  },
  title: {
    display: true,
    name: "Title",
  },
  creators: {
    display: true,
    name: "Creators",
  },
  rating: {
    display: true,
    name: "Rating",
  },
};

const columnKeys = Object.keys(columns) as (keyof Row)[];

class Data {
  data: Row[];

  constructor(data: Row[] | null = null) {
    if (data === null) {
      this.data = getData();
    } else {
      this.data = data;
    }
  }

  take(n: number) {
    return new Data(this.data.slice(0, n));
  }

  drop(n: number) {
    return new Data(this.data.slice(n));
  }

  // Sorts the data, starting by the first (most important)
  //  columns in columnKeys.
  sort(columnKeys: Sort) {
    const toBeSorted = this.data.slice();
    toBeSorted.sort((a, b) => {
      for (const [key, descending] of columnKeys) {
        const reverseMultiplier = descending ? -1 : 1;
        if (a[key] < b[key]) {
          return -1 * reverseMultiplier;
        } else if (a[key] > b[key]) {
          return 1 * reverseMultiplier;
        }
      }
      return 0;
    });
    return new Data(toBeSorted);
  }

  [Symbol.iterator]() {
    return this.data[Symbol.iterator]();
  }
}

const rows = new Data();

export {columnKeys, columns, rows};
export type {Column, Row, Sort};
