import cli from "./cli";
import display from "./display";
import * as dom from "./dom";

declare global {
  interface Window {
    cli: typeof cli,
  }
}

window.cli = cli;
display(dom.select(".data")!);
