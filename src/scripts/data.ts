import {assert} from "./standard";
import {getData, setData, getNextID, setNextID} from "./storage";
import {none, some, optionalList, Optional} from "./type-utils";

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
  "integer"|
  "float"|
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

function columnTypeIsArray(
  columnType: ColumnType
): columnType is ArrayColumnType {
  return typeof columnType !== "string" && columnType.type === "array";
}

function columnTypeIsUnion(
  columnType: ColumnType
): columnType is UnionColumnType {
  return typeof columnType !== "string" && columnType.type === "union";
}

function columnFromString<ColumnName extends keyof Row>(
  string: string,
  columnName: ColumnName
): Optional<Row[ColumnName]> {
  const type = columns[columnName].type;
  return columnFromStringImpl(
    string,
    type
  ) as Optional<Row[ColumnName]>;
}

function columnFromStringImpl(
  string: string,
  type: ColumnType
): Optional<any> {
  switch (type) {
    case "integer": {
      const result = parseInt(string, 10);
      if (!Number.isFinite(result)) {
        return none();
      }
      return some(result);
    }
    case "float": {
      const result = parseFloat(string);
      if (!Number.isFinite(result)) {
        return none();
      }
      return some(result);
    }
    case "string":
      return some(string);
    case "null":
      return some(null);
    default:
      if (columnTypeIsArray(type)) {
        const parts = string.split(",");
        return optionalList(
          parts.map(part => columnFromStringImpl(part, type.of))
        );
      } else {
        assert(columnTypeIsUnion(type));
        for (const possibility of type.of) {
          const result = columnFromStringImpl(string, possibility);
          if (result.hasValue) {
            return result;
          }
        }
        return none();
      }
  }
}

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
    type: "integer",
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
    type: "float",
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

export {
  columnKeys,
  columns,
  columnFromString,
  register,
  rows,
  takeID,
  updateRowWithSameID
};
export type {Column, Row, Sort};
