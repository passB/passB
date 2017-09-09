import {passB} from "ConfiguredPassB";
import {AsynchronousCallable, executeInCorrectContext} from "Decorators/ExecuteInContext";
import {OptionsPanelType} from "Options/OptionsReceiver";
import {PassCli} from "PassCli";
import {ExecutionOptions, Extension, RegisterEntryCallback} from "../Extension";
import {Show} from "./Views";

import * as React from 'react';
import {RouteProps} from "react-router";

interface Options {}

@AsynchronousCallable()
export class PassExtension extends Extension<Options> {
  public static readonly routes: RouteProps[] = [
    {
      path: '/extension/Pass/Show',
      component: Show,
    },
  ];
  public readonly name: string = 'Pass';
  public readonly actions: string[] = ['show', 'fill'];
  public readonly defaultOptions: Options = {};
  public readonly OptionsPanel?: OptionsPanelType<Options> = void 0;

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
        window.close();
        break;
      default:
        console.error('unknown action:', action);
    }
  }

  private async getCurrentTab(): Promise<browser.tabs.Tab> {
    return (await browser.tabs.query({active: true, currentWindow: true}))[0];
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  private async executeFillAction(entry: string): Promise<{}> {
    const initialUrl = (await this.getCurrentTab()).url;
    const entryContents = await PassCli.show(entry);
    const activeTab = await this.getCurrentTab();
    const finalUrl = activeTab.url;

    if (typeof finalUrl !== "undefined" && initialUrl !== finalUrl) {
      console.info(`url changed from request to receive of password. not filling`);
      return {};
    }

    const filler = await passB.getFiller();
    const fileFormat = await passB.getFileFormat();

    return Promise.all([
      filler.fillPassword(activeTab, fileFormat.getPassword(entryContents, entry)),
      filler.fillUsername(activeTab, fileFormat.getUsername(entryContents, entry)),
    ]);
  }
}
