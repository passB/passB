import {TextField} from 'material-ui';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options} from './FuzzaldrinMatcher';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <div>
      <TextField
        label="Minimum score:"
        helperText=""
        value={options.get('minScore')}
        onChange={
          (e: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('minScore', Math.max(0, e.target.valueAsNumber)))
        }
        type="number"
      />
      <br/>
      <TextField
        label="Maximum visible results:"
        helperText="to show all results, enter '0'"
        value={options.get('maxResults')}
        onChange={
          (e: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('maxResults', Math.max(0, e.target.valueAsNumber)))
        }
        type="number"
      />
    </div>
  );
}
