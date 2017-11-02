import {FormControl, FormControlLabel, FormLabel} from 'material-ui';
import {default as Radio, RadioGroup} from 'material-ui/Radio';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options, UsernameStyle} from './FirstLineFileFormat';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <div>
      <FormControl>
        <FormLabel>Get username from:</FormLabel>
        <RadioGroup
          name="FirstLineFileFormat_usernameStyle"
          value={options.get('usernameStyle')}
          onChange={(event: React.InputHTMLAttributes<HTMLInputElement>, value: UsernameStyle) =>
            updateOptions(options.set('usernameStyle', value))
          }
        >
          <FormControlLabel value="None" control={<Radio/>} label="None"/>
          <FormControlLabel value="SecondLine" control={<Radio/>} label="SecondLine"/>
          <FormControlLabel value="LastPathPart" control={<Radio/>} label="LastPathPart"/>
        </RadioGroup>
      </FormControl>
    </div>
  );
}
