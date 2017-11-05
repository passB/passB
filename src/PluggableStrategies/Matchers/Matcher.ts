import {Interfaces} from 'Container';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName, StrategyType} from 'State/Interfaces';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class Matcher<OptionType extends MapTypeAllowedData<OptionType>>
  extends BaseStrategy<OptionType>
  implements Interfaces.Matcher<OptionType> {
  public readonly type: StrategyType = 'Matcher';
  public abstract readonly name: StrategyName;
  public abstract readonly defaultOptions: TypedMap<OptionType>;

  public abstract filterEntries(url: string, entries: EntryNode[]): EntryNode[];
}
