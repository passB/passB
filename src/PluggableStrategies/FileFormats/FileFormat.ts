import {Token} from 'typedi';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName} from 'State/Options/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class FileFormat<OptionType extends MapTypeAllowedData<OptionType>> extends BaseStrategy<OptionType> {
  public constructor(name: StrategyName, defaultOptions: TypedMap<OptionType>) {
    super('FileFormat', name, defaultOptions);
  }

  public abstract getPassword(lines: string[], entryName: string): string | undefined;
  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}

export const FileFormatTag = new Token<FileFormat<{}>>();
