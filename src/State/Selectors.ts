import {StoreContents} from 'InjectableInterfaces/State';

export const getHostApState = (storeContents: StoreContents) => storeContents.hostApp;
export const getOptionsState = (storeContents: StoreContents) => storeContents.options;
export const getPassEntryState = (storeContents: StoreContents) => storeContents.passEntries;
