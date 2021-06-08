import {columns, rows} from "./data";
import {
  getData,
  setData,
  getNextID,
  setNextID,
  getCommittedBackup,
  commitBackup
} from "./storage";

const cli = Object.freeze({
  columns,
  rows,
  getData,
  setData,
  getNextID,
  setNextID,
  getCommittedBackup,
  commitBackup,
});
export default cli;
