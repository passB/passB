import {Service} from 'typedi';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {createTypedMap} from 'State/Types/TypedMap';
import {FileFormat, FileFormatTag} from '../';
import {OptionsPanel} from './OptionsPanel';

export type UsernameStyle = 'None' | 'SecondLine' | 'LastPathPart';

export interface Options {
  usernameStyle: UsernameStyle;
}

@Service({tags: [FileFormatTag]})
export class FirstLineFileFormat extends FileFormat<Options> {
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

  public constructor() {
    super(
      'FirstLineFileFormat',
      createTypedMap({
        usernameStyle: 'SecondLine' as UsernameStyle,
      }),
    );
  }

  public getPassword(lines: string[], entryName: string): string | undefined {
    return lines[0];
  }

  public getUsername(lines: string[], entryName: string): string | undefined {
    switch (this.options.get('usernameStyle')) {
      case 'SecondLine':
        return lines[1];
      case 'LastPathPart':
        return entryName.split(/[/\\]/).pop();
      default:
        return void 0;
    }
  }
}
