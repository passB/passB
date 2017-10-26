import {Record} from 'immutable';
import {
  applyMiddleware, combineReducers, createStore, Action, AnyAction, Dispatch,
  Middleware, MiddlewareAPI, Reducer, Store,
} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import immutableTransform = require('redux-persist-transform-immutable');
import {Service} from 'typedi';
import {getExecutionContext} from 'Decorators/ExecuteInContext';
import {reducer as OptionsReducer, OptionsState} from './Options';
import {OptionsStateFactory} from './Options/Interfaces';

const STORAGE_KEY = 'LAST_REDUX_ACTION';

interface EnrichedAction extends AnyAction {
  __time: number;
  __executionContext: string;
}

const enrichAction = (action: AnyAction): EnrichedAction => ({
  ...action,
  __time: Date.now(),
  __executionContext: getExecutionContext()!,
});

const loggerMiddlerware: Middleware =
  <S>({getState}: MiddlewareAPI<S>) =>
    (next: Dispatch<S>) =>
      <A extends AnyAction>(action: A): A => {
        const ret = next(action);
        console.debug('applying', action, 'on', getState());
        return ret;
      };

const storageSyncMiddleware: Middleware =
  <S>(/*{dispatch, getState}: MiddlewareAPI<S>*/) =>
    (next: Dispatch<S>) =>
      <A extends AnyAction>(action: A): A => {
        if (action && !action.__time && !action.type.startsWith('persist/')) {
          browser.storage.local.set({[STORAGE_KEY]: enrichAction(action)});
        }
        return next(action);
      };

let lastObservedTimestamp: number = 0;
function listenOnLocalStorage(store: Store<StoreContents>): void {
  browser.storage.onChanged.addListener(
    (changes: browser.storage.ChangeDict, areaName: browser.storage.StorageName) => {
      if (changes && changes[STORAGE_KEY]) {
        const action: EnrichedAction = changes[STORAGE_KEY].newValue;
        if (action.__time !== lastObservedTimestamp && action.__executionContext !== getExecutionContext()) {
          lastObservedTimestamp = action.__time;
          store.dispatch((action));
        }
      }
    });
}

const storageAdapter = {
  getItem: (key: string) => browser.storage.local.get(key)
    .then((result: any) => result[key]), // tslint:disable-line:no-any
  setItem: (key: string, item: string) => browser.storage.local.set({[key]: item}),
  removeItem: (key: string) => browser.storage.local.remove(key),
};

interface IStoreContents {
  options: OptionsState;
}

type StoreContents = Record<IStoreContents> & Readonly<IStoreContents>;

@Service()
export class State {
  private store: Store<StoreContents>;

  public constructor() {
    const reducer: Reducer<StoreContents> = persistReducer(
      {
        key: 'root',
        storage: storageAdapter,
        transforms: [immutableTransform({records: [OptionsStateFactory]})],
      },
      combineReducers({
        options: OptionsReducer,
      }),
    );

    this.store = createStore(
      reducer,
      applyMiddleware(loggerMiddlerware, storageSyncMiddleware),
    );

    persistStore(this.store);
    listenOnLocalStorage(this.store);
  }

  public getOptions(): OptionsState {
    return this.store.getState().options;
  }

  public dispatch(action: Action): void {
    this.store.dispatch(action);
  }
}
