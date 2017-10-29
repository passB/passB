import {Divider, List, ListItem, ListItemText} from 'material-ui';
import {Folder, InsertDriveFile} from 'material-ui-icons';
import Avatar from 'material-ui/Avatar';
import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import {LazyInject} from 'Decorators/LazyInject';
import {PassB} from 'PassB';
import {Action, EntryNode} from 'State/PassEntries/Interfaces';
import {CollapsibleListItem} from './CollapsibleListItem';

interface Props {
  root: EntryNode;
}

class UnconnectedEntryNodeList extends React.Component<Props & RouteComponentProps<{}>> {
  @LazyInject(() => PassB)
  private passB: PassB;

  public render(): JSX.Element {
    const {root, history} = this.props;

    const actionItems = root.get('actions').map((action: Action) => (
      <ListItem
        button={true}
        key={`${action.get('extension')}/${action.get('action')}`}
        onClick={() =>
          this.passB.getExtension(action.get('extension')).executeAction(
            action.get('action'),
            root.get('fullPath'),
            {navigateTo: (newUrl: string, state: {}) => history.push(newUrl, state)},
          )
        }
      >
        <ListItemText
          primary={
            browser.i18n.getMessage(this.passB.getExtension(action.get('extension')).getLabelForAction(action.get('action')))
          }
        />
      </ListItem>
    ));

    const childItems = root.get('children').map((child: EntryNode) => (
      <CollapsibleListItem
        key={child.get('fullPath')}
        CollapsedChildren={() => <UnconnectedEntryNodeList {...this.props} root={child}/>}
      >
        {[
          <Avatar key="avatar">
            {child.get('fullPath').endsWith('/') ?
              <Folder/> :
              <InsertDriveFile/>
            }
          </Avatar>,
          <ListItemText key="text" primary={child.get('fullPath').replace(/\//g, '/\u200b')}/>,
        ]}
      </CollapsibleListItem>
    ));

    return (
      <List>
        {Array.from(actionItems.values())}
        {actionItems.count() > 0 && childItems.count() > 0 && <Divider/>}
        {Array.from(childItems.values())}
      </List>
    );
  }
}

export const EntryNodeList = withRouter<Props>(UnconnectedEntryNodeList);
