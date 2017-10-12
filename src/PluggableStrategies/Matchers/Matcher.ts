import {Token} from 'typedi';
import {OptionsReceiver} from "Options/OptionsReceiver";
import {Entry} from "PassB";

export abstract class Matcher<OptionType> extends OptionsReceiver<OptionType> {
  public abstract filterEntries(url: string, entries: Entry[]): Promise<Entry[]>;
}

export const MatcherTag = new Token<Matcher<{}>>();
