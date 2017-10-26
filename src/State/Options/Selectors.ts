import {Map, Set} from 'immutable';
import {createSelector} from 'reselect';
import {
  ExtensionName,
  ExtensionOptions,
  OptionsState,
  StrategyName,
  StrategyOptions,
  StrategyType,
} from './Interfaces';

export const getEnabledExtensions = (state: OptionsState): Set<ExtensionName> => state.enabledExtensions;
const getExtensionDefaultOptions = (state: OptionsState) => state.extensionsDefaultOptions;
const getExtensionSpecifiedOptions = (state: OptionsState) => state.extensionsOptions;

export const getExtensionOptions: (state: OptionsState) => Map<ExtensionName, ExtensionOptions> =
  createSelector(
    getExtensionDefaultOptions,
    getExtensionSpecifiedOptions,
    (
      defaultOptions: Map<ExtensionName, ExtensionOptions>,
      specifiedOptions: Map<ExtensionName, ExtensionOptions>,
    ) => defaultOptions.mergeDeep(specifiedOptions),
  );

export const getSelectedStrategies = (state: OptionsState): Map<StrategyType, StrategyName> =>
  state.selectedStrategies;

const getStrategyDefaultOptions = (state: OptionsState) => state.strategyDefaultOptions;
const getStrategySpecifiedOptions = (state: OptionsState) => state.strategyOptions;

export const getStrategyOptions: (state: OptionsState) => Map<StrategyType, Map<StrategyName, StrategyOptions>> =
  createSelector(
    getStrategyDefaultOptions,
    getStrategySpecifiedOptions,
    (
      defaultOptions: Map<StrategyType, Map<StrategyName, StrategyOptions>>,
      specifiedOptions: Map<StrategyType, Map<StrategyName, StrategyOptions>>,
    ) => defaultOptions.mergeDeep(specifiedOptions),
  );
