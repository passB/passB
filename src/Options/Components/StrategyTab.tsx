import {FormControl, MenuItem, Select, Typography} from 'material-ui';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {StoreContents} from 'InjectableInterfaces/State';
import {Strategy} from 'InjectableInterfaces/Strategy';
import {StrategyType} from 'State/Interfaces';
import {setSelectedStrategy, setStrategyOptions} from 'State/Options/Actions';
import {StrategyNameArgs, StrategyOptionsArgs} from 'State/Options/Interfaces';
import {getSelectedStrategy, getStrategyOptions} from 'State/Options/Selectors';
import {TypedMap} from 'State/Types/TypedMap';

interface Props {
  label: string;
  strategies: Array<Strategy<{}>>;
  strategyType: StrategyType;
}

interface ConnectedProps {
  selectedStrategy: Strategy<{}>;
  selectedStrategyOptions: TypedMap<{}>;
  setSelectedStrategy: (args: StrategyNameArgs) => void;
  setStrategyOptions: (args: StrategyOptionsArgs) => void;
}

const styles = {
  fullWidth: {
    width: '100%',
  },
  minHeight: {
    minHeight: '200px',
  },
  padding: {
    padding: '24px',
  },
  topPadding: {
    paddingTop: '24px',
  },
};

const StrategyTabComponent = (
  {
    strategies,
    strategyType,
    selectedStrategy,
    selectedStrategyOptions,
    // tslint:disable:no-shadowed-variable
    setSelectedStrategy,
    setStrategyOptions,
    // tslint:enable:no-shadowed-variable
    classes,
  }: Props & ConnectedProps & WithStyles<keyof typeof styles>,
): JSX.Element => (
  <div className={`${classes.minHeight} ${classes.padding}`}>
    <Typography type="title" gutterBottom={true}>
      Selected Strategy
    </Typography>
    <FormControl className={classes.fullWidth}>
      <Select
        value={selectedStrategy.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedStrategy({strategyType, strategyName: e.target.value})}
      >
        {strategies.map((strategy: Strategy<{}>, index: number) => (
          <MenuItem key={index} value={strategy.name}>
            {browser.i18n.getMessage(`options_${strategy.name}_label`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {selectedStrategy.OptionsPanel &&
    <Typography type="title" gutterBottom={true} className={classes.topPadding}>
      Strategy Options
    </Typography>
    }
    {selectedStrategy.OptionsPanel && (
      <selectedStrategy.OptionsPanel
        options={selectedStrategyOptions}
        updateOptions={(options: TypedMap<{}>) => setStrategyOptions({
          strategyType: selectedStrategy.type,
          strategyName: selectedStrategy.name,
          options,
        })}
      />
    )}
  </div>
);

const mapStateToProps = (state: StoreContents, props: Props) => {
  const selectedStrategyName = getSelectedStrategy(state, props.strategyType);
  const selectedStrategy = props.strategies.find(
    (strategy: Strategy<{}>) => strategy.name === selectedStrategyName,
  ) || props.strategies[0];
  return {
    selectedStrategy,
    selectedStrategyOptions: getStrategyOptions(state, selectedStrategy),
  };
};

export const StrategyTab = compose<React.ComponentType<Props>>(
  withStyles<keyof typeof styles>(styles),
  connect(
    mapStateToProps,
    {
      setSelectedStrategy,
      setStrategyOptions,
    },
  ),
)(StrategyTabComponent);
