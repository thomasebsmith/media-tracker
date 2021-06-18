import * as dom from "./dom";
import {fatalError} from "./standard";
import {getCommittedBackup, commitBackup} from "./storage";

function displayControls(controlsEl: HTMLElement): void {
  const saveBackupEl = dom.create("button");
  saveBackupEl.textContent = "Save Backup";
  saveBackupEl.addEventListener("click", () => {
    console.log(getCommittedBackup());
    fatalError("NYI");
  });
  controlsEl.appendChild(saveBackupEl);

  const loadBackupEl = dom.create("button");
  loadBackupEl.textContent = "Load Backup";
  loadBackupEl.addEventListener("click", () => {
    commitBackup(fatalError("NYI"));
  });
  controlsEl.appendChild(loadBackupEl);
}

export default displayControls;
