import {StrategyName, StrategyType} from 'State/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';
import {OptionsPanelType} from './OptionsPanel';

export interface Strategy<OptionType extends MapTypeAllowedData<OptionType>> {
  readonly OptionsPanel?: OptionsPanelType<OptionType>;
  readonly type: StrategyType;
  readonly name: StrategyName;
  readonly defaultOptions: TypedMap<OptionType>;
}
