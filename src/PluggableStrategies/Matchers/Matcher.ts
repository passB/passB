import {injectable, unmanaged} from 'inversify';
import {Interfaces} from 'Container';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName} from 'State/Interfaces';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

@injectable()
export abstract class Matcher<OptionType extends MapTypeAllowedData<OptionType>>
  extends BaseStrategy<OptionType>
  implements Interfaces.Matcher<OptionType> {
  public constructor(@unmanaged() name: StrategyName, @unmanaged() defaultOptions: TypedMap<OptionType>) {
    super('Matcher', name, defaultOptions);
  }

  public abstract filterEntries(url: string, entries: EntryNode[]): EntryNode[];
}
