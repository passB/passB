import {MapTypeAllowedData} from 'State/Types/TypedMap';
import {Strategy} from './Strategy';

export interface EntryMetadata {
  entryName: string;
  entryContents: string[];
}

export interface Filler<OptionType extends MapTypeAllowedData<OptionType>> extends Strategy<OptionType> {
  fillUsername(activeTab: browser.tabs.Tab, username: string | undefined, meta: EntryMetadata): Promise<void>;

  fillPassword(activeTab: browser.tabs.Tab, password: string | undefined, meta: EntryMetadata): Promise<void>;
}
