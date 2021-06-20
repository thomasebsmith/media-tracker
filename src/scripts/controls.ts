import * as dom from "./dom";
import {fatalError} from "./standard";
import {getCommittedBackup, commitBackup} from "./storage";

function displayControls(controlsEl: HTMLElement): void {
  const saveBackupEl = dom.create("button");
  saveBackupEl.textContent = "Save Backup";
  saveBackupEl.addEventListener("click", () => {
    const backup = JSON.stringify(getCommittedBackup());
    const backupBlob = new Blob([backup], {type: "application/json"});
    const downloadURL = URL.createObjectURL(backupBlob);
    const downloadLink = dom.create("a");
    const isoNow = new Date().toISOString();
    downloadLink.setAttribute("download", `backup-${isoNow}.json`);
    downloadLink.setAttribute("href", downloadURL);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
