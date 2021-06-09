import {
  columns,
  rows,
  register,
  takeID,
  updateRowWithSameID
} from "./data";
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
  register,
  takeID,
  updateRowWithSameID,
  getData,
  setData,
  getNextID,
  setNextID,
  getCommittedBackup,
  commitBackup,
});
export default cli;
