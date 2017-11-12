import Tab = browser.tabs.Tab;
import {injectable} from 'inversify';
import {EntryMetadata} from 'InjectableInterfaces/Filler';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {StrategyName} from 'State/Interfaces';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';
import {Filler} from '../Filler';
import {OptionsPanel} from './OptionsPanel';

export const fillSelectorTarget = (selector: string, newValue: string, onlyFirst: boolean) => {
  let i = 0;
  let inputs = Array.from(document.querySelectorAll(selector));

  if (onlyFirst && inputs.length > 1) {
    inputs = [inputs.shift()!];
  }

  for (const input of inputs) {
    (input as HTMLInputElement).value = newValue;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new KeyboardEvent('keyup'));
    // may not be supported by every browser: https://developer.mozilla.org/en-US/docs/Web/API/InputEvent
    /* istanbul ignore next */
    if (typeof InputEvent === 'function') {
      input.dispatchEvent(new InputEvent('input'));
    }
    i++;
  }
  return i;
};

export interface Options {
  defaultUsernameSelector: string;
  defaultPasswordSelector: string;
  fillOnlyFirstMatchingField: boolean;
  usernameSelectorPrefix: string;
  passwordSelectorPrefix: string;
}

@injectable()
export class SelectorFiller extends Filler<Options> {
  public readonly OptionsPanel?: OptionsPanelType<Options> = OptionsPanel;
  public readonly name: StrategyName = 'SelectorFiller';
  public readonly defaultOptions: TypedMap<Options> = createTypedMap({
    defaultUsernameSelector: 'input[autocomplete="username"],input[type="email"]',
    defaultPasswordSelector: 'input[type="password"]',
    fillOnlyFirstMatchingField: true,
    usernameSelectorPrefix: '',
    passwordSelectorPrefix: '',
  });

  public fillUsername(activeTab: Tab, username: string, {entryContents}: EntryMetadata): Promise<void> {
    const {usernameSelectorPrefix, defaultUsernameSelector, fillOnlyFirstMatchingField} = this.options.toJS();
    const selector = this.getSelectorByPrefix(usernameSelectorPrefix, entryContents) || defaultUsernameSelector || '';

    return this.fillSelect(activeTab, selector, username, fillOnlyFirstMatchingField);
  }

  public fillPassword(activeTab: Tab, password: string, {entryContents}: EntryMetadata): Promise<void> {
    const {passwordSelectorPrefix, defaultPasswordSelector, fillOnlyFirstMatchingField} = this.options.toJS();
    const selector = this.getSelectorByPrefix(passwordSelectorPrefix, entryContents) || defaultPasswordSelector || '';

    return this.fillSelect(activeTab, selector, password, fillOnlyFirstMatchingField);
  }

  private getSelectorByPrefix(prefix: string, entryContents: string[]): string | void {
    if (!prefix || prefix.trim().length === 0) {
      return;
    }
    const selectorLine = entryContents.find((line: string) => line.startsWith(prefix));
    if (selectorLine) {
      const selector = selectorLine.slice(prefix.length);
      if (selector.trim().length > 0) {
        return selector;
      }
    }
    return;
  }

  private fillSelect(activeTab: Tab, selector: string, newValue: string, onlyFirst: boolean): Promise<void> {
    if (!selector || selector.trim().length === 0 || !newValue || newValue.trim().length === 0) {
      return Promise.resolve();
    }

    const args = [selector, newValue, onlyFirst];
    const code = `(${fillSelectorTarget.toString()}).apply(null, JSON.parse(${JSON.stringify(JSON.stringify(args))}));`;
    return browser.tabs.executeScript(activeTab.id, {code}).then(() => void 0);
  }
}
