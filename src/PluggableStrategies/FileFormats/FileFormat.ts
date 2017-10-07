import {OptionsReceiver} from "Options/OptionsReceiver";
import {Token} from 'typedi';

export abstract class FileFormat<OptionType> extends OptionsReceiver<OptionType> {
  public abstract getPassword(lines: string[], entryName: string): string | undefined;
  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}

export const FileFormatTag = new Token<FileFormat<{}>>();
