import Tab = browser.tabs.Tab;
import {Interfaces} from 'Container';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName, StrategyType} from 'State/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class Filler<OptionType extends MapTypeAllowedData<OptionType>>
  extends BaseStrategy<OptionType>
  implements Interfaces.Filler<OptionType> {
  public readonly type: StrategyType = 'Filler';
  public abstract readonly name: StrategyName;
  public abstract readonly defaultOptions: TypedMap<OptionType>;

  public abstract fillUsername(activeTab: Tab, username?: string): Promise<void>;

  public abstract fillPassword(activeTab: Tab, password?: string): Promise<void>;
}
