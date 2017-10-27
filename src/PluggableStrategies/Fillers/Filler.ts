import Tab = browser.tabs.Tab;
import {Token} from 'typedi';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyType} from 'State/Options/Interfaces';

export abstract class Filler<OptionType> extends BaseStrategy<OptionType> {
  public readonly type: StrategyType = 'Filler';

  public abstract fillUsername(activeTab: Tab, username?: string): Promise<void>;
  public abstract fillPassword(activeTab: Tab, password?: string): Promise<void>;
}

export const FillerTag = new Token<Filler<{}>>();
