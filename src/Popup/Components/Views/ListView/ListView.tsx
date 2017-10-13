import {List} from 'material-ui';
import {Sync} from 'material-ui-icons';
import {withStyles, ClassProps} from 'material-ui/styles';
import * as React from 'react';
import {LazyInject} from 'Decorators/LazyInject';
import {EntryNode, PassB} from 'PassB';
import {EntryNodeList} from './EntryNodeList';

interface Props {
  url: string;
}

interface State {
  rootNode?: EntryNode;
}

const styles = {
  centered: {
    width: '100%',
    textAlign: 'center',
  },
};

class ListViewComponent extends React.Component<Props & ClassProps<typeof styles>, State> {
  public state: State = {};

  @LazyInject(() => PassB)
  private passB: PassB;

  public componentDidMount(): void {
    this.passB.getRootNode()
      .then((rootNode: EntryNode) =>
        this.setState({rootNode}, () => this.recalculateFilteredEntries()),
      );
  }

  public render(): JSX.Element {
    const {classes} = this.props;
    const {rootNode} = this.state;

    return (
      <List>
        {rootNode ?
          <EntryNodeList root={rootNode}/> :
          <div className={classes.centered}><Sync/></div>
        }
      </List>
    );
  }

  private async recalculateFilteredEntries(): Promise<void> {
    // TODO: reimplement in a useful way
    /*
    if (!this.props.url || !this.state.rootNode) {
      return;
    }
    (await (this.passB.getMatcher()))
      .filterEntries(this.props.url || '', this.state.rootNode)
      .then((filtered: EntryNode[]) => this.setState({filtered}));
      */
  }
}

export const ListView = withStyles<Props>(styles)(ListViewComponent);
