import {Token} from 'typedi';
import {EntryNode} from 'PassB';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyType} from 'State/Options/Interfaces';

export abstract class Matcher<OptionType> extends BaseStrategy<OptionType> {
  public readonly type: StrategyType = 'Matcher';

  public abstract filterEntries(url: string, entries: EntryNode[]): Promise<EntryNode[]>;
}

export const MatcherTag = new Token<Matcher<{}>>();
