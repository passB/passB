import {Map, Record, Set} from 'immutable';
import Factory = Record.Factory;

export type ExtensionName = string;
export type ExtensionOptions = Map<string, any>; // tslint:disable-line:no-any
export type StrategyType = string;
export type StrategyName = string;
export type StrategyOptions = Map<string, any>; // tslint:disable-line:no-any

export interface IOptionsState {
  enabledExtensions: Set<ExtensionName>;
  extensionsDefaultOptions: Map<ExtensionName, ExtensionOptions>;
  extensionsOptions: Map<ExtensionName, ExtensionOptions>;
  selectedStrategies: Map<StrategyType, StrategyName>;
  strategyDefaultOptions: Map<StrategyType, Map<StrategyName, StrategyOptions>>;
  strategyOptions: Map<StrategyType, Map<StrategyName, StrategyOptions>>;
}

const initialState: IOptionsState = {
  enabledExtensions: Set<ExtensionName>(),
  extensionsDefaultOptions: Map<ExtensionName, ExtensionOptions>(),
  extensionsOptions: Map<ExtensionName, ExtensionOptions>(),
  selectedStrategies: Map<StrategyType, StrategyName>(),
  strategyDefaultOptions: Map<StrategyType, Map<StrategyName, StrategyOptions>>(),
  strategyOptions: Map<StrategyType, Map<StrategyName, StrategyOptions>>(),
};

export const OptionsStateFactory: Factory<IOptionsState> = Record(initialState, 'OptionsState');

export type OptionsState = Record<IOptionsState> & Readonly<IOptionsState>; // = Record<IOptionsState>(initialState);

export interface ExtensionOptionsArgs {
  extensionName: ExtensionName;
  options: ExtensionOptions;
}

export interface ExtensionNameArgs {
  extensionName: ExtensionName;
}

export interface StrategyOptionsArgs {
  strategyType: StrategyType;
  strategyName: StrategyName;
  options: StrategyOptions;
}

export interface StrategyNameArgs {
  strategyType: StrategyType;
  strategyName: StrategyName;
}
