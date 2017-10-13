import {Token} from 'typedi';
import {OptionsReceiver} from 'Options/OptionsReceiver';
import {EntryNode} from 'PassB';

export abstract class Matcher<OptionType> extends OptionsReceiver<OptionType> {
  public abstract filterEntries(url: string, entries: EntryNode[]): Promise<EntryNode[]>;
}

export const MatcherTag = new Token<Matcher<{}>>();
