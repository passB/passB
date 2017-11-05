import {actionCreatorFactory} from 'typescript-fsa';
import {ExtensionNameArgs, ExtensionOptionsArgs, StrategyNameArgs, StrategyOptionsArgs} from './Interfaces';

const actionCreator = actionCreatorFactory('OPTIONS');

export const setExtensionOptions =
  actionCreator<ExtensionOptionsArgs>('SET_EXTENSION_OPTIONS');
export const enableExtension =
  actionCreator<ExtensionNameArgs>('ENABLE_EXTENSION');
export const disableExtension =
  actionCreator<ExtensionNameArgs>('DISABLE_EXTENSION');
export const setStrategyOptions =
  actionCreator<StrategyOptionsArgs>('SET_STRATEGY_OPTIONS');
export const setSelectedStrategy =
  actionCreator<StrategyNameArgs>('SET_SELECTED_STRATEGY');
