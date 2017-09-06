import {OptionsReceiver} from "Options/OptionsReceiver";

export abstract class FileFormat<OptionType> extends OptionsReceiver<OptionType> {
  public abstract getPassword(lines: string[], entryName: string): string | undefined;
  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}
