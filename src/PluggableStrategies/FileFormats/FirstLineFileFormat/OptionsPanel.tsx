import {FormControl, FormControlLabel, FormLabel} from 'material-ui';
import {default as Radio, RadioGroup} from 'material-ui/Radio';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options, UsernameStyle} from './FirstLineFileFormat';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <FormControl fullWidth={true}>
      <FormLabel>Get username from:</FormLabel>
      <RadioGroup
        name="FirstLineFileFormat_usernameStyle"
        value={options.get('usernameStyle')}
        onChange={(event: React.InputHTMLAttributes<HTMLInputElement>, value: UsernameStyle) =>
          updateOptions(options.set('usernameStyle', value))
        }
      >
        <FormControlLabel
          value="None"
          control={<Radio/>}
          label={browser.i18n.getMessage('options_firstlinefileformat_usernameStyle_none')}
        />
        <FormControlLabel
          value="SecondLine"
          control={<Radio/>}
          label={browser.i18n.getMessage('options_firstlinefileformat_usernameStyle_secondLine')}
        />
        <FormControlLabel
          value="LastPathPart"
          control={<Radio/>}
          label={browser.i18n.getMessage('options_firstlinefileformat_usernameStyle_lastPathPart')}
        />
      </RadioGroup>
    </FormControl>
  );
}
