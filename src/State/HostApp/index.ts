import {createSelector} from 'reselect';
import {actionCreatorFactory} from 'typescript-fsa';
import {reducerWithInitialState} from 'typescript-fsa-reducers';
import {StoreContents} from 'InjectableInterfaces/State';
import {getHostApState} from 'State/Selectors';

// interfaces
export interface Error {
  message: string;
  type: ErrorType;
}

export interface HostAppState {
  lastError?: Error;
}

export enum ErrorType {
  PASS_EXECUTION_ERROR = 'PASS_EXECUTION_ERROR',
  HOST_APP_ERROR = 'HOST_APP_ERROR',
}

// actions
const actionCreator = actionCreatorFactory('HOST_APP');
export const setLastError = actionCreator<Error>('SET_LAST_ERROR');
export const clearLastError = actionCreator<void>('CLEAR_LAST_ERROR');

// reducer
export const reducer = reducerWithInitialState({})
  .case(setLastError, (state: HostAppState, lastError: Error): HostAppState => ({...state, lastError}))
  .case(clearLastError, ({lastError, ...stateRest}: HostAppState): HostAppState => stateRest)
  .build();

// selectors
export const getLastError: (state: StoreContents) => Error | undefined =
  createSelector(getHostApState, (state: HostAppState) => state.lastError);
