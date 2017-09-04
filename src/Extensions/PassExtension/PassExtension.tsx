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

  private async executeFillAction(entry: string): Promise<void> {
    // baz
  }
}
