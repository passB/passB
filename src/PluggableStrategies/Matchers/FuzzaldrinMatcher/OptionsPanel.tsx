import {TextField} from 'material-ui';
import * as React from 'react';
import {OptionPanelProps} from 'Options/OptionsReceiver';
import {Options} from './FuzzaldrinMatcher';

export function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <div>
      <TextField
        label="Minimum score:"
        helperText=""
        value={options.minScore}
        onChange={(e: any) => updateOptions({ // tslint:disable-line:no-any
          // required until material-ui get their typings right
          // this will be finally fixed with beta v1.0.0-beta.17
          ...options,
          minScore: Math.max(0, (e as React.ChangeEvent<HTMLInputElement>).target.valueAsNumber),
        })}
        type="number"
      />
      <br/>
      <TextField
        label="Maximum visible results:"
        helperText="to show all results, enter '0'"
        value={options.maxResults}
        onChange={(e: any) => updateOptions({ // tslint:disable-line:no-any
          // required until material-ui get their typings right
          ...options,
          maxResults: Math.max(0, (e as React.ChangeEvent<HTMLInputElement>).target.valueAsNumber),
        })}
        type="number"
      />
    </div>
  );
}
