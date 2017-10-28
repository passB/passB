import {Token} from 'typedi';
import {EntryNode} from 'PassB';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName} from 'State/Options/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class Matcher<OptionType extends MapTypeAllowedData<OptionType>> extends BaseStrategy<OptionType> {
  public constructor(name: StrategyName, defaultOptions: TypedMap<OptionType>) {
    super('Matcher', name, defaultOptions);
  }

  public abstract filterEntries(url: string, entries: EntryNode[]): Promise<EntryNode[]>;
}

export const MatcherTag = new Token<Matcher<{}>>();
