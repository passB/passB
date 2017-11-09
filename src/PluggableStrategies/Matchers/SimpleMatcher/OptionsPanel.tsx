import {Checkbox, FormControl, FormControlLabel} from 'material-ui';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options} from './SimpleMatcher';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <FormControl>
      <FormControlLabel
        id="autoWww"
        control={
          <Checkbox
            checked={options.get('autoWww')}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => updateOptions(options.set('autoWww', isChecked))
            }
          />
        }
        label={browser.i18n.getMessage('options_simplematcher_autoWww')}
      />
      <FormControlLabel
        id="matchInSubDirs"
        control={
          <Checkbox
            checked={options.get('matchInSubDirs')}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => updateOptions(options.set('matchInSubDirs', isChecked))
            }
          />
        }
        label={browser.i18n.getMessage('options_simplematcher_matchInSubDirs')}
      />
      <FormControlLabel
        id="ignoreLastPart"
        control={
          <Checkbox
            checked={options.get('ignoreLastPart')}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => updateOptions(options.set('ignoreLastPart', isChecked))
            }
          />
        }
        label={browser.i18n.getMessage('options_simplematcher_ignoreLastPart')}
      />
      <FormControlLabel
        id="requireFullMatch"
        control={
          <Checkbox
            checked={options.get('requireFullMatch')}
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => updateOptions(options.set('requireFullMatch', isChecked))
            }
          />
        }
        label={browser.i18n.getMessage('options_simplematcher_requireFullMatch')}
      />
    </FormControl>
  );
}
