import {List} from 'immutable';
import {ListItemText} from 'material-ui';
import * as React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Matcher} from 'InjectableInterfaces/Matcher';
import {StoreContents} from 'InjectableInterfaces/State';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {getCombinedPassEntries} from 'State/PassEntries/Selectors';
import {deepFilterEntryNodes, flattenEntryNode} from './entryNodeMethods';
import {CollapsibleListItem} from './CollapsibleListItem';
import {EntryNodeList} from './EntryNodeList';

interface ContextualProps {
  matcher: Matcher<{}>;
  url: string;
}

export const contextualRootNodeSelector = createSelector(
  getCombinedPassEntries,
  (_: {}, props: ContextualProps) => ({matcher: props.matcher, url: props.url}),
  (rootNode: EntryNode, {matcher, url}: ContextualProps): EntryNode | undefined =>
    deepFilterEntryNodes(
      rootNode,
      matcher.filterEntries(url, flattenEntryNode(rootNode)),
    ).set('actions', List()),
);

export const ContextualRootNodeComponent = ({root}: { root: EntryNode }) => {
  if (root.get('children').count() === 0) {
    return null; // tslint:disable-line:no-null-keyword
  } else {
    return (
      <CollapsibleListItem
        className="contextualRoot"
        CollapsedChildren={<EntryNodeList root={root}/>}
        initiallyExpanded={true}
      >
        <ListItemText
          primary="Contextual"
        />
      </CollapsibleListItem>
    );
  }
};

export const mapStateToProps = (state: StoreContents, props: ContextualProps) => ({
  root: contextualRootNodeSelector(state, props),
});

export const ContextualRootNode = connect(mapStateToProps)(ContextualRootNodeComponent);
