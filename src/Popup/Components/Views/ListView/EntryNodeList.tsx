import {Divider, List, ListItem, ListItemText} from 'material-ui';
import {Folder, InsertDriveFile} from 'material-ui-icons';
import Avatar from 'material-ui/Avatar';
import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import {LazyInject} from 'Decorators/LazyInject';
import {Action, EntryNode, PassB} from 'PassB';
import {CollapsibleListItem} from './CollapsibleListItem';

interface Props {
  root: EntryNode;
}

class UnconnectedEntryNodeList extends React.Component<Props & RouteComponentProps<{}>> {
  @LazyInject(() => PassB)
  private passB: PassB;

  public render(): JSX.Element {
    const {root, history} = this.props;

    const actionItems = root.actions.map((action: Action) => (
      <ListItem
        button={true}
        key={`${action.extension}/${action.action}`}
        onClick={() =>
          this.passB.getExtension(action.extension).executeAction(
            action.action,
            root.fullPath,
            {navigateTo: (newUrl: string, state: {}) => history.push(newUrl, state)},
          )
        }
      >
        <ListItemText
          primary={
            browser.i18n.getMessage(this.passB.getExtension(action.extension).getLabelForAction(action.action))
          }
        />
      </ListItem>
    ));

    const childItems = Object.values(root.children).map((child: EntryNode) => (
      <CollapsibleListItem
        key={child.fullPath}
        CollapsedChildren={() => <UnconnectedEntryNodeList {...this.props} root={child}/>}
      >
        {[
          <Avatar key="avatar">
            {child.fullPath.endsWith('/') ?
              <Folder/> :
              <InsertDriveFile/>
            }
          </Avatar>,
          <ListItemText key="text" primary={child.fullPath.replace(/\//g, '/\u200b')}/>,
        ]}
      </CollapsibleListItem>
    ));

    return (
      <List>
        {actionItems}
        {actionItems.length > 0 && childItems.length > 0 && <Divider/>}
        {childItems}
      </List>
    );
  }
}

export const EntryNodeList = withRouter<Props>(UnconnectedEntryNodeList);
