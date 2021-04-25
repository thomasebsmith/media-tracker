import type {Row} from "./data";

const prefix = "/media-tracker/";

function getRaw(key: string): string | null {
  return localStorage.getItem(prefix + key);
}

function setRaw(key: string, value: string) {
  localStorage.setItem(prefix + key, value);
}

function getJSON(key: string): object | null {
  const jsonString = getRaw(key);
  if (jsonString === null) {
    return null;
  }
  return JSON.parse(jsonString);
}

function setJSON(key: string, object: object) {
  setRaw(key, JSON.stringify(object));
}

const dataKey = "data";

function getData(): Row[] {
  return getJSON(dataKey) as Row[] ?? [];
}

function setData(data: Row[]): void {
  if (!Array.isArray(data)) {
    throw Error("Invalid data to be stored");
  }
  setJSON(dataKey, data);
}

export {getData, setData};
