import {RouteProps} from 'react-router';
import {Service} from 'typedi';
import {LazyInject} from 'Decorators/LazyInject';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {PassCli} from 'PassCli';
import {ExecutionOptions, Extension, ExtensionTag, RegisterEntryCallback} from '..';
import {OptionsPanel} from './OptionsPanel';
import {Show} from './Views/Show';

export type Level = 'L' | 'M' | 'Q' | 'H';

export interface Options {
  bgColor: string;
  fgColor: string;
  level: Level;
}

@Service({tags: [ExtensionTag]})
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
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

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
        return 'extension_qrcode_action_show';
      default:
        return '';
    }
  }

  public executeAction(action: string, entry: string, {navigateTo}: ExecutionOptions): void {
    switch (action) {
      case 'show':
        navigateTo('/extension/QRCode/Show', {entry, options: this.options});
        break;
      default:
        console.error('unknown action:', action);
    }
  }
}
