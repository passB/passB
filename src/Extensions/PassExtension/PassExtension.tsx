import * as React from 'react';
import {RouteProps} from "react-router";
import {Service} from 'typedi';
import {executeInCorrectContext, AsynchronousCallableServiceFactory} from "Decorators/ExecuteInContext";
import {LazyInject} from "Decorators/LazyInject";
import {OptionsPanelType} from "Options/OptionsReceiver";
import {PassB} from "PassB";
import {PassCli} from "PassCli";
import {ExecutionOptions, Extension, ExtensionTag, RegisterEntryCallback} from "..";
import {Show} from "./Views";

interface Options {
}

@Service({
  tags: [ExtensionTag],
  factory: AsynchronousCallableServiceFactory(PassExtension),
})
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

  @LazyInject(() => PassB)
  private passB: PassB;

  @LazyInject(() => PassCli)
  private passCli: PassCli;

  public async initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void> {
    for (const label of await this.passCli.list()) {
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
    const entryContents = await this.passCli.show(entry);
    const activeTab = await this.getCurrentTab();
    const finalUrl = activeTab.url;

    if (typeof finalUrl !== "undefined" && initialUrl !== finalUrl) {
      console.info(`url changed from request to receive of password. not filling`);
      return {};
    }

    const filler = await this.passB.getFiller();
    const fileFormat = await this.passB.getFileFormat();

    return Promise.all([
      filler.fillPassword(activeTab, fileFormat.getPassword(entryContents, entry)),
      filler.fillUsername(activeTab, fileFormat.getUsername(entryContents, entry)),
    ]);
  }
}
