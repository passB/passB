import {Set} from 'immutable';
import {reducerWithInitialState} from 'typescript-fsa-reducers';
import * as Actions from './Actions';
import {
  ExtensionName,
  ExtensionNameArgs,
  ExtensionOptionsArgs,
  OptionsState, OptionsStateFactory,
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
    (enabledExtensions: Set<ExtensionName> = Set<ExtensionName>()) => enabledExtensions.add(extensionName),
  );

const disableExtension = (oldState: OptionsState, {extensionName}: ExtensionNameArgs): OptionsState =>
  oldState.updateIn(
    ['enabledExtensions'],
    (enabledExtensions: Set<ExtensionName> = Set<ExtensionName>()) => enabledExtensions.remove(extensionName),
  );

const setStrategyDefaultOptions =
  (oldState: OptionsState, {strategyType, strategyName, options}: StrategyOptionsArgs): OptionsState =>
    oldState.updateIn(['strategyDefaultOptions', strategyType, strategyName], () => options);

const setStrategyOptions =
  (oldState: OptionsState, {strategyType, strategyName, options}: StrategyOptionsArgs): OptionsState =>
    oldState.updateIn(['strategyOptions', strategyType, strategyName], () => options);

const setSelectedStrategy = (oldState: OptionsState, {strategyType, strategyName}: StrategyNameArgs): OptionsState =>
  oldState.updateIn(['selectedStrategies', strategyType], () => strategyName);

export const reducer = reducerWithInitialState(OptionsStateFactory())
  .case(Actions.setExtensionDefaultOptions, setExtensionDefaultOptions)
  .case(Actions.setExtensionOptions, setExtensionOptions)
  .case(Actions.enableExtension, enableExtension)
  .case(Actions.disableExtension, disableExtension)
  .case(Actions.setStrategyDefaultOptions, setStrategyDefaultOptions)
  .case(Actions.setStrategyOptions, setStrategyOptions)
  .case(Actions.setSelectedStrategy, setSelectedStrategy)
  .build();
