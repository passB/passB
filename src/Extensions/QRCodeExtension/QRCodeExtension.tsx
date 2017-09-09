import {AsynchronousCallable, executeInCorrectContext} from "Decorators/ExecuteInContext";
import {OptionsPanelType} from "Options/OptionsReceiver";
import {PassCli} from "PassCli";
import {ExecutionOptions, Extension, RegisterEntryCallback} from "../Extension";
import {Show} from "./Views/Show";

import * as React from 'react';
import {RouteProps} from "react-router";

interface Options {
  bgColor: string;
  fgColor: string;
  level: "L" | "M" | "Q" | "H";
}

@AsynchronousCallable()
export class QRCodeExtension extends Extension<Options> {
  public static readonly routes: RouteProps[] = [
    {
      path: '/extension/QRCode/Show',
      component: Show,
    },
  ];
  public readonly name: string = 'QRCode';
  public readonly actions: string[] = ['show'];
  public readonly defaultOptions: Options = {
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    level: 'Q',
  };
  public readonly OptionsPanel: OptionsPanelType<Options> = () => <div>TODO</div>;

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
        return 'extension_qrcode_action_show';
      default:
        return '';
    }
  }

  public executeAction(action: string, entry: string, {navigateTo}: ExecutionOptions): void {
    switch (action) {
      case 'show':
        navigateTo('/extension/QRCode/Show', {entry});
        break;
      default:
        console.error('unknown action:', action);
    }
  }
}
