import * as Immutable from 'immutable';
import {AnyAction, Dispatch, Middleware, Store} from 'redux';
import {immutable} from 'remotedev-serialize';
import {StorageAdaper} from './BrowserStorageAdapter';

const STORAGE_KEY = 'LAST_REDUX_ACTION';

interface EnrichedAction extends AnyAction {
  __time: number;
  __contextIdentifier: string;
}

const {stringify, parse} = immutable(Immutable);

// a unique identifier for the current context this script runs in. background pages and popups do not have a "tab",
// so use their url
const currentContextIdentifier = browser.tabs.getCurrent().then(
  (currentTab: browser.tabs.Tab) =>
    currentTab ?
      `${currentTab.id}#${currentTab.windowId}#${currentTab.index}` :
      window.location.toString()
  ,
);

const enrichAction = async (action: AnyAction): Promise<EnrichedAction> => ({
  ...action,
  // time is added so that every action is unique - saving the same action to localStorage twice would not trigger the listener
  __time: Date.now(),
  __contextIdentifier: await currentContextIdentifier,
});

export const storageSyncMiddleware = (storageAdapter: StorageAdaper): Middleware =>
  <S>(/*{dispatch, getState}: MiddlewareAPI<S>*/) =>
    (next: Dispatch<S>) =>
      <A extends AnyAction>(action: A): A => {
        if (action && !action.__time && !action.type.startsWith('persist/')) {
          enrichAction(action)
            .then((enrichedAction: EnrichedAction) => storageAdapter.setItem(STORAGE_KEY, stringify(enrichedAction)));
        }
        return next(action);
      };

export function storageSyncListener<T>(store: Store<T>, storageAdapter: StorageAdaper): void {
  storageAdapter.addListener(
    async (changes: browser.storage.ChangeDict/*, areaName: browser.storage.StorageName*/) => {
      if (changes && changes[STORAGE_KEY]) {
        const action: EnrichedAction = parse(changes[STORAGE_KEY].newValue);

        if (action.__contextIdentifier !== await currentContextIdentifier) {
          store.dispatch((action));
        }
      }
    });
}
