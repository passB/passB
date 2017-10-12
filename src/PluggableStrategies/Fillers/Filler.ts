import Tab = browser.tabs.Tab;
import {Token} from 'typedi';
import {OptionsReceiver} from "Options/OptionsReceiver";

export abstract class Filler<OptionType> extends OptionsReceiver<OptionType> {
  public abstract fillUsername(activeTab: Tab, username?: string): Promise<void>;
  public abstract fillPassword(activeTab: Tab, password?: string): Promise<void>;
}

export const FillerTag = new Token<Filler<{}>>();
