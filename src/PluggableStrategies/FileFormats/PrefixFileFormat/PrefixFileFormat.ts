import { injectable} from 'inversify';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {StrategyName} from 'State/Interfaces';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';
import {FileFormat} from '../';
import {OptionsPanel} from './OptionsPanel';

export interface Options {
  passwordFirstLine: boolean;
  passwordPrefix: string;
  usernamePrefix: string;
  trimWhitespace: boolean;
}

@injectable()
export class PrefixFileFormat extends FileFormat<Options> {
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;
  public readonly name: StrategyName = 'PrefixFileFormat';
  public readonly defaultOptions: TypedMap<Options> =  createTypedMap({
    passwordFirstLine: true,
    passwordPrefix: '',
    usernamePrefix: 'login:',
    trimWhitespace: true,
  });

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
        let entry = line.slice(prefix.length);
        if (this.options.get('trimWhitespace')) {
          entry = entry.trim();
        }
        return entry;
      }
    }
    return;
  }
}
