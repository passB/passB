import Tab = browser.tabs.Tab;
import {Service} from 'typedi';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {Filler, FillerTag} from './Filler';

const fillPasswordInputs = (password: string) => {
  let i = 0;
  for (const passwordInput of Array.from(document.querySelectorAll('input[type="password"]'))) {
    (passwordInput as HTMLInputElement).value = password;
    passwordInput.dispatchEvent(new Event('change'));
    passwordInput.dispatchEvent(new KeyboardEvent('keyup'));
    // may not be supported by every browser: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent
    if (typeof InputEvent === 'function') {
      passwordInput.dispatchEvent(new InputEvent('input'));
    }
    i++;
  }
  return i;
};

@Service({tags: [FillerTag]})
export class FillPasswordInputs extends Filler<{}> {
  public readonly defaultOptions: {} = {};
  public readonly name: string = FillPasswordInputs.name;
  public readonly OptionsPanel?: OptionsPanelType<{}> = void 0;

  public fillUsername(activeTab: Tab, username: string): Promise<void> {
    // not supported by this filler, just skip it
    return Promise.resolve();
  }

  public fillPassword(activeTab: Tab, password: string): Promise<void> {
    if (!password) {
      // no password provided, nothing to fill
      return Promise.resolve();
    }
    const args = [password];
    const code = `(${fillPasswordInputs.toString()}).apply(null, JSON.parse('${JSON.stringify(args)
        .replace("'", "\\'")}')); `;
    return browser.tabs.executeScript(activeTab.id, {code}).then(() => void 0);
  }
}
