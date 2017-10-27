import {AnyAction, Dispatch, Middleware, Store} from 'redux';
import {StorageAdaper} from './BrowserStorageAdapter';

const STORAGE_KEY = 'LAST_REDUX_ACTION';

interface EnrichedAction extends AnyAction {
  __time: number;
  __contextIdentifier: string;
}

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
  __time: Date.now(),
  __contextIdentifier: await currentContextIdentifier,
});

export const storageSyncMiddleware = (storageAdapter: StorageAdaper): Middleware =>
  <S>(/*{dispatch, getState}: MiddlewareAPI<S>*/) =>
    (next: Dispatch<S>) =>
      <A extends AnyAction>(action: A): A => {
        if (action && !action.__time && !action.type.startsWith('persist/')) {
          enrichAction(action)
            .then((enrichedAction: EnrichedAction) => storageAdapter.setItem(STORAGE_KEY, enrichedAction));
        }
        return next(action);
      };

let lastObservedTimestamp: number = 0;

export function storageSyncListener<T>(store: Store<T>, storageAdapter: StorageAdaper): void {
  storageAdapter.addListener(
    async (changes: browser.storage.ChangeDict/*, areaName: browser.storage.StorageName*/) => {
      if (changes && changes[STORAGE_KEY]) {
        const action: EnrichedAction = changes[STORAGE_KEY].newValue;

        if (action.__contextIdentifier === await currentContextIdentifier) {
          return;
        }

        if (action.__time === lastObservedTimestamp) {
          return;
        }

        lastObservedTimestamp = action.__time;
        store.dispatch((action));
      }
    });
}
