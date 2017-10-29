import {List, Map} from 'immutable';
import {reducerWithInitialState} from 'typescript-fsa-reducers';
import {ExtensionName, StrategyName, StrategyType} from 'State/Interfaces';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';
import * as Actions from './Actions';
import {
  ExtensionNameArgs,
  ExtensionOptionsArgs,
  OptionsState,
  StrategyNameArgs,
  StrategyOptionsArgs,
  } from './Interfaces';

const setExtensionDefaultOptions =
  (oldState: OptionsState, {extensionName, options}: ExtensionOptionsArgs): OptionsState =>
    oldState.updateIn(['extensionsDefaultOptions', extensionName], () => options);

const setExtensionOptions =
  (oldState: OptionsState, {extensionName, options}: ExtensionOptionsArgs): OptionsState =>
    oldState.updateIn(['extensionsOptions', extensionName], () => options);

const enableExtension = (oldState: OptionsState, {extensionName}: ExtensionNameArgs): OptionsState =>
  oldState.updateIn(
    ['enabledExtensions'],
    (enabledExtensions: List<ExtensionName> = List<ExtensionName>()) =>
      enabledExtensions.includes(extensionName) ? enabledExtensions : enabledExtensions.push(extensionName),
  );

const disableExtension = (oldState: OptionsState, {extensionName}: ExtensionNameArgs): OptionsState =>
  oldState.updateIn(
    ['enabledExtensions'],
    (enabledExtensions: List<ExtensionName> = List<ExtensionName>()) => {
      const index = enabledExtensions.findIndex((item: ExtensionName) => item === extensionName);
      if (index === -1) {
        return enabledExtensions;
      }
      return enabledExtensions.delete(index);
    },
  );

const setStrategyDefaultOptions =
  (oldState: OptionsState, {strategyType, strategyName, options}: StrategyOptionsArgs): OptionsState =>
    oldState.updateIn(['strategyDefaultOptions', strategyType, strategyName], () => options);

const setStrategyOptions =
  (oldState: OptionsState, {strategyType, strategyName, options}: StrategyOptionsArgs): OptionsState =>
    oldState.updateIn(['strategyOptions', strategyType, strategyName], () => options);

const setSelectedStrategy = (oldState: OptionsState, {strategyType, strategyName}: StrategyNameArgs): OptionsState =>
  oldState.updateIn(['selectedStrategies', strategyType], () => strategyName);

const initialState: OptionsState = createTypedMap({
  enabledExtensions: List<ExtensionName>(['Pass']),
  extensionsDefaultOptions: Map<ExtensionName, TypedMap<{}>>(),
  extensionsOptions: Map<ExtensionName, TypedMap<{}>>(),
  selectedStrategies: Map<StrategyType, StrategyName>(),
  strategyDefaultOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>(),
  strategyOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>(),
});

export const reducer = reducerWithInitialState(initialState)
  .case(Actions.setExtensionDefaultOptions, setExtensionDefaultOptions)
  .case(Actions.setExtensionOptions, setExtensionOptions)
  .case(Actions.enableExtension, enableExtension)
  .case(Actions.disableExtension, disableExtension)
  .case(Actions.setStrategyDefaultOptions, setStrategyDefaultOptions)
  .case(Actions.setStrategyOptions, setStrategyOptions)
  .case(Actions.setSelectedStrategy, setSelectedStrategy)
  .build();
