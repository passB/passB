import {LabeledEntries, PassB} from "./PassB";
window.executionContext = "background";
import {passB} from "./ConfiguredPassB";

passB.initialize()
  .then((x: PassB) => console.log('initialized', x))
  .then(() => passB.getEntries())
  .then((x: LabeledEntries) => console.log('returned', x));
