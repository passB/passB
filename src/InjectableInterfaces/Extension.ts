import {RouteProps} from 'react-router';
import {ExtensionName} from 'State/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';
import {OptionsPanelType} from './OptionsPanel';

export interface Extension<OptionType extends MapTypeAllowedData<OptionType>> {
  readonly routes: RouteProps[];
  readonly OptionsPanel?: OptionsPanelType<OptionType>;
  readonly actions: string[];
  readonly name: ExtensionName;
  readonly defaultOptions: TypedMap<OptionType>;
  initializeList(): Promise<void>;
  getLabelForAction(action: string): string;
  executeAction(action: string, entry: string, options: ExecutionOptions): void;

}

export interface ExecutionOptions {
  navigateTo: (newUrl: string, state: {}) => void;
}
