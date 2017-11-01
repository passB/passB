import {OrderedMap} from 'immutable';
import debounce = require('lodash.debounce');
import {List, ListItem, ListItemText, TextField} from 'material-ui';
import {Sync} from 'material-ui-icons';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {LazyInject} from 'Decorators/LazyInject';
import {PassB} from 'PassB';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {getCombinedPassEntries} from 'State/PassEntries/Selectors';
import {StoreContents} from 'State/State';
import {CollapsibleListItem} from './CollapsibleListItem';
import {EntryNodeList} from './EntryNodeList';

interface Props {
  url: string;
}

interface ConnectedProps {
  rootNode: EntryNode;
}

interface State {
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
  currentNode.get('children').forEach((item: EntryNode) => flattenEntryNode(item, flattened));

  return flattened;
}

function deepFilterEntryNodes(node: EntryNode, filteredNodes: EntryNode[]): EntryNode {
  const nodeFullNames = filteredNodes.map((filtered: EntryNode) => filtered.get('fullPath'));
  return node.update(
    'children',
    (origChildren: OrderedMap<string, EntryNode>) =>
      origChildren
        .map((child: EntryNode) => deepFilterEntryNodes(child, filteredNodes))
        .filter((child: EntryNode) => nodeFullNames.includes(child.get('fullPath')) || child.get('children').count() > 0),
  );
}

type InnerProps = Props & ConnectedProps & WithStyles<keyof typeof styles>;

class ListViewComponent extends React.Component<InnerProps, State> {
  public state: State = {};

  @LazyInject(() => PassB)
  private passB: PassB;

  public constructor(props: InnerProps) {
    super(props);

    this.filterNodes = debounce(this.filterNodes.bind(this), 50);
  }

  public componentDidMount(): void {
    this.recalculateContextualEntries(this.props);
  }

  public componentWillReceiveProps(newProps: InnerProps): void {
    if (newProps.url !== this.props.url || newProps.rootNode !== this.props.rootNode) {
      this.recalculateContextualEntries(newProps);
    }
  }

  public render(): JSX.Element {
    const {classes, rootNode} = this.props;
    const {contextualRootNode, filteredRootNode} = this.state;

    return (
      <List>
        <ListItem className={classes.noTopPadding}>
          <TextField
            id="search"
            label={browser.i18n.getMessage('popup_search')}
            type="search"
            fullWidth={true}
            margin="none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.filterNodes(e.target.value)}
            inputProps={{autoFocus: true, tabIndex: 0}}
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
    const {rootNode} = this.props;
    const flattened: EntryNode[] = flattenEntryNode(rootNode);
    const filteredNodes = flattened.filter((node: EntryNode) => node.get('fullPath').includes(filter));

    this.setState({filteredRootNode: deepFilterEntryNodes(rootNode, filteredNodes)});

  }

  private async recalculateContextualEntries(props: InnerProps): Promise<void> {
    const {rootNode, url} = props;
    if (!url || !rootNode) {
      return;
    }

    const matcher = await this.passB.getMatcher();
    const filteredNodes = await matcher.filterEntries(url, flattenEntryNode(rootNode));
    this.setState({contextualRootNode: deepFilterEntryNodes(rootNode, filteredNodes)});
  }
}

export const ListView = compose<InnerProps, Props>(
  withStyles<keyof typeof styles>(styles),
  connect<ConnectedProps>((state: StoreContents) => ({
    rootNode: getCombinedPassEntries(state),
  })),
)(ListViewComponent);
