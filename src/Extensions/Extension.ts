import {RouteProps} from 'react-router';
import {Token} from 'typedi';
import {LazyInject} from 'Decorators/LazyInject';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {getExtensionOptions, setExtensionDefaultOptions, TypedMap} from 'State/Options';
import {ExtensionName} from 'State/Options/Interfaces';
import {State} from 'State/State';
import {MapTypeAllowedData} from 'State/Types/TypedMap';

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
    this.state.dispatch(setExtensionDefaultOptions({extensionName: name, options: defaultOptions}));
  }

  public abstract initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void>;
  public abstract getLabelForAction(action: string): string;
  public abstract executeAction(action: string, entry: string, options: ExecutionOptions): void;

  protected get options(): TypedMap<OptionType> {
    return getExtensionOptions(this.state.getOptions(), this.name) as TypedMap<OptionType>;
  }
}

export const ExtensionTag = new Token<Extension<{}>>();
