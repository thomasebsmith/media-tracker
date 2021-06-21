import * as dom from "./dom";
import {fatalError} from "./standard";
import {getCommittedBackup, commitBackup} from "./storage";

function displayControl(
  controlsEl: HTMLElement,
  create: (containerEl: HTMLElement) => void
) {
  const containerEl = dom.create("div");
  create(containerEl);
  controlsEl.appendChild(containerEl);
}

function displayControls(controlsEl: HTMLElement): void {
  displayControl(controlsEl, (containerEl: HTMLElement) => {
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
    containerEl.appendChild(saveBackupEl);
  });

  displayControl(controlsEl, (containerEl: HTMLElement) => {
    const controlID = "control-select-backup-file";
    const loadBackupEl = dom.create("label");
    loadBackupEl.textContent = "Load Backup";
    loadBackupEl.setAttribute("for", controlID);
    loadBackupEl.classList.add("button");
    containerEl.appendChild(loadBackupEl);

    const selectBackupFileEl = dom.create("input");
    selectBackupFileEl.setAttribute("id", controlID);
    selectBackupFileEl.setAttribute("type", "file");
    selectBackupFileEl.setAttribute(
      "accept",
      ".json,application/json,text/json"
    );
    selectBackupFileEl.addEventListener("input", () => {
      commitBackup(fatalError("NYI"));
    });
    selectBackupFileEl.classList.add("hidden");
    containerEl.appendChild(selectBackupFileEl);
  });
}

export default displayControls;
