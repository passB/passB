import {actionCreatorFactory} from 'typescript-fsa';
import {ExtensionNameArgs, ExtensionOptionsArgs, StrategyNameArgs, StrategyOptionsArgs} from './Interfaces';

const actionCreator = actionCreatorFactory('OPTIONS');

export const actions = {
  setExtensionDefaultOptions:
    actionCreator<ExtensionOptionsArgs>('SET_EXTENSION_DEFAULT_OPTIONS'),
  setExtensionOptions:
    actionCreator<ExtensionOptionsArgs>('SET_EXTENSION_OPTIONS'),
  enableExtension:
    actionCreator<ExtensionNameArgs>('ENABLE_EXTENSION'),
  disableExtension:
    actionCreator<ExtensionNameArgs>('DISABLE_EXTENSION'),
  setStrategyDefaultOptions:
    actionCreator<StrategyOptionsArgs>('SET_STRATEGY_DEFAULT_OPTIONS'),
  setStrategyOptions:
    actionCreator<StrategyOptionsArgs>('SET_STRATEGY_OPTIONS'),
  setSelectedStrategy:
    actionCreator<StrategyNameArgs>('SET_SELECTED_STRATEGY'),
};
