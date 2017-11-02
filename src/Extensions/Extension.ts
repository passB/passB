import {injectable, unmanaged} from 'inversify';
import {RouteProps} from 'react-router';
import {executionContext} from 'Constants';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {getExecutionContext} from 'Decorators/ExecuteInContext';
import {ExecutionOptions} from 'InjectableInterfaces/Extension';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {ExtensionName} from 'State/Interfaces';
import {getExtensionOptions, setExtensionDefaultOptions} from 'State/Options';
import {setEntries} from 'State/PassEntries/Actions';
import {EntryAction} from 'State/PassEntries/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

@injectable()
export abstract class Extension<OptionType extends MapTypeAllowedData<OptionType>> implements Interfaces.Extension<OptionType> {
  public abstract readonly routes: RouteProps[];
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;
  public abstract readonly actions: string[];

  @lazyInject(Symbols.State)
  private state: Interfaces.State;
  private lastOptions: TypedMap<OptionType>;

  // tslint:disable:no-parameter-properties
  // as these properties have to be accessed in this base class constructor, they have to be passed up by the inheriting class
  public constructor(
    @unmanaged() public readonly name: ExtensionName,
    @unmanaged() public readonly defaultOptions: TypedMap<OptionType>,
  ) {
    if (getExecutionContext() === executionContext.background) {
      this.state.getStore().dispatch(setExtensionDefaultOptions({extensionName: name, options: defaultOptions}));
    }

    this.lastOptions = this.options;
    this.state.getStore().subscribe(() => {
      const {lastOptions, options} = this;
      if (!options.equals(lastOptions)) {
        this.lastOptions = options;
        this.onOptionsUpdate(lastOptions);
      }
    });
  }

  public abstract initializeList(): Promise<void>;

  public abstract getLabelForAction(action: string): string;

  public abstract executeAction(action: string, entry: string, options: ExecutionOptions): void;

  protected get options(): TypedMap<OptionType> {
    return getExtensionOptions(this.state.getStore().getState(), this.name) as TypedMap<OptionType>;
  }

  protected setEntries(entries: EntryAction[]): void {
    this.state.getStore().dispatch(setEntries({extensionName: this.name, entries}));
  }

  /**
   * Will trigger when options are updated.
   * Keep in mind that this will be triggered in all currently active contexts, so most likely in background and
   * options.
   * You will most likely want to react in a certain context like
   * @example
   * if (getExecutionContext() === executionContext.background) {
   *   // your code here
   * }
   */
  protected onOptionsUpdate(lastOptions: TypedMap<OptionType>): void {
    return;
  }
}
