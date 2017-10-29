import {StoreContents} from './State';

export const getOptionsState = (storeContents: StoreContents) => storeContents.options;
export const getPassEntryState = (storeContents: StoreContents) => storeContents.passEntries;
