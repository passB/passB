import {withStyles, ListItem, ListItemText, WithStyles} from 'material-ui';
import {ExpandLess, ExpandMore, Folder, InsertDriveFile} from 'material-ui-icons';
import {Theme} from 'material-ui/styles';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import * as React from 'react';
import {EntryNode} from 'PassB';
import {EntryNodeList} from './EntryNodeList';

interface Props {
  node: EntryNode;
}

interface State {
  collapsed: boolean;
}

type styleClasses = 'nested';

const styles = (theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

export const CollapsibleListItem = withStyles<styleClasses>(styles)(
  class extends React.Component<Props & WithStyles<styleClasses>, State> {
    public state: State = {
      collapsed: true,
    };

    public render(): JSX.Element[] {
      const {node, classes} = this.props;
      const {collapsed} = this.state;

      // tslint:disable:jsx-wrap-multiline - see https://github.com/palantir/tslint-react/issues/79
      return [
        <ListItem
          button={true}
          key={node.fullPath}
          onClick={() => this.setState({collapsed: !collapsed})}
        >
          <Avatar>
            {node.fullPath.endsWith('/') ?
              <Folder/> :
              <InsertDriveFile/>
            }
          </Avatar>
          <ListItemText primary={node.fullPath.replace(/\//g, '/\u200b')}/>
          {collapsed ?
            <ExpandMore/> :
            <ExpandLess/>
          }
        </ListItem>,
        <Collapse key="collapsible" in={!collapsed} transitionDuration="auto" unmountOnExit={true}>
          <div className={classes.nested}>
            <EntryNodeList root={node}/>
          </div>
        </Collapse>,
      ];
    }
  });
