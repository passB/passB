import {ComponentType} from 'react';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export interface OptionPanelProps<OptionType extends MapTypeAllowedData<OptionType>> {
  options: TypedMap<OptionType>;
  updateOptions: (newOptions: TypedMap<OptionType>) => void;
}

export type OptionsPanelType<OptionType extends MapTypeAllowedData<OptionType>> = ComponentType<OptionPanelProps<OptionType>>;
