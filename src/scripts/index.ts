import cli from "./cli";
import displayControls from "./controls";
import display from "./display";
import * as dom from "./dom";
import {fatalError} from "./standard";

// This is needed so `cli` can be added to `window`.
declare global {
  interface Window {
    cli: typeof cli,
  }
}

window.cli = cli;

// Displays the controls for the main table and the main table itself.
displayControls(
  dom.select(".controls") ?? fatalError("Could not find .controls"));
display(dom.select(".data") ?? fatalError("Could not find .data"));
