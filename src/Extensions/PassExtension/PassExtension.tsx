import {PassCli} from "PassCli";
import {ExecutionOptions, Extension, RegisterEntryCallback} from "../Extension";
import {Show} from "./Views";

import * as React from 'react';
import {RouteProps} from "react-router";

export class PassExtension extends Extension {
  public static readonly routes: RouteProps[] = [
    {
      path: '/extension/Pass/Show',
      component: Show,
    },
  ];
  public name: string = 'Pass';
  public actions: string[] = ['show', 'fill'];

  public async initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void> {
    for (const label of await PassCli.list()) {
      registerEntryCallback({
        label,
        actions: this.actions,
      });
    }
  }

  public getLabelForAction(action: string): string {
    switch (action) {
      case 'show':
        return 'extension_pass_action_show';
      case 'fill':
        return 'extension_pass_action_fill';
      default:
        return '';
    }
  }

  public executeAction(action: string, entry: string, {navigateTo}: ExecutionOptions): void {
    switch (action) {
      case 'show':
        navigateTo('/extension/Pass/Show', {entry});
        break;
      case 'fill':
        this.executeFillAction(entry);
        break;
      default:
        console.error('unknown action:', action);
    }
  }

  private async getCurrentTab(): Promise<browser.tabs.Tab> {
    return (await browser.tabs.query({active: true, currentWindow: true}))[0];
  }

  private async executeFillAction(entry: string): Promise<void> {
    const initialUrl = (await this.getCurrentTab()).url;
    const entryContents = await PassCli.show(entry);
    const activeTab = await this.getCurrentTab();
    const finalUrl = activeTab.url;

    if (typeof finalUrl !== "undefined" && initialUrl !== finalUrl) {
      console.info(`url changed from request to receive of password. not filling`);
      return;
    }

    const fillPasswordInputs = (password: string) => {
      let i = 0;
      for (const passwordInput of document.querySelectorAll('input[type="password"]')) {
        console.log('filling', passwordInput);
        (passwordInput as HTMLInputElement).value = password;
        i++;
      }
      return i;
    };

    const args = [entryContents[0]];
    const code = `(${fillPasswordInputs.toString()}).apply(null, JSON.parse('${JSON.stringify(args)}')); `;

    console.log('will execute', code, 'in', activeTab.id);
    const ret: number[] = await browser.tabs.executeScript(activeTab.id, {code});
    console.log('filled out', ret, 'inputs');
  }
}
