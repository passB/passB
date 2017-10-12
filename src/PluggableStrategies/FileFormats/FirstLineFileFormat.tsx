import {FormControl, FormControlLabel, FormLabel} from "material-ui";
import {default as Radio, RadioGroup} from 'material-ui/Radio';
import * as React from 'react';
import {Service} from 'typedi';
import {OptionsPanelType, OptionPanelProps} from "Options/OptionsReceiver";
import {FileFormat, FileFormatTag} from ".";

export type UsernameStyle = "None" | "SecondLine" | "LastPathPart";
interface Options {
  usernameStyle: UsernameStyle;
}

@Service({tags: [FileFormatTag]})
export class FirstLineFileFormat extends FileFormat<Options> {
  public readonly defaultOptions: Options = {
    usernameStyle: "SecondLine",
  };
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;
  public readonly name: string = FirstLineFileFormat.name;

  public getPassword(lines: string[], entryName: string): string | undefined {
    return lines[0];
  }

  public getUsername(lines: string[], entryName: string): string | undefined {
    switch (this.options.usernameStyle) {
      case "SecondLine":
        return lines[1];
      case "LastPathPart":
        return entryName.split(/[/\\]/).pop();
      default:
        return void 0;
    }
  }
}

function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <div>
      <FormControl>
        <FormLabel>Get username from:</FormLabel>
        <RadioGroup
          name="FirstLineFileFormat_usernameStyle"
          value={options.usernameStyle}
          onChange={(event: React.InputHTMLAttributes<HTMLInputElement>, value: UsernameStyle) => updateOptions({
            ...options,
            usernameStyle: value,
          })}
        >
          <FormControlLabel value="None" control={<Radio />} label="None"/>
          <FormControlLabel value="SecondLine" control={<Radio />} label="SecondLine"/>
          <FormControlLabel value="LastPathPart" control={<Radio />} label="LastPathPart"/>
        </RadioGroup>
      </FormControl>
    </div>
  );
}
