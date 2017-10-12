import {RouteProps} from 'react-router';
import {Token} from 'typedi';
import {OptionsReceiver} from 'Options/OptionsReceiver';

export interface ListEntry {
  label: string;
  actions: string[];
}

export interface ExecutionOptions {
  navigateTo: (newUrl: string, state: {}) => void;
}

export type RegisterEntryCallback = (entry: ListEntry) => void;

export abstract class Extension<OptionType> extends OptionsReceiver<OptionType> {
  public static readonly routes: RouteProps[] = [];
  public abstract readonly name: string;
  public abstract readonly actions: string[];

  public abstract initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void>;

  public abstract getLabelForAction(action: string): string;

  public abstract executeAction(action: string, entry: string, options: ExecutionOptions): void;
}

export const ExtensionTag = new Token<Extension<{}>>();
