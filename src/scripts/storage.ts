import type {Row} from "./data";
import {assert} from "./standard";

const prefix = "/media-tracker/";

type JSON = any;

function getRaw(key: string): string | null {
  return localStorage.getItem(prefix + key);
}

function setRaw(key: string, value: string) {
  localStorage.setItem(prefix + key, value);
}

function getJSON(key: string): JSON {
  const jsonString = getRaw(key);
  if (jsonString === null) {
    return null;
  }
  return JSON.parse(jsonString);
}

function setJSON(key: string, object: JSON) {
  setRaw(key, JSON.stringify(object));
}

const dataKey = "data";
const nextIDKey = "nextID";

function getData(): Row[] {
  return getJSON(dataKey) as Row[] ?? [];
}

function setData(data: Row[]): void {
  assert(Array.isArray(data), "Invalid data to be stored");
  setJSON(dataKey, data);
}

function getNextID(): number {
  return getJSON(nextIDKey) as number ?? 0;
}

function setNextID(newNextID: number): void {
  assert(typeof newNextID === "number", "Invalid next ID to be stored");
  setJSON(nextIDKey, newNextID);
}

interface Backup {
  [dataKey]: Row[],
  [nextIDKey]: number,
}

function getCommittedBackup(): Backup {
  return {
    [dataKey]: getData(),
    [nextIDKey]: getNextID(),
  };
}

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
