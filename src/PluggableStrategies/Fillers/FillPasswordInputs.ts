import Tab = browser.tabs.Tab;
import {injectable} from 'inversify';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {createTypedMap} from 'State/Types/TypedMap';
import {Filler} from './Filler';

// tslint:disable:max-classes-per-file
declare global {
  class InputEvent extends Event {
  }
}

export const fillPasswordInputs = (password: string) => {
  let i = 0;
  for (const passwordInput of Array.from(document.querySelectorAll('input[type="password"]'))) {
    (passwordInput as HTMLInputElement).value = password;
    passwordInput.dispatchEvent(new Event('change'));
    passwordInput.dispatchEvent(new KeyboardEvent('keyup'));
    // may not be supported by every browser: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent
    /* istanbul ignore next */
    if (typeof InputEvent === 'function') {
      passwordInput.dispatchEvent(new InputEvent('input'));
    }
    i++;
  }
  return i;
};

@injectable()
export class FillPasswordInputs extends Filler<{foo?: string}> {
  public readonly OptionsPanel?: OptionsPanelType<{}> = void 0;

  public constructor() {
    super(
      'FillPasswordInputs',
      createTypedMap({}),
    );
  }

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
    const code = `(${fillPasswordInputs.toString()}).apply(null, JSON.parse(${JSON.stringify(JSON.stringify(args))}));`;
    return browser.tabs.executeScript(activeTab.id, {code}).then(() => void 0);
  }
}
