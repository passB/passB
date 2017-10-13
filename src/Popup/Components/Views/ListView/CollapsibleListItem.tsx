import {ListItem, ListItemText} from 'material-ui';
import {ExpandLess, ExpandMore, Folder, InsertDriveFile} from 'material-ui-icons';
import {withStyles, ClassProps, Theme} from 'material-ui/styles';
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

const styles = (theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

export const CollapsibleListItem = withStyles(styles)(
  class extends React.Component<Props & ClassProps<{ nested: Partial<React.CSSProperties> }>, State> {
    public state: State = {
      collapsed: true,
    };

    public render(): JSX.Element {
      const {node, classes} = this.props;
      const {collapsed} = this.state;

      return (
        <div>
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
          </ListItem>
          <Collapse in={!collapsed} transitionDuration="auto" unmountOnExit={true}>
            <div className={classes.nested}>
              <EntryNodeList root={node}/>
            </div>
          </Collapse>
        </div>
      );
    }
  });
