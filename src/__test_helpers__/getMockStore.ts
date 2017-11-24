import {combineReducers, createStore, Store} from 'redux';
import {StoreContents} from 'InjectableInterfaces/State';
import {initialState as initialHostAppState, reducer as HostAppReducer} from 'State/HostApp';
import {initialState as initialOptionsState, reducer as OptionsReducer} from 'State/Options/Reducers';
import {initialState as initialPassEntriesState, reducer as PassEntryReducer} from 'State/PassEntries/Reducers';

const reducer = combineReducers<StoreContents>({
  options: OptionsReducer,
  passEntries: PassEntryReducer,
  hostApp: HostAppReducer,
});

export const getMockStore = (): Store<StoreContents> => createStore<StoreContents>(
  reducer,
  {
    options: initialOptionsState,
    passEntries: initialPassEntriesState,
    hostApp: initialHostAppState,
  },
);
