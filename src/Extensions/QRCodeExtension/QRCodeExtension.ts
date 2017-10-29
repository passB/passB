import {RouteProps} from 'react-router';
import {Service} from 'typedi';
import {LazyInject} from 'Decorators/LazyInject';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {PassCli} from 'PassCli';
import {EntryAction} from 'State/PassEntries/Interfaces';
import {createTypedMap} from 'State/Types/TypedMap';
import {ExecutionOptions, Extension, ExtensionTag} from '..';
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
  public readonly actions: string[] = ['show'];
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

  @LazyInject(() => PassCli)
  private passCli: PassCli;

  public constructor() {
    super('QRCode',  createTypedMap({
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      level: 'Q' as Level,
    }));
  }

  public async initializeList(): Promise<void> {
    const entries: EntryAction[] = [];

    for (const fullPath of await this.passCli.list()) {
      if (fullPath === '' || fullPath.endsWith('/')) {
        continue;
      }

      entries.push(...this.actions.map((action: string) => ({fullPath, action })));
    }
    this.setEntries(entries);
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
        navigateTo('/extension/QRCode/Show', {entry, options: this.options.toJS()});
        break;
      default:
        console.error('unknown action:', action);
        break;
    }
  }
}
