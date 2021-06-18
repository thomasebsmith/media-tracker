import cli from "./cli";
import displayControls from "./controls";
import display from "./display";
import * as dom from "./dom";
import {fatalError} from "./standard";

declare global {
  interface Window {
    cli: typeof cli,
  }
}

window.cli = cli;
displayControls(
  dom.select(".controls") ?? fatalError("Could not find .controls"));
display(dom.select(".data") ?? fatalError("Could not find .data"));
