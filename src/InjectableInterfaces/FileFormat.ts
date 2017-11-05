import {MapTypeAllowedData} from 'State/Types/TypedMap';
import {Strategy} from './Strategy';

export interface FileFormat<OptionType extends MapTypeAllowedData<OptionType>> extends Strategy<OptionType> {
  getPassword(lines: string[], entryName: string): string | undefined;

  getUsername(lines: string[], entryName: string): string | undefined;
}
