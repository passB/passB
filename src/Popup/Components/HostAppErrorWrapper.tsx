import {List, ListItem, ListItemText, Paper, Typography} from 'material-ui';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';
import {compose} from 'redux';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {StoreContents} from 'InjectableInterfaces/State';
import {clearLastError, getLastError, Error as HostAppError, ErrorType} from 'State/HostApp';

interface Props {
  hostAppError?: HostAppError;
  clearLastError: (x: undefined) => void;
  children: JSX.Element | JSX.Element[];
}

interface State {
  contentsRevealed: boolean;
}

const styles = {
  fullWidth: {
    width: '100%',
  },
  padding: {
    padding: '24px',
  },
};

export type HostAppErrorWrapperComponentProps = Props & RouteComponentProps<{}> & WithStyles<keyof typeof styles>;

export class HostAppErrorWrapperComponent
  extends React.Component<HostAppErrorWrapperComponentProps, State> {
  public state: State = {
    contentsRevealed: false,
  };

  @lazyInject(Symbols.PassB)
  protected passB: Interfaces.PassB;

  public render(): JSX.Element | JSX.Element[] {
    const {hostAppError, children, history, classes, clearLastError} = this.props; // tslint:disable-line:no-shadowed-variable
    const {contentsRevealed} = this.state;

    if (!hostAppError) {
      return children;
    }

    return (
      <div>
        <Typography key="heading" type="title" gutterBottom={true}>
          {browser.i18n.getMessage('popup_host_app_error_title')}
        </Typography>
        {hostAppError.type === ErrorType.HOST_APP_ERROR && (
          <div>
            <Typography>{browser.i18n.getMessage('popup_host_app_error_message_internal')}</Typography>
            <List>
              <ListItem
                button={true}
                className="hostAppInfo"
                onClick={() => browser.tabs.create({url: 'https://passb.github.io/host_application.html'})}
              >
                <ListItemText primary={browser.i18n.getMessage('popup_host_app_error_option_install')}/>
              </ListItem>
              <ListItem
                button={true}
                className="reloadExtension"
                onClick={() => this.passB.reloadExtension()}
              >
                <ListItemText primary={browser.i18n.getMessage('popup_host_app_error_option_restart')}/>
              </ListItem>
              <ListItem
                button={true}
                className="openGithub"
                onClick={() => browser.tabs.create({url: 'https://github.com/PassB/passB/issues'})}
              >
                <ListItemText primary={browser.i18n.getMessage('popup_host_app_error_option_issue')}/>
              </ListItem>
            </List>
          </div>
        )}
        {hostAppError.type === ErrorType.PASS_EXECUTION_ERROR && (
          <div>
            <Typography>{browser.i18n.getMessage('popup_host_app_error_message_pass')}</Typography>
            <List>
              {contentsRevealed &&
              <ListItem className="errorContents">
                <Paper elevation={4} className={`${classes.padding} ${classes.fullWidth}`}>
                  <Typography type="body1" component="p">{hostAppError.message}</Typography>
                </Paper>
              </ListItem>
              ||
              <ListItem className="showError" button={true} onClick={() => this.setState({contentsRevealed: true})}>
                <ListItemText primary={browser.i18n.getMessage('popup_error_option_reveal')}/>
              </ListItem>
              }
              <ListItem
                className="goBack"
                button={true}
                onClick={() => {
                  clearLastError(void 0);
                  history.goBack();
                }}
              >
                <ListItemText primary={browser.i18n.getMessage('popup_error_option_back')}/>
              </ListItem>
              <ListItem
                button={true}
                className="openGithub"
                onClick={() => browser.tabs.create({url: 'https://github.com/PassB/passB/issues'})}
              >
                <ListItemText primary={browser.i18n.getMessage('popup_error_option_issue')}/>
              </ListItem>
            </List>
          </div>
        )}
      </div>
    );
  }
}

export const mapStateToProps = (state: StoreContents): { hostAppError?: HostAppError } => ({
  hostAppError: getLastError(state),
});

export const HostAppErrorWrapper = compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {clearLastError}),
)(HostAppErrorWrapperComponent);
