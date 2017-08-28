import {PassCli} from "PassCli";
import {ExecutionOptions, Extension, RegisterEntryCallback} from "../Extension";
import {Show} from "./Components";

import * as React from 'react';
import {RouteProps} from "react-router";

export class PassExtension extends Extension {
  public static readonly routes: RouteProps[] = [
    {
      path: '/extension/Pass/Show',
      render: ({location: {state: {entry}}}) => <Show entry={entry} />,
    },
  ];
  public name = 'Pass';
  public actions = ['show'];

  public async initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void> {
    for (const label of await PassCli.list()) {
      registerEntryCallback({
        label,
        actions: this.actions,
      });
    }
  }

  public getLabelForAction(action: string) {
    switch (action) {
      case 'show':
        return 'extension_pass_action_show';
      default:
        return '';
    }
  }

  public executeAction(action: string, entry: string, {navigateTo}: ExecutionOptions): void {
    switch (action) {
      case 'show':
        navigateTo('/extension/Pass/Show', {entry});
        break;
      default:
        console.error('unknown action:', action);
    }
  }
}
