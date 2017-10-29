import {List, Map} from 'immutable';
import {ExtensionName, StrategyName, StrategyType} from 'State/Interfaces';
import {TypedMap} from 'State/Types/TypedMap';

export interface IOptionsState {
  enabledExtensions: List<ExtensionName>;
  extensionsDefaultOptions: Map<ExtensionName, TypedMap<{}>>;
  extensionsOptions: Map<ExtensionName, TypedMap<{}>>;
  selectedStrategies: Map<StrategyType, StrategyName>;
  strategyDefaultOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>;
  strategyOptions: Map<StrategyType, Map<StrategyName, TypedMap<{}>>>;
}

export type OptionsState = TypedMap<IOptionsState>;

export interface ExtensionOptionsArgs {
  extensionName: ExtensionName;
  options: TypedMap<{}>;
}

export interface ExtensionNameArgs {
  extensionName: ExtensionName;
}

export interface StrategyOptionsArgs {
  strategyType: StrategyType;
  strategyName: StrategyName;
  options: TypedMap<{}>;
}

export interface StrategyNameArgs {
  strategyType: StrategyType;
  strategyName: StrategyName;
}
