import {Token} from 'typedi';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyType} from 'State/Options/Interfaces';

export abstract class FileFormat<OptionType> extends BaseStrategy<OptionType> {
  public readonly type: StrategyType = 'FileFormat';

  public abstract getPassword(lines: string[], entryName: string): string | undefined;
  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}

export const FileFormatTag = new Token<FileFormat<{}>>();
