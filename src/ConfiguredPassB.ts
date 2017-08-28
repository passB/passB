import {PassExtension} from "./Extensions/PassExtension/PassExtension";
import {FuzzaldrinMatcher} from "./Matchers/FuzzaldrinMatcher";
import {PassB} from "./PassB";

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
});
