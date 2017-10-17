import debounce = require('lodash.debounce');
import {List, ListItem, ListItemText, TextField} from 'material-ui';
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
  filteredRootNode?: EntryNode;
  contextualRootNode?: EntryNode;
}

const styles = {
  centered: {
    width: '100%',
    textAlign: 'center',
  },
  noTopPadding: {
    paddingTop: '0px',
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

  public constructor(props: Props & WithStyles<keyof typeof styles>) {
    super(props);

    this.filterNodes = debounce(this.filterNodes, 50);
  }

  public componentDidMount(): void {
    this.passB.getRootNode()
      .then((rootNode: EntryNode) =>
        this.setState({rootNode}, () => this.recalculateContextualEntries()),
      );
  }

  public render(): JSX.Element {
    const {classes} = this.props;
    const {rootNode, contextualRootNode, filteredRootNode} = this.state;

    return (
      <List>
        <ListItem className={classes.noTopPadding}>
          <TextField
            id="search"
            label="Search..."
            type="search"
            fullWidth={true}
            margin="none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.filterNodes(e.target.value)}
          />
        </ListItem>
        {rootNode ?
          <CollapsibleListItem
            key="allEntriesRoot"
            CollapsedChildren={() => <EntryNodeList root={filteredRootNode || rootNode}/>}
            initiallyExpanded={typeof filteredRootNode !== 'undefined'}
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

  private filterNodes(filter: string): void {
    const newNode = JSON.parse(JSON.stringify(this.state.rootNode));
    const flattened: EntryNode[] = flattenEntryNode(newNode);
    const filteredNodes = flattened.filter((node: EntryNode) => node.fullPath.includes(filter));
    deepFilterEntryNodes(newNode, filteredNodes);

    this.setState({filteredRootNode: newNode});

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
