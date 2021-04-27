import {getData} from "./storage";

interface Row {
  type: string,
  title: string,
  creators: string,
  rating: number,
}

interface Column {
  name: string,
}

const columns: {[key in keyof Row]: Column} = {
  type: {
    name: "Type",
  },
  title: {
    name: "Title",
  },
  creators: {
    name: "Creators",
  },
  rating: {
    name: "Rating",
  },
};

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

  // Sorts the data by columnKey, by default ascending.
  sort(columnKey: keyof Row, descending: boolean = false) {
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

  [Symbol.iterator]() {
    return this.data[Symbol.iterator]();
  }
}

const rows = new Data();

export {columns, rows};
export type {Column, Row};
