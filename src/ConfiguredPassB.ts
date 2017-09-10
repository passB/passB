import {PassExtension} from "Extensions/PassExtension/PassExtension";
import {QRCodeExtension} from "Extensions/QRCodeExtension/QRCodeExtension";
import {PassB} from "PassB";
import {FirstLineFileFormat} from "PluggableStrategies/FileFormats/FirstLineFileFormat";
import {FillPasswordInputs} from "PluggableStrategies/Fillers/FillPasswordInputs";
import {FuzzaldrinMatcher} from "PluggableStrategies/Matchers";

/**
 * exports a passB instance for the current context, with all options set
 */
export const passB = new PassB({
  extensions: [
    new PassExtension(),
    new QRCodeExtension(),
  ],
  matchers: [
    new FuzzaldrinMatcher(),
  ],
  fileFormats: [
    new FirstLineFileFormat(),
  ],
  fillers: [
    new FillPasswordInputs(),
  ],
});

passB.initialize();
