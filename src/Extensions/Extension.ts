import {RouteProps} from 'react-router';
import {Token} from 'typedi';
import {executionContext} from 'Constants';
import {getExecutionContext} from 'Decorators/ExecuteInContext';
import {LazyInject} from 'Decorators/LazyInject';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {ExtensionName} from 'State/Interfaces';
import {getExtensionOptions, setExtensionDefaultOptions} from 'State/Options';
import {setEntries} from 'State/PassEntries/Actions';
import {EntryAction} from 'State/PassEntries/Interfaces';
import {State} from 'State/State';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export interface EntryActions {
  label: string;
  actions: string[];
}

export interface ExecutionOptions {
  navigateTo: (newUrl: string, state: {}) => void;
}

export type RegisterEntryCallback = (entry: EntryActions) => void;

export abstract class Extension<OptionType extends MapTypeAllowedData<OptionType>> {
  public static readonly routes: RouteProps[] = [];
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;
  public abstract readonly actions: string[];

  @LazyInject(() => State)
  private state: State;

  // tslint:disable:no-parameter-properties
  // as these properties have to be accessed in this base class constructor, they have to be passed up by the inheriting class
  public constructor(
    public readonly name: ExtensionName,
    public readonly defaultOptions: TypedMap<OptionType>,
  ) {
    if (getExecutionContext() === executionContext.background) {
      this.state.dispatch(setExtensionDefaultOptions({extensionName: name, options: defaultOptions}));
    }
  }

  public abstract initializeList(): Promise<void>;
  public abstract getLabelForAction(action: string): string;
  public abstract executeAction(action: string, entry: string, options: ExecutionOptions): void;

  protected get options(): TypedMap<OptionType> {
    return getExtensionOptions(this.state.getState(), this.name) as TypedMap<OptionType>;
  }

  protected setEntries(entries: EntryAction[]): void {
    this.state.dispatch(setEntries({extensionName: this.name, entries}));
  }
}

export const ExtensionTag = new Token<Extension<{}>>();
