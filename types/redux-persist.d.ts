// tslint:disable:no-any
declare module 'redux-persist' {
  import {Reducer, Store} from 'redux';

  export interface PersistState {
    version: number;
    rehydrated: boolean;
  }

  export type PersistedState = {
    _persist: PersistState;
  } | void;

  export interface PersistConfig {
    version?: number;
    storage: {};
    key: string;
    keyPrefix?: string;
    blacklist?: string[];
    whitelist?: string[];
    transforms?: Transform[];
    throttle?: number;
    migrate?: (p: PersistedState, n: number) => Promise<PersistedState>;
    stateReconciler?: boolean | Function;
    getStoredState?: (p: PersistConfig) => Promise<PersistedState>; // used for migrations
    debug?: boolean;
  }

  export interface PersistorOptions {
    enhancer?: Function;
    [key: string]: any;
  }

  export interface Storage {
    getItem: (key: string, callback?: (value: string) => any) => any;
    setItem: (key: string, value: string, callback?: () => any) => any;
    removeItem: (key: string, callback?: () => any) => any;
  }

  export interface MigrationManifest {
    [key: string]: (p: PersistedState) => PersistedState;
  }

  export interface Transform {
    in: (o: {}, a: string) => {};
    out: (o: {}, a: string) => {};
    config?: PersistConfig;
  }

  export type RehydrateErrorType = any;

  export interface RehydrateAction {
    type: 'redux-persist/REHYDRATE';
    key: string;
    payload?: {};
    err?: RehydrateErrorType;
  }

  export interface Persistoid {
    update: (o: {}) => void;
    flush: () => Promise<any>;
  }

  interface RegisterAction {
    type: 'redux-persist/REGISTER';
    key: string;
  }

  type PersistorAction = RehydrateAction | RegisterAction;

  interface PersistorState {
    registry: string[];
    bootstrapped: boolean;
  }

  type PersistorSubscribeCallback = () => any;

  export interface Persistor {
    purge: () => Promise<any>;
    flush: () => Promise<any>;
    dispatch: (a: PersistorAction) => PersistorAction;
    getState: () => PersistorState;
    subscribe: (cb: PersistorSubscribeCallback) => () => any;
  }

  type BoostrappedCb = () => any;

  export function persistStore<S>(store: Store<S>, options?: PersistorOptions, cb?: BoostrappedCb): Persistor;
  export function purgeStoredState(options: PersistorOptions): void;

  interface PersistPartial {
    _persist: PersistState;
  }

  export function persistReducer<State, Action>(
    config: PersistConfig,
    baseReducer: Reducer<State>,
  ): (s: State, a: Action) => State & PersistPartial;

  export function createTransform(
    inbound: Function,
    outbound: Function,
    config?: {whitelist?: string[]},
  ): Transform;
}

declare module 'redux-persist/es/integration/react' {
  import * as React from 'react';
  import {Persistor} from 'redux-persist';

  interface Props {
    onBeforeLift?: Function;
    children?: React.ReactNode;
    loading: React.ReactNode;
    persistor: Persistor;
  }

  interface State {
    bootstrapped: boolean;
  }

  export class PersistGate extends React.PureComponent<Props, State> {}
}
