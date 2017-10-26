import {Set} from 'immutable';
import {reducerWithInitialState} from 'typescript-fsa-reducers';
import {actions} from './Actions';
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
    (enabledExtensions: Set<ExtensionName>) => enabledExtensions.add(extensionName),
  );

const disableExtension = (oldState: OptionsState, {extensionName}: ExtensionNameArgs): OptionsState =>
  oldState.updateIn(
    ['enabledExtensions'],
    (enabledExtensions: Set<ExtensionName>) => enabledExtensions.remove(extensionName),
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
  .case(actions.setExtensionDefaultOptions, setExtensionDefaultOptions)
  .case(actions.setExtensionOptions, setExtensionOptions)
  .case(actions.enableExtension, enableExtension)
  .case(actions.disableExtension, disableExtension)
  .case(actions.setStrategyDefaultOptions, setStrategyDefaultOptions)
  .case(actions.setStrategyOptions, setStrategyOptions)
  .case(actions.setSelectedStrategy, setSelectedStrategy)
  .build();
