import {combineReducers, createStore, Store} from 'redux';
import {initialState as initialOptionsState, reducer as OptionsReducer} from 'State/Options/Reducers';
import {initialState as initialPassEntriesState, reducer as PassEntryReducer} from 'State/PassEntries/Reducers';
import {StoreContents} from 'InjectableInterfaces/State';

const reducer = combineReducers<StoreContents>({
  options: OptionsReducer,
  passEntries: PassEntryReducer,
});

export const getMockStore = (): Store<StoreContents> => createStore<StoreContents>(
  reducer,
  {
    options: initialOptionsState,
    passEntries: initialPassEntriesState,
  },
);
