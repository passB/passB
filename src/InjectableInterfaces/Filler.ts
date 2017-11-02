import {MapTypeAllowedData} from '../State/Types/TypedMap';
import {Strategy} from './Strategy';

export interface Filler<OptionType extends MapTypeAllowedData<OptionType>> extends Strategy<OptionType> {
  fillUsername(activeTab: browser.tabs.Tab, username?: string): Promise<void>;

  fillPassword(activeTab: browser.tabs.Tab, password?: string): Promise<void>;
}
