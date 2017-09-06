import {OptionPanelProps, OptionsPanelType} from "Options/OptionsReceiver";
import {FileFormat} from "./FileFormat";

import {default as Radio, RadioGroup} from 'material-ui/Radio';
import * as React from 'react';
import  {FormControlLabel} from "material-ui";

export type UsernameStyle = "None" | "SecondLine" | "LastPathPart";
interface Options {
  usernameStyle: UsernameStyle;
}

export class FirstLineFileFormat extends FileFormat<Options> {
  public readonly defaultOptions: Options = {
    usernameStyle: "SecondLine",
  };
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

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
      <RadioGroup
        name="FirstLineFileFormat_usernameStyle"
        selectedValue={options.usernameStyle}
        onChange={(event: React.InputHTMLAttributes<HTMLInputElement>, value: UsernameStyle) => {
          console.log(event, value, options.usernameStyle === value);
          updateOptions({
            ...options,
            usernameStyle: value,
          });
        }}
      >
        <FormControlLabel value="None" control={<Radio />} label="None"/>
        <FormControlLabel value="SecondLine" control={<Radio />} label="SecondLine"/>
        <FormControlLabel value="LastPathPart" control={<Radio />} label="LastPathPart"/>

      </RadioGroup>
    </div>
  );
}
