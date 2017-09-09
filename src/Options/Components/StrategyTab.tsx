import * as React from 'react';
import {OptionsList} from "../Options";
import {OptionsReceiverInterface} from "../OptionsReceiver";
import {DropDown} from "./DropDown";

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
    } = this.props;

    const selectedStrategy = strategies.find(
      (strategy: OptionsReceiverInterface<{}>) => strategy.name === selectedStrategyName,
    ) as OptionsReceiverInterface<{}>;

    const selectedStrategyIndex = strategies.indexOf(selectedStrategy);

    const {OptionsPanel} = selectedStrategy;

    return (
      <div>
        <h2>{browser.i18n.getMessage(label)}</h2>
        <DropDown
          options={strategies.map((strategy: OptionsReceiverInterface<{}>) => strategy.name)}
          label="select..."
          selectedIndex={selectedStrategyIndex}
          onChange={() => 0}
        /> <br/>
        {OptionsPanel && (
          <OptionsPanel
            options={strategyOptions[selectedStrategyName]}
            updateOptions={(newOptions: {}) => this.props.updateOptions({
              ...strategyOptions,
              [selectedStrategyName]: newOptions,
            })}
          />
        )}
      </div>
    );
  }
}
