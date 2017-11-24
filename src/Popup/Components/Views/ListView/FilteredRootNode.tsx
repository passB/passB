import {ListItemText} from 'material-ui';
import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {StoreContents} from 'InjectableInterfaces/State';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {getCombinedPassEntries} from 'State/PassEntries/Selectors';
import {deepFilterEntryNodes, flattenEntryNode} from './entryNodeMethods';
import {CollapsibleListItem} from './CollapsibleListItem';
import {EntryNodeList} from './EntryNodeList';

interface FilteredProps {
  filter: string;
}

export const filteredRootNodeSelector = createSelector(
  getCombinedPassEntries,
  (_: {}, props: FilteredProps) => ({filter: props.filter}),
  (rootNode: EntryNode, {filter}: FilteredProps): EntryNode | undefined => {
    if (!filter) {
      return rootNode;
    }
    return deepFilterEntryNodes(
      rootNode,
      flattenEntryNode(rootNode)
        .filter((node: EntryNode) => node.get('fullPath').includes(filter)),
    );
  },
);

export const FilteredRootNodeComponent = ({root, filter}: { root: EntryNode; filter: string }) => (
  <CollapsibleListItem
    className="allEntriesRoot"
    CollapsedChildren={<EntryNodeList root={root}/>}
    initiallyExpanded={!!filter}
  >
    <ListItemText
      primary={browser.i18n.getMessage('popup_node_all_items')}
    />
  </CollapsibleListItem>
);

export const mapStateToProps = (state: StoreContents, props: FilteredProps) => ({
  root: filteredRootNodeSelector(state, props),
});

export const FilteredRootNode = connect(mapStateToProps)(FilteredRootNodeComponent);
