import {List, OrderedMap} from 'immutable';
import {reducerWithInitialState} from 'typescript-fsa-reducers';
import {createTypedMap} from 'State/Types/TypedMap';
import * as Actions from './Actions';
import {
  Action, EntryAction,
  EntryNode,
  EntryNodeInterface,
  ExtensionEntriesArgs,
  ExtensionNameArgs,
  PassEntryState,

} from './Interfaces';

export const defaultRootNodeValues: EntryNodeInterface = {
  name: '',
  fullPath: '',
  actions: List<Action>(),
  children: OrderedMap<string, EntryNode>(),
};

export const defaultRootNode: EntryNode = createTypedMap(defaultRootNodeValues);

const getEntryNode = (data: Pick<EntryNodeInterface, 'name' | 'fullPath'> & Partial<EntryNodeInterface>): EntryNode => createTypedMap({
  ...defaultRootNodeValues,
  ...data,
});

const resetEntries =
  (oldState: PassEntryState, {extensionName}: ExtensionNameArgs): PassEntryState =>
    oldState.set(extensionName, getEntryNode({name: '', fullPath: ''}));

const setEntries = (oldState: PassEntryState, {extensionName, entries}: ExtensionEntriesArgs): PassEntryState =>
  oldState.set(extensionName, entries.reduce(
    (rootNode: EntryNode, entry: EntryAction) => {
      const isFolder = entry.fullPath.endsWith('/');
      const parts = entry.fullPath.split('/');
      if (isFolder || entry.fullPath.length === 0) {
        parts.pop();
      }

      const path: string[] = [];
      let lastPart = '';
      let accumulatedPath = '';
      let part;

      do {
        if (!rootNode.getIn(path)) {
          rootNode = rootNode.setIn(path, getEntryNode({name: lastPart, fullPath: accumulatedPath}));
        }

        part = parts.shift();
        if (!part) {
          rootNode = rootNode.updateIn(
            [...path, 'actions'],
            (actions: List<Action>) => actions.push(createTypedMap({extension: extensionName, action: entry.action})),
          );
        } else {
          lastPart = (parts.length > 0 || isFolder) ? `${part}/` : part;
          path.push('children', lastPart);
          accumulatedPath = accumulatedPath + lastPart;
        }
      } while (part);

      return rootNode;
    },
    getEntryNode({name: '', fullPath: ''}),
  ));

export const reducer = reducerWithInitialState(OrderedMap() as PassEntryState)
  .case(Actions.resetEntries, resetEntries)
  .case(Actions.setEntries, setEntries)
  .build();
