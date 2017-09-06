import Tab = browser.tabs.Tab;
import {Filler} from "./Filler";

import * as React from 'react';
import {OptionsPanelType} from "../../Options/OptionsReceiver";

const fillPasswordInputs = (password: string) => {
  let i = 0;
  for (const passwordInput of Array.from(document.querySelectorAll('input[type="password"]'))) {
    (passwordInput as HTMLInputElement).value = password;
    i++;
  }
  return i;
};

export class FillPasswordInputs extends Filler<{}> {
  public readonly defaultOptions: {} = {};
  public readonly OptionsPanel: OptionsPanelType<{}> = () => <div/>;

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
    const code = `(${fillPasswordInputs.toString()}).apply(null, JSON.parse('${JSON.stringify(args)}')); `;
    return browser.tabs.executeScript(activeTab.id, {code}).then(() => void 0);
  }
}
