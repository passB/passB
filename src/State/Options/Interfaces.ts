import {Map, Record, Set} from 'immutable';
import Factory = Record.Factory;

export type ExtensionName = string;
export interface OptionsDataType<DataType extends {}> extends Map<string, any> { // tslint:disable-line:no-any
  toJS(): DataType;
  get<K extends keyof DataType>(key: K): DataType[K];
  set<K extends keyof DataType>(key: K, value: DataType[K]): this;
}

export function createOptionsData<DataType extends {}>(data: DataType): OptionsDataType<DataType> {
  return Map(data) as any; // tslint:disable-line:no-any
}

export type StrategyType = 'FileFormat' | 'Filler' | 'Matcher';
export type StrategyName = string;

export interface IOptionsState {
  enabledExtensions: Set<ExtensionName>;
  extensionsDefaultOptions: Map<ExtensionName, OptionsDataType<{}>>;
  extensionsOptions: Map<ExtensionName, OptionsDataType<{}>>;
  selectedStrategies: Map<StrategyType, StrategyName>;
  strategyDefaultOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>;
  strategyOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>;
}

const initialState: IOptionsState = {
  enabledExtensions: Set<ExtensionName>(),
  extensionsDefaultOptions: Map<ExtensionName, OptionsDataType<{}>>(),
  extensionsOptions: Map<ExtensionName, OptionsDataType<{}>>(),
  selectedStrategies: Map<StrategyType, StrategyName>(),
  strategyDefaultOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>(),
  strategyOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>(),
};

export const OptionsStateFactory: Factory<IOptionsState> = Record(initialState, 'OptionsState');

export type OptionsState = Record<IOptionsState> & Readonly<IOptionsState>; // = Record<IOptionsState>(initialState);

export interface ExtensionOptionsArgs {
  extensionName: ExtensionName;
  options: OptionsDataType<{}>;
}

export interface ExtensionNameArgs {
  extensionName: ExtensionName;
}

export interface StrategyOptionsArgs {
  strategyType: StrategyType;
  strategyName: StrategyName;
  options: OptionsDataType<{}>;
}

export interface StrategyNameArgs {
  strategyType: StrategyType;
  strategyName: StrategyName;
}
