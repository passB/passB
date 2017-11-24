import {FormControl, TextField} from 'material-ui';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options} from './FuzzaldrinMatcher';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <FormControl fullWidth={true}>
      <TextField
        label={browser.i18n.getMessage('options_fuzzaldrinmatcher_minScore')}
        helperText={browser.i18n.getMessage('options_fuzzaldrinmatcher_minScore_helperText')}
        value={options.get('minScore')}
        onChange={
          (e: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('minScore', Math.max(0, e.target.valueAsNumber)))
        }
        type="number"
      />
      <br/>
      <TextField
        label={browser.i18n.getMessage('options_fuzzaldrinmatcher_maxResults')}
        helperText={browser.i18n.getMessage('options_fuzzaldrinmatcher_maxResults_helperText')}
        value={options.get('maxResults')}
        onChange={
          (e: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('maxResults', Math.max(0, e.target.valueAsNumber)))
        }
        type="number"
      />
    </FormControl>
  );
}
