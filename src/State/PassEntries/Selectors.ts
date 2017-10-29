import {List} from 'immutable';
import {createSelector} from 'reselect';
import {ExtensionName} from 'State/Interfaces';
import {getPassEntryState} from 'State/Selectors';
import {getEnabledExtensions} from '../Options/Selectors';
import {EntryNode, PassEntryState} from './Interfaces';
import {defaultRootNode} from './Reducers';

export const getEnabledRootNodes = createSelector(
  getPassEntryState,
  getEnabledExtensions,
  (state: PassEntryState, enabledExtensions: List<ExtensionName>) =>
    state.filter((rootNode: EntryNode, extensionName: ExtensionName) => enabledExtensions.includes(extensionName)),
);

export const getCombinedPassEntries = createSelector(
  getEnabledRootNodes,
  (rootNodes: PassEntryState) => defaultRootNode.mergeDeep(...Array.from(rootNodes.values())),
);
