import {PassExtension} from "./Extensions/PassExtension";
import {PassB} from "./PassB";

const passB = new PassB({
  extensions: [
    new PassExtension({}),
  ],
});

passB.initialize();

browser.browserAction.onClicked.addListener(
  () => {
    console.log(passB);
  },
);
