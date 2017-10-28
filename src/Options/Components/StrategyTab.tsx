import {FormControl, InputLabel, MenuItem, Select} from 'material-ui';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName} from 'State/Options/Interfaces';
import {TypedMap} from 'State/Types/TypedMap';

interface Props {
  label: string;
  strategies: Array<BaseStrategy<{}>>;
  strategyOptions: TypedMap<{}>;
  selectedStrategyName: StrategyName;
  updateOptions: (newOptions: TypedMap<{}>) => void;
  updateSelectedStrategyName: (selectedStrategyName: StrategyName) => void;
}

const styles = {
  fullWidth: {
    width: '100%',
  },
};

export const StrategyTab = withStyles<keyof typeof styles>(styles)(
  class extends React.Component<Props & WithStyles<keyof typeof styles>> {
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
        (strategy: BaseStrategy<{}>) => strategy.name === selectedStrategyName,
      )!;

      const {OptionsPanel} = selectedStrategy;

      console.log('passing options to child:', strategyOptions, strategyOptions.toJS());

      return (
        <div>
          <FormControl className={classes.fullWidth}>
            <InputLabel>Selected Strategy:</InputLabel>
            <Select
              value={selectedStrategyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSelectedStrategyName(e.target.value)}
            >
              {strategies.map((strategy: BaseStrategy<{}>, index: number) => (
                <MenuItem key={index} value={strategy.name}>
                  {browser.i18n.getMessage(`label_${strategy.name}`) || strategy.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br/>
          {OptionsPanel && (
            <OptionsPanel
              options={strategyOptions}
              updateOptions={updateOptions}
            />
          )}
        </div>
      );
    }
  },
);
