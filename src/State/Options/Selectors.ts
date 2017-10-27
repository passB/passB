import {Map, Set} from 'immutable';
import {createSelector} from 'reselect';
import {
  ExtensionName,
  OptionsDataType,
  OptionsState,
  StrategyName,
  StrategyType,
} from './Interfaces';

export const getEnabledExtensions = (state: OptionsState): Set<ExtensionName> => state.enabledExtensions;
const getExtensionDefaultOptions = (state: OptionsState) => state.extensionsDefaultOptions;
const getExtensionSpecifiedOptions = (state: OptionsState) => state.extensionsOptions;

export const getAllExtensionOptions: (state: OptionsState) => Map<ExtensionName, OptionsDataType<{}>> =
  createSelector(
    getExtensionDefaultOptions,
    getExtensionSpecifiedOptions,
    (
      defaultOptions: Map<ExtensionName, OptionsDataType<{}>>,
      specifiedOptions: Map<ExtensionName, OptionsDataType<{}>>,
    ) => defaultOptions.mergeDeep(specifiedOptions),
  );

export const getExtensionOptions = (state: OptionsState, extensionName: ExtensionName) =>
  getAllExtensionOptions(state).get(extensionName, Map<string, any>() as OptionsDataType<{}>); // tslint:disable-line:no-any

export const getSelectedStrategies = (state: OptionsState): Map<StrategyType, StrategyName> =>
  state.selectedStrategies;

export const getSelectedStrategy = (state: OptionsState, strategyType: StrategyType): string | undefined =>
  getSelectedStrategies(state).get(strategyType);

const getStrategyDefaultOptions = (state: OptionsState) => state.strategyDefaultOptions;
const getStrategySpecifiedOptions = (state: OptionsState) => state.strategyOptions;

export const getAllStrategyOptions: (state: OptionsState) => Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>> =
  createSelector(
    getStrategyDefaultOptions,
    getStrategySpecifiedOptions,
    (
      defaultOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>,
      specifiedOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>,
    ) => defaultOptions.mergeDeep(specifiedOptions),
  );

export const getStrategyOptions = (state: OptionsState, strategyType: StrategyType, strategyName: StrategyName) =>
  getAllStrategyOptions(state).getIn(
    [strategyType, strategyName],
    Map<string, any>() as OptionsDataType<{}>,  // tslint:disable-line:no-any
  );
