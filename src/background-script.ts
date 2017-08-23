window.executionContext = "background";
import {passB} from "./ConfiguredPassB";

passB.initialize()
  .then((x) => console.log('initialized', x))
  .then(() => passB.getEntries())
  .then((x) => console.log('returned', x));
