import {Service} from 'typedi';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {FileFormat, FileFormatTag} from '../';
import {OptionsPanel} from './OptionsPanel';

export interface Options {
  passwordFirstLine: boolean;
  passwordPrefix: string;
  usernamePrefix: string;
  trimWhitespace: boolean;
}

@Service({tags: [FileFormatTag]})
export class PrefixFileFormat extends FileFormat<Options> {
  public readonly defaultOptions: Options = {
    passwordFirstLine: true,
    passwordPrefix: '',
    usernamePrefix: 'login:',
    trimWhitespace: true,
  };
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;
  public readonly name: string = PrefixFileFormat.name;

  public getPassword(lines: string[], entryName: string): string | undefined {
    if (this.options.passwordFirstLine) {
      return lines[0];
    }
    return this.getEntryByPrefix(lines, this.options.passwordPrefix);
  }

  public getUsername(lines: string[], entryName: string): string | undefined {
    return this.getEntryByPrefix(lines, this.options.usernamePrefix);
  }

  private getEntryByPrefix(lines: string[], prefix: string): string | undefined {
    for (const line of lines) {
      if (line.startsWith(prefix)) {
        let entry = line.substr(prefix.length);
        if (this.options.trimWhitespace) {
          entry = entry.trim();
        }
        return entry;
      }
    }
    return;
  }
}
