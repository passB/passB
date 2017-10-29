import {
  applyMiddleware, combineReducers, createStore, Action, Reducer, Store,
} from 'redux';
import {persistReducer, persistStore, Persistor} from 'redux-persist';
import immutableTransform = require('redux-persist-transform-immutable');
import {composeWithDevTools} from 'remote-redux-devtools';
import {Service} from 'typedi';
import {getExecutionContext} from 'Decorators/ExecuteInContext';
import {LazyInject} from 'Decorators/LazyInject';
import {storageSyncListener, storageSyncMiddleware} from './syncMiddleware';
import {BrowserStorageAdapter, StorageAdaper} from './BrowserStorageAdapter';
import {reducer as OptionsReducer, OptionsState} from './Options';
import {PassEntryState} from './PassEntries/Interfaces';
import {reducer as PassEntryReducer} from './PassEntries/Reducers';

export interface StoreContents {
  options: OptionsState;
  passEntries: PassEntryState;
}

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
        transforms: [immutableTransform({})],
      },
      combineReducers({
        options: OptionsReducer,
        passEntries: PassEntryReducer,
      }),
    );

    this.store = createStore(
      reducer,
      composeWithDevTools({
        hostname: 'localhost',
        port: 8000,
        name: `PassB - ${getExecutionContext()}`,
      })(
        applyMiddleware(
          storageSyncMiddleware(this.storageAdapter),
        ),
      ),
    );

    this.persistor = persistStore(this.store);
    this.hydrated = new Promise((done: () => void) => {
      let unsubscribe: () => void;
      const checkHydrated = () => {
        const persistorState = this.persistor.getState();
        if (persistorState && persistorState.bootstrapped) {
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

  public getState(): StoreContents {
    return this.store.getState();
  }

  public getPersistor(): Persistor {
    return this.persistor;
  }

  public getStore(): Store<StoreContents> {
    return this.store;
  }

  public dispatch(action: Action): void {
    this.hydrated.then(() => this.store.dispatch(action));
  }
}
