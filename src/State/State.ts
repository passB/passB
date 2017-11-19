import {injectable} from 'inversify';
import {applyMiddleware, combineReducers, createStore, Reducer, Store} from 'redux';
import {persistReducer, persistStore, Persistor} from 'redux-persist';
import immutableTransform = require('redux-persist-transform-immutable');
import {composeWithDevTools} from 'remote-redux-devtools';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {getExecutionContext} from 'Decorators/ExecuteInContext';
import {StoreContents} from 'InjectableInterfaces/State';
import {storageSyncListener, storageSyncMiddleware} from './syncMiddleware';
import {reducer as HostAppReducer} from './HostApp';
import {reducer as OptionsReducer} from './Options';
import {reducer as PassEntryReducer} from './PassEntries/Reducers';

@injectable()
export class State {
  public readonly hydrated: Promise<void>;
  private store: Store<StoreContents>;
  private persistor: Persistor;

  @lazyInject(Symbols.StorageAdapter)
  private storageAdapter: Interfaces.StorageAdaper;

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
        hostApp: HostAppReducer,
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

  public getPersistor(): Persistor {
    return this.persistor;
  }

  public getStore(): Store<StoreContents> {
    return this.store;
  }
}
