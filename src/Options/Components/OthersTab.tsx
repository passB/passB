import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from 'material-ui';
import {Cancel, Check, Clear} from 'material-ui-icons';
import * as React from 'react';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';

interface State {
  showResetDialog: boolean;
}

export class OthersTab extends React.Component<{}, State> {
  public state: State = {
    showResetDialog: false,
  };

  @lazyInject(Symbols.PassB)
  private passB: Interfaces.PassB;

  public render(): JSX.Element {
    const {
      showResetDialog,
    } = this.state;

    return (
      <div>
        <List>
          <ListItem
            button={true}
            onClick={() => this.setState({showResetDialog: true})}
          >
            <ListItemIcon><Clear/></ListItemIcon>
            <ListItemText primary={browser.i18n.getMessage('options_reset_extension')}/>
          </ListItem>
        </List>
        <Dialog
          onRequestClose={() => this.setState({showResetDialog: false})}
          maxWidth="xs"
          open={showResetDialog}
        >
          <DialogContent>
            <Typography type="subheading">{browser.i18n.getMessage('options_reset_extension_confirm')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({showResetDialog: false})} color="primary">
              <Cancel/>
            </Button>
            <Button
              onClick={() => {
                browser.storage.local.clear();
                this.passB.reloadExtension();
                browser.tabs.getCurrent().then((tab: browser.tabs.Tab) => {
                  if (tab && tab.id) {
                    browser.tabs.remove(tab.id);
                  }
                });
              }}
              color="primary"
            >
              <Check/>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
