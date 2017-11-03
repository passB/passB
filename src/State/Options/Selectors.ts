import {List, Map} from 'immutable';
import {createSelector} from 'reselect';
import {ExtensionName, StrategyName, StrategyType} from 'State/Interfaces';
import {getOptionsState} from 'State/Selectors';
import {StoreContents} from 'InjectableInterfaces/State';
import {TypedMap} from 'State/Types/TypedMap';
import {OptionsState} from './Interfaces';

export const getEnabledExtensions = createSelector(
  getOptionsState,
  (state: OptionsState): List<ExtensionName> => state.get('enabledExtensions', List()),
);

const getExtensionDefaultOptions = createSelector(
  getOptionsState,
  (state: OptionsState) => state.get('extensionsDefaultOptions', Map()),
);

const getExtensionSpecifiedOptions = createSelector(
  getOptionsState,
  (state: OptionsState) => state.get('extensionsOptions', Map()),
);

export const getAllExtensionOptions: (state: StoreContents) => Map<ExtensionName, TypedMap<{}>> =
  createSelector(
    getExtensionDefaultOptions,
    getExtensionSpecifiedOptions,
    (
      defaultOptions: Map<ExtensionName, TypedMap<{}>>,
      specifiedOptions: Map<ExtensionName, TypedMap<{}>>,
    ) => Map<ExtensionName, TypedMap<{}>>().mergeDeep(defaultOptions, specifiedOptions),
  );

export const getExtensionOptions = (state: StoreContents, extensionName: ExtensionName) =>
  getAllExtensionOptions(state).get(extensionName, Map()); // tslint:disable-line:no-any

export const getSelectedStrategies = createSelector(
  getOptionsState,
  (state: OptionsState): Map<StrategyType, StrategyName> =>
    state.get('selectedStrategies', Map()),
);

export const getSelectedStrategy = (state: StoreContents, strategyType: StrategyType): string | undefined =>
  getSelectedStrategies(state).get(strategyType);

const getStrategyDefaultOptions = createSelector(
  getOptionsState,
  (state: OptionsState) => state.get('strategyDefaultOptions', Map()),
);
const getStrategySpecifiedOptions = createSelector(
  getOptionsState,
  (state: OptionsState) => state.get('strategyOptions', Map()),
);

export const getAllStrategyOptions: (state: StoreContents) => Map<StrategyType, Map<StrategyName, TypedMap<{}>>> =
  createSelector(
    getStrategyDefaultOptions,
    getStrategySpecifiedOptions,
    (
      defaultOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>,
      specifiedOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>,
    ) => Map<StrategyType, Map<StrategyName, TypedMap<{}>>>().mergeDeep(defaultOptions, specifiedOptions),
  );

export const getStrategyOptions = (state: StoreContents, strategyType: StrategyType, strategyName: StrategyName) =>
  getAllStrategyOptions(state).getIn(
    [strategyType, strategyName],
    Map(),
  );
