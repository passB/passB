import {Service} from 'typedi';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {createOptionsData, OptionsDataType} from 'State/Options/Interfaces';
import {FileFormat, FileFormatTag} from '../';
import {OptionsPanel} from './OptionsPanel';

export type UsernameStyle = 'None' | 'SecondLine' | 'LastPathPart';

export interface Options {
  usernameStyle: UsernameStyle;
}

@Service({tags: [FileFormatTag]})
export class FirstLineFileFormat extends FileFormat<Options> {
  public readonly defaultOptions: OptionsDataType<Options> = createOptionsData({
    usernameStyle: 'SecondLine' as UsernameStyle,
  });
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;
  public readonly name: string = FirstLineFileFormat.name;

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
