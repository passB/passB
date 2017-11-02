import {EntryNode} from 'State/PassEntries/Interfaces';
import {MapTypeAllowedData} from 'State/Types/TypedMap';
import {Strategy} from './Strategy';

export interface Matcher<OptionType extends MapTypeAllowedData<OptionType>> extends Strategy<OptionType> {
  filterEntries(url: string, entries: EntryNode[]): EntryNode[];
}
