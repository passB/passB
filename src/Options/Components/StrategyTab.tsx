import {FormControl, InputLabel, MenuItem, Select} from 'material-ui';
import {withStyles, ClassProps} from 'material-ui/styles';
import * as React from 'react';
import {OptionsList} from '../Options';
import {OptionsReceiverInterface} from '../OptionsReceiver';

interface Props {
  label: string;
  strategies: Array<OptionsReceiverInterface<{}>>;
  strategyOptions: OptionsList;
  selectedStrategyName: string;
  updateOptions: (newOptions: OptionsList) => void;
  updateSelectedStrategyName: (selectedStrategyName: string) => void;
}

const styles = {
  fullWidth: {
    width: '100%',
  },
};

export const StrategyTab = withStyles<Props>(styles)(
  class extends React.Component<Props & ClassProps<typeof styles>> {
    public render(): JSX.Element {
      const {
        strategies,
        selectedStrategyName,
        strategyOptions,
        updateOptions,
        updateSelectedStrategyName,
        classes,
      } = this.props;

      const selectedStrategy = strategies.find(
        (strategy: OptionsReceiverInterface<{}>) => strategy.name === selectedStrategyName,
      ) as OptionsReceiverInterface<{}>;

      const {OptionsPanel} = selectedStrategy;

      return (
        <div>
          <FormControl className={classes.fullWidth}>
            <InputLabel>Selected Strategy:</InputLabel>
            <Select
              value={selectedStrategyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedStrategyName(e.target.value)}
            >
              {strategies.map((strategy: OptionsReceiverInterface<{}>, index: number) => (
                <MenuItem key={index} value={strategy.name}>
                  {browser.i18n.getMessage(`label_${strategy.name}`) || strategy.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>
          {OptionsPanel && (
            <OptionsPanel
              options={strategyOptions[selectedStrategyName]}
              updateOptions={(newOptions: {}) => updateOptions({
                ...strategyOptions,
                [selectedStrategyName]: newOptions,
              })}
            />
          )}
        </div>
      );
    }
  },
);
