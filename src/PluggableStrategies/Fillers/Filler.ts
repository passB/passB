import Tab = browser.tabs.Tab;
import {Token} from 'typedi';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName} from 'State/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class Filler<OptionType extends MapTypeAllowedData<OptionType>> extends BaseStrategy<OptionType> {
  public constructor(name: StrategyName, defaultOptions: TypedMap<OptionType>) {
    super('Filler', name, defaultOptions);
  }

  public abstract fillUsername(activeTab: Tab, username?: string): Promise<void>;
  public abstract fillPassword(activeTab: Tab, password?: string): Promise<void>;
}

export const FillerTag = new Token<Filler<{}>>();
