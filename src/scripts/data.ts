import {assert} from "./standard";
import {getData, setData, getNextID, setNextID} from "./storage";

interface Row {
  readonly id: number,
  type: string,
  title: string,
  creators: string,
  rating: number|null,
}

interface ArrayColumnType {
  type: "array",
  of: ColumnType,
}
interface UnionColumnType {
  type: "union",
  of: [ColumnType, ColumnType],
}
type ColumnType =
  "number"|
  "string"|
  "null"|
  ArrayColumnType|
  UnionColumnType;

interface Column {
  display: boolean,
  name: string,
  type: ColumnType
}

type Sort = [key: keyof Row, descending: boolean][];

function createRow(rowData: Record<string, string>): Row|null {
  const row: Row = {
    id: parseInt(rowData.id),
    type: rowData.type,
    title: rowData.title,
    creators: rowData.creators,
    rating: parseFloat(rowData.rating)
  };
  if (!Number.isFinite(row.id)) {
    return null;
  }
  if (!Number.isFinite(row.rating)) {
    row.rating = null;
  }
  return row;
}

const columns: {[key in keyof Row]: Column} = {
  id: {
    display: false,
    name: "ID",
    type: "number",
  },
  type: {
    display: true,
    name: "Type",
    type: "string",
  },
  title: {
    display: true,
    name: "Title",
    type: "string",
  },
  creators: {
    display: true,
    name: "Creators",
    type: {
      type: "array",
      of: "string",
    },
  },
  rating: {
    display: true,
    name: "Rating",
    type: "number",
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

function updateRowWithSameID(row: Row) {
  const index = dataIDMap.get(row.id);
  assert(index !== undefined);
  // TODO: Why is this needed??
  const toUpdate: any = dataArray[index];
  for (const columnKey of columnKeys) {
    if (columnKey !== "id") {
      toUpdate[columnKey] = row[columnKey];
    }
  }
}

function register(row: Row) {
  assert(dataIDMap.get(row.id) === undefined);

  const newIndex = dataArray.push(row) - 1;
  dataIDMap.set(row.id, newIndex);
}

function updateRow(row: Row) {
  const index = dataIDMap.get(row.id);
  assert(index !== undefined);
  // Clients of this module should *not* replace existing Row objects.
  // Row objects must be modified in place.
  assert(dataArray[index] == row);
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
        if (a[key] === null && b[key] === null) {
          continue;
        } else if (a[key] === null) {
          return -1 * reverseMultiplier;
        } else if (b[key] === null) {
          return 1 * reverseMultiplier;
        } else if (a[key]! < b[key]!) {
          return -1 * reverseMultiplier;
        } else if (a[key]! > b[key]!) {
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

export {columnKeys, columns, register, rows, takeID, updateRowWithSameID};
export type {Column, Row, Sort};
