import {List, Map} from 'immutable';
import {createSelector} from 'reselect';
import {TypedMap} from '../Types/TypedMap';
import {
  ExtensionName,
  OptionsState,
  StrategyName,
  StrategyType,
  } from './Interfaces';

export const getEnabledExtensions = (state: OptionsState): List<ExtensionName> => state.get('enabledExtensions', List());
const getExtensionDefaultOptions = (state: OptionsState) => state.get('extensionsDefaultOptions', Map());
const getExtensionSpecifiedOptions = (state: OptionsState) => state.get('extensionsOptions', Map());

export const getAllExtensionOptions: (state: OptionsState) => Map<ExtensionName, TypedMap<{}>> =
  createSelector(
    getExtensionDefaultOptions,
    getExtensionSpecifiedOptions,
    (
      defaultOptions: Map<ExtensionName, TypedMap<{}>>,
      specifiedOptions: Map<ExtensionName, TypedMap<{}>>,
    ) => Map<ExtensionName, TypedMap<{}>>().mergeDeep(defaultOptions, specifiedOptions),
  );

export const getExtensionOptions = (state: OptionsState, extensionName: ExtensionName) =>
  getAllExtensionOptions(state).get(extensionName, Map()); // tslint:disable-line:no-any

export const getSelectedStrategies = (state: OptionsState): Map<StrategyType, StrategyName> =>
  state.get('selectedStrategies', Map());

export const getSelectedStrategy = (state: OptionsState, strategyType: StrategyType): string | undefined =>
  getSelectedStrategies(state).get(strategyType);

const getStrategyDefaultOptions = (state: OptionsState) => state.get('strategyDefaultOptions', Map());
const getStrategySpecifiedOptions = (state: OptionsState) => state.get('strategyOptions', Map());

export const getAllStrategyOptions: (state: OptionsState) => Map<StrategyType, Map<StrategyName, TypedMap<{}>>> =
  createSelector(
    getStrategyDefaultOptions,
    getStrategySpecifiedOptions,
    (
      defaultOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>,
      specifiedOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>,
    ) => Map<StrategyType, Map<StrategyName, TypedMap<{}>>>().mergeDeep(defaultOptions, specifiedOptions),
  );

export const getStrategyOptions = (state: OptionsState, strategyType: StrategyType, strategyName: StrategyName) =>
  getAllStrategyOptions(state).getIn(
    [strategyType, strategyName],
    Map(),
  );
