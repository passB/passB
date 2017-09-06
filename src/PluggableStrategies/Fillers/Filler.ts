import Tab = browser.tabs.Tab;
import {OptionsReceiver} from "Options/OptionsReceiver";

export abstract class Filler<OptionType> extends OptionsReceiver<OptionType> {
  public abstract fillUsername(activeTab: Tab, username?: string): Promise<void>;
  public abstract fillPassword(activeTab: Tab, password?: string): Promise<void>;
}
