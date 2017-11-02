import {injectable} from 'inversify';
import {RouteProps} from 'react-router';
import {executionContext} from 'Constants';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {executeInCorrectContext, AsynchronousCallable} from 'Decorators/ExecuteInContext';
import {ExecutionOptions} from 'InjectableInterfaces/Extension';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {EntryAction} from 'State/PassEntries/Interfaces';
import {createTypedMap} from 'State/Types/TypedMap';
import {Extension} from '..';
import {Show} from './Views';

interface Options {
}

@AsynchronousCallable()
@injectable()
export class PassExtension extends Extension<Options> {
  public readonly routes: RouteProps[] = [
    {
      path: '/extension/Pass/Show',
      component: Show,
    },
  ];
  public readonly actions: string[] = ['show', 'fill'];
  public readonly OptionsPanel?: OptionsPanelType<Options> = void 0;

  @lazyInject(Symbols.PassB)
  private passB: Interfaces.PassB;

  @lazyInject(Symbols.PassCli)
  private passCli: Interfaces.PassCli;

  public constructor() {
    super('Pass', createTypedMap({}));
  }

  public async initializeList(): Promise<void> {
    const entries: EntryAction[] = [];

    for (const fullPath of await this.passCli.list()) {
      if (fullPath === '' || fullPath.endsWith('/')) {
        continue;
      }

      entries.push(...this.actions.map((action: string) => ({fullPath, action})));
    }
    this.setEntries(entries);
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
        break;
    }
  }

  private async getCurrentTab(): Promise<browser.tabs.Tab> {
    return (await browser.tabs.query({active: true, currentWindow: true}))[0];
  }

  @executeInCorrectContext(executionContext.background)
  private async executeFillAction(entry: string): Promise<{}> {
    const initialUrl = (await this.getCurrentTab()).url;
    const entryContents = await this.passCli.show(entry);
    const activeTab = await this.getCurrentTab();
    const finalUrl = activeTab.url;

    if (typeof finalUrl !== 'undefined' && initialUrl !== finalUrl) {
      console.info('url changed from request to receive of password. not filling');
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
