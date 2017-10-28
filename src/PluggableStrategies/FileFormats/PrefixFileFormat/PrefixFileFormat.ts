import {Service} from 'typedi';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {createTypedMap} from 'State/Types/TypedMap';
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
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

  public constructor() {
    super(
      'PrefixFileFormat',
      createTypedMap({
        passwordFirstLine: true,
        passwordPrefix: '',
        usernamePrefix: 'login:',
        trimWhitespace: true,
      }),
    );
  }

  public getPassword(lines: string[], entryName: string): string | undefined {
    if (this.options.get('passwordFirstLine')) {
      return lines[0];
    }
    return this.getEntryByPrefix(lines, this.options.get('passwordPrefix'));
  }

  public getUsername(lines: string[], entryName: string): string | undefined {
    return this.getEntryByPrefix(lines, this.options.get('usernamePrefix'));
  }

  private getEntryByPrefix(lines: string[], prefix: string): string | undefined {
    for (const line of lines) {
      if (line.startsWith(prefix)) {
        let entry = line.substr(prefix.length);
        if (this.options.get('trimWhitespace')) {
          entry = entry.trim();
        }
        return entry;
      }
    }
    return;
  }
}
