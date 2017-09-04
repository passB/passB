import {PassExtension} from "Extensions/PassExtension/PassExtension";
import {PassB} from "PassB";
import {FuzzaldrinMatcher} from "PluggableStrategies/Matchers";
import {FirstLineFileFormat} from "./PluggableStrategies/FileFormats/FirstLineFileFormat";
import {FillPasswordInputs} from "./PluggableStrategies/Fillers/FillPasswordInputs";

/**
 * exports a passB instance for the current context, with all options set
 */
export const passB = new PassB({
  extensions: [
    new PassExtension({}),
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
