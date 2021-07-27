import type {Row} from "./data";
import {assert} from "./standard";

const prefix = "/media-tracker/";

type JSON = any;

// Get an item from local storage associated with this webapp.
function getRaw(key: string): string | null {
  return localStorage.getItem(prefix + key);
}

// Set an item in local storage associated with this webapp.
function setRaw(key: string, value: string) {
  localStorage.setItem(prefix + key, value);
}

// Get an item in local storage as JSON.
function getJSON(key: string): JSON {
  const jsonString = getRaw(key);
  if (jsonString === null) {
    return null;
  }
  return JSON.parse(jsonString);
}

// Set an item in local storage to be some JSON.
function setJSON(key: string, object: JSON) {
  setRaw(key, JSON.stringify(object));
}

const dataKey = "data";
const nextIDKey = "nextID";

// Get all tracked media from local storage.
function getData(): Row[] {
  return getJSON(dataKey) as Row[] ?? [];
}

// Set the media tracked in local storage.
function setData(data: Row[]): void {
  assert(Array.isArray(data), "Invalid data to be stored");
  setJSON(dataKey, data);
}

// Get the next row ID from local storage.
function getNextID(): number {
  return getJSON(nextIDKey) as number ?? 0;
}

// Set the next row ID in local storage.
function setNextID(newNextID: number): void {
  assert(typeof newNextID === "number", "Invalid next ID to be stored");
  setJSON(nextIDKey, newNextID);
}

interface Backup {
  [dataKey]: Row[],
  [nextIDKey]: number,
}

// Get a backup of all data in local storage for this webapp.
function getCommittedBackup(): Backup {
  return {
    [dataKey]: getData(),
    [nextIDKey]: getNextID(),
  };
}

// Reset local storage to match `backup`.
function commitBackup(backup: Backup): void {
  setData(backup[dataKey]);
  setNextID(backup[nextIDKey]);
}

export {
  getData,
  setData,
  getNextID,
  setNextID,
  getCommittedBackup,
  commitBackup
};
export type {Backup};
