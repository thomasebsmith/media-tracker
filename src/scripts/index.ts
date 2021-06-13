import cli from "./cli";
import display from "./display";
import * as dom from "./dom";
import {fatalError} from "./standard";

declare global {
  interface Window {
    cli: typeof cli,
  }
}

window.cli = cli;
display(dom.select(".data") ?? fatalError("Could not find .data"));
