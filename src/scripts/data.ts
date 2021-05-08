import {assert} from "./standard";
import {getData, setData, getNextID, setNextID} from "./storage";

interface Row {
  readonly id: number,
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

const dataArray = getData();
const dataIDMap = new Map();

let nextID = getNextID();

function takeID(): number {
  ++nextID;
  return nextID - 1;
}

for (let i = 0; i < dataArray.length; ++i) {
  dataIDMap.set(dataArray[i].id, i);
}

function updateRow(row: Row) {
  const index = dataIDMap.get(row.id);
  if (index !== undefined) {
    // Clients of this module should *not* replace existing Row objects.
    // Row objects must be modified in place.
    assert(dataArray[index] == row);
  } else {
    const newIndex = dataArray.push(row) - 1;
    dataIDMap.set(row.id, newIndex);
  }
}

function saveUpdates() {
  setData(dataArray);
  setNextID(nextID);
}

class Data {
  data: Row[];

  constructor(data: Row[] | null = null) {
    if (data === null) {
      this.data = dataArray;
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

  append(row: Row) {
    return new Data(this.data.concat([row]));
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

  update() {
    for (const row of this.data) {
      updateRow(row);
    }
    saveUpdates();
  }

  [Symbol.iterator]() {
    return this.data[Symbol.iterator]();
  }
}

const rows = new Data();

export {columnKeys, columns, rows, takeID};
export type {Column, Row, Sort};
