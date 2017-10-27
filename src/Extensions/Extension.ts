import {RouteProps} from 'react-router';
import {Service, Token} from 'typedi';
import {LazyInject} from 'Decorators/LazyInject';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {getExtensionOptions, setExtensionDefaultOptions, OptionsDataType} from 'State/Options';
import {ExtensionName} from 'State/Options/Interfaces';
import {State} from 'State/State';

export interface EntryActions {
  label: string;
  actions: string[];
}

export interface ExecutionOptions {
  navigateTo: (newUrl: string, state: {}) => void;
}

export type RegisterEntryCallback = (entry: EntryActions) => void;

@Service()
export abstract class Extension<OptionType> {
  public static readonly routes: RouteProps[] = [];
  public abstract readonly defaultOptions: OptionsDataType<OptionType>;
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;
  public abstract readonly name: ExtensionName;
  public abstract readonly actions: string[];

  @LazyInject(() => State)
  private state: State;

  public constructor() {
    this.state.dispatch(setExtensionDefaultOptions({extensionName: this.name, options: this.defaultOptions}));
  }

  public abstract initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void>;
  public abstract getLabelForAction(action: string): string;
  public abstract executeAction(action: string, entry: string, options: ExecutionOptions): void;

  protected get options(): OptionsDataType<OptionType> {
    return getExtensionOptions(this.state.getOptions(), this.name) as OptionsDataType<OptionType>;
  }
}

export const ExtensionTag = new Token<Extension<{}>>();
