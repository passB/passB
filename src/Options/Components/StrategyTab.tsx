import {FormControl, InputLabel, MenuItem, Select} from "material-ui";
import * as React from 'react';
import {OptionsList} from "../Options";
import {OptionsReceiverInterface} from "../OptionsReceiver";

interface Props {
  label: string;
  strategies: Array<OptionsReceiverInterface<{}>>;
  strategyOptions: OptionsList;
  selectedStrategyName: string;
  updateOptions: (newOptions: OptionsList) => void;
  updateSelectedStrategyName: (selectedStrategyName: string) => void;
}

export class StrategyTab extends React.Component<Props> {
  public render(): JSX.Element {
    const {
      label,
      strategies,
      selectedStrategyName,
      strategyOptions,
      updateOptions,
      updateSelectedStrategyName,
    } = this.props;

    const selectedStrategy = strategies.find(
      (strategy: OptionsReceiverInterface<{}>) => strategy.name === selectedStrategyName,
    ) as OptionsReceiverInterface<{}>;

    const {OptionsPanel} = selectedStrategy;

    return (
      <div>
        <h2>{browser.i18n.getMessage(label)}</h2>
        <FormControl>
          <InputLabel>Selected Strategy:</InputLabel>
          <Select
            value={selectedStrategyName}
            onChange={(e: any) => updateSelectedStrategyName(e.target.value)}
          >
            {strategies.map((strategy: OptionsReceiverInterface<{}>, index: number) =>
              <MenuItem key={index} value={strategy.name}>{strategy.name}</MenuItem>,
            )}
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
}
