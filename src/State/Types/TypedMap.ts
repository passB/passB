import {fromJS, List, Map} from 'immutable';

type SimpleValues = string | number | boolean | RegExp;

type AllowedValue =
  SimpleValues |
  AllowedMap |
  AllowedList |
  TypedMap<any> | // tslint:disable-line:no-any
  undefined;

interface AllowedList extends List<AllowedValue> {
}

interface AllowedMap extends Map<string, AllowedValue> {
}

export type MapTypeAllowedData<DataType> = {
  [K in keyof DataType]: AllowedValue;
};

export interface TypedMap<DataType extends MapTypeAllowedData<DataType>> extends Map<string, AllowedValue> { // tslint:disable-line:no-any
  toJS(): DataType;

  get<K extends keyof DataType>(key: K, notSetValue?: DataType[K]): DataType[K];

  set<K extends keyof DataType>(key: K, value: DataType[K]): this;
}

export function createTypedMap<DataType extends MapTypeAllowedData<DataType>>(data: DataType): TypedMap<DataType> {
  return fromJS(data);
}
