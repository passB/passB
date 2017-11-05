import {List, Map} from 'immutable';
import {createSelector} from 'reselect';
import {Extension, Strategy} from 'InjectableInterfaces';
import {StoreContents} from 'InjectableInterfaces/State';
import {ExtensionName, StrategyName, StrategyType} from 'State/Interfaces';
import {getOptionsState} from 'State/Selectors';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';
import {OptionsState} from './Interfaces';

export const getEnabledExtensions = createSelector(
  getOptionsState,
  (state: OptionsState): List<ExtensionName> => state.get('enabledExtensions', List()),
);

export const getAllExtensionOptions = createSelector(
  getOptionsState,
  (state: OptionsState) => state.get('extensionsOptions', Map()),
);

export const getExtensionOptions = <OptionType extends MapTypeAllowedData<OptionType>>(
  extensionOptions: Map<ExtensionName, TypedMap<{}>>,
  extension: Extension<OptionType>,
): TypedMap<OptionType> => extension.defaultOptions.mergeDeep(
  extensionOptions.get(extension.name, Map()),
);

export const getSelectedStrategies = createSelector(
  getOptionsState,
  (state: OptionsState): Map<StrategyType, StrategyName> =>
    state.get('selectedStrategies', Map()),
);

export const getSelectedStrategy = (state: StoreContents, strategyType: StrategyType): string | undefined =>
  getSelectedStrategies(state).get(strategyType);

const getAllStrategyOptions: (state: StoreContents) => Map<StrategyType, Map<StrategyName, TypedMap<{}>>> = createSelector(
  getOptionsState,
  (state: OptionsState) => state.get('strategyOptions', Map()),
);

export const getStrategyOptions: <OptionType extends MapTypeAllowedData<OptionType>>(
  state: StoreContents,
  strategy: Strategy<OptionType>,
) => TypedMap<OptionType> = createSelector(
  getAllStrategyOptions,
  <OptionType extends MapTypeAllowedData<OptionType>>(_: StoreContents, strategy: Strategy<OptionType>) => strategy,
  <OptionType extends MapTypeAllowedData<OptionType>>(
    strategyOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>,
    strategy: Strategy<OptionType>,
  ): TypedMap<OptionType> =>
    strategy.defaultOptions.mergeDeep(
      strategyOptions.getIn([strategy.type, strategy.name], Map()),
    ),
);
