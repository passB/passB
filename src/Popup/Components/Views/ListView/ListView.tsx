import {List, ListItemText} from 'material-ui';
import {Sync} from 'material-ui-icons';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {LazyInject} from 'Decorators/LazyInject';
import {EntryNode, PassB} from 'PassB';
import {CollapsibleListItem} from './CollapsibleListItem';
import {EntryNodeList} from './EntryNodeList';

interface Props {
  url: string;
}

interface State {
  rootNode?: EntryNode;
  contextualRootNode?: EntryNode;
}

const styles = {
  centered: {
    width: '100%',
    textAlign: 'center',
  },
};

function flattenEntryNode(currentNode: EntryNode, flattened: EntryNode[] = []): EntryNode[] {
  flattened.push(currentNode);
  Object.values(currentNode.children).forEach((item: EntryNode) => flattenEntryNode(item, flattened));

  return flattened;
}

function deepFilterEntryNodes(node: EntryNode, filteredNodes: EntryNode[]): void {
  for (const [key, childNode] of Object.entries(node.children)) {
    deepFilterEntryNodes(childNode, filteredNodes);
    if (!(filteredNodes.includes(childNode) || Object.values(childNode.children).length > 0)) {
      delete (node.children[key]);
    }
  }
}

class ListViewComponent extends React.Component<Props & WithStyles<keyof typeof styles>, State> {
  public state: State = {};

  @LazyInject(() => PassB)
  private passB: PassB;

  public componentDidMount(): void {
    this.passB.getRootNode()
      .then((rootNode: EntryNode) =>
        this.setState({rootNode}, () => this.recalculateContextualEntries()),
      );
  }

  public render(): JSX.Element {
    const {classes} = this.props;
    const {rootNode, contextualRootNode} = this.state;

    return (
      <List>
        {rootNode ?
          <CollapsibleListItem
            key="allEntriesRoot"
            CollapsedChildren={() => <EntryNodeList root={rootNode}/>}
            initiallyExpanded={false}
          >
            <ListItemText
              primary="All Items"
            />
          </CollapsibleListItem> :
          <div className={classes.centered}><Sync/></div>
        }
        {contextualRootNode &&
        <CollapsibleListItem
          key="contextualRoot"
          CollapsedChildren={() => <EntryNodeList root={contextualRootNode}/>}
          initiallyExpanded={true}
        >
          <ListItemText
            primary="Contextual"
          />
        </CollapsibleListItem>
        }
      </List>
    );
  }

  private async recalculateContextualEntries(): Promise<void> {
    if (!this.props.url || !this.state.rootNode) {
      return;
    }

    const newNode = JSON.parse(JSON.stringify(this.state.rootNode));
    const flattened: EntryNode[] = flattenEntryNode(newNode);
    const matcher = await this.passB.getMatcher();
    const filteredNodes = await matcher.filterEntries(this.props.url || '', flattened);
    deepFilterEntryNodes(newNode, filteredNodes);

    this.setState({contextualRootNode: newNode});
  }
}

export const ListView = withStyles<keyof typeof styles>(styles)(ListViewComponent);
