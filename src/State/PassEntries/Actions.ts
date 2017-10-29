import {actionCreatorFactory} from 'typescript-fsa';
import {ExtensionEntriesArgs, ExtensionNameArgs} from './Interfaces';

const actionCreator = actionCreatorFactory('PASS_ENTRIES');

export const resetEntries = actionCreator<ExtensionNameArgs>('RESET_ENTRIES');
export const setEntries = actionCreator<ExtensionEntriesArgs>('SET_ENTRIES');
