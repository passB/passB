import {Checkbox, FormControl, FormControlLabel, TextField} from 'material-ui';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options} from './PrefixFileFormat';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <FormControl fullWidth={true}>
      <FormControlLabel
        id="passwordFirstLine"
        control={
          <Checkbox
            checked={options.get('passwordFirstLine')}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => updateOptions(options.set('passwordFirstLine', isChecked))
            }
          />
        }
        label="Password is in first line (without prefix)"
      />
      {!options.get('passwordFirstLine') &&
      <TextField
        id="passwordPrefix"
        label={browser.i18n.getMessage('options_prefixfileformat_passwordPrefix')}
        value={options.get('passwordPrefix')}
        onChange={
          (event: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('passwordPrefix', event.target.value))
        }
      />
      }
      <TextField
        id="usernamePrefix"
        label={browser.i18n.getMessage('options_prefixfileformat_usernamePrefix')}
        value={options.get('usernamePrefix')}
        onChange={
          (event: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('usernamePrefix', event.target.value))
        }
      />
      <FormControlLabel
        id="trimWhitespace"
        control={
          <Checkbox
            checked={options.get('trimWhitespace')}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) =>  updateOptions(options.set('trimWhitespace', isChecked))
            }
          />
        }
        label={browser.i18n.getMessage('options_prefixfileformat_trimWhitespace')}
      />
    </FormControl>
  );
}
