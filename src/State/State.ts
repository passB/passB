import {Record} from 'immutable';
import {
  applyMiddleware, combineReducers, createStore, Action, Reducer, Store,
} from 'redux';
import {persistReducer, persistStore, Persistor} from 'redux-persist';
import immutableTransform = require('redux-persist-transform-immutable');
import {Service} from 'typedi';
import {LazyInject} from '../Decorators/LazyInject';
import {loggerMiddlerware} from './loggerMiddleware';
import {storageSyncListener, storageSyncMiddleware} from './syncMiddleware';
import {BrowserStorageAdapter, StorageAdaper} from './BrowserStorageAdapter';
import {reducer as OptionsReducer, OptionsState} from './Options';
import {OptionsStateFactory} from './Options/Interfaces';

export interface StoreContents {
  options: OptionsState;
}

export const getOptionsFromState = (state: StoreContents) => state.options;

@Service()
export class State {
  public readonly hydrated: Promise<void>;
  private store: Store<StoreContents>;
  private persistor: Persistor;

  @LazyInject(() => BrowserStorageAdapter)
  private storageAdapter: StorageAdaper;

  public constructor() {
    const reducer: Reducer<StoreContents> = persistReducer(
      {
        key: 'root',
        storage: this.storageAdapter,
        transforms: [immutableTransform({records: [OptionsStateFactory]})],
      },
      combineReducers({
        options: OptionsReducer,
      }),
    );

    this.store = createStore(
      reducer,
      applyMiddleware(loggerMiddlerware, storageSyncMiddleware(this.storageAdapter)),
    );

    this.persistor = persistStore(this.store);
    this.hydrated = new Promise((done: () => void) => {
      let unsubscribe: () => void;
      const checkHydrated = () => {
        if (this.persistor.getState()) {
          if (unsubscribe) {
            unsubscribe();
          }
          done();
        }
      };
      unsubscribe = this.persistor.subscribe(checkHydrated);
      checkHydrated();
    });
    storageSyncListener(this.store, this.storageAdapter);
  }

  public getOptions(): OptionsState {
    return getOptionsFromState(this.store.getState());
  }

  public getPersistor(): Persistor {
    return this.persistor;
  }

  public getStore(): Store<StoreContents> {
    return this.store;
  }

  public dispatch(action: Action): void {
    this.store.dispatch(action);
  }
}
