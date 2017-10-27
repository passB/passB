import {ComponentType} from 'react';
import { OptionsDataType } from 'State/Options';

export interface OptionPanelProps<OptionType> {
  options: OptionsDataType<OptionType>;
  updateOptions: (newOptions: OptionsDataType<OptionType>) => void;
}

export type OptionsPanelType<OptionType> = ComponentType<OptionPanelProps<OptionType>>;
