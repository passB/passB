import {List, ListItem, ListItemText, Paper, Typography} from 'material-ui';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {withRouter, RouteComponentProps} from 'react-router';
import {compose} from 'redux';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';

interface Props {
  children: JSX.Element | JSX.Element[];
}

interface State {
  error?: Error | false;
  info?: React.ErrorInfo | false;
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

class ErrorBoundaryComponent extends React.Component<Props & RouteComponentProps<{}> & WithStyles<keyof typeof styles>, State> {
  public state: State = {
    contentsRevealed: false,
  };

  @lazyInject(Symbols.PassB)
  protected passB: Interfaces.PassB;

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.setState({error, info, contentsRevealed: false});
  }

  public render(): JSX.Element | JSX.Element[] {
    const {children, history, classes} = this.props;
    const {error, info, contentsRevealed} = this.state;

    if (!error) {
      return children;
    }

    return (
      <div>
        <Typography key="heading" type="title" gutterBottom={true}>
          {browser.i18n.getMessage('popup_host_app_error_title')}
        </Typography>
        <Typography>{browser.i18n.getMessage('popup_error_message_react')}</Typography>
        <List>
          {contentsRevealed &&
          <ListItem>
            <Paper elevation={4} className={`${classes.padding} ${classes.fullWidth}`}>
              <Typography type="body1" component="p">{error.message}</Typography>
              {info && <Typography>{info.componentStack}</Typography>}
            </Paper>
          </ListItem>
          ||
          <ListItem button={true} onClick={() => this.setState({contentsRevealed: true})}>
            <ListItemText primary={browser.i18n.getMessage('popup_error_option_reveal')}/>
          </ListItem>
          }
          <ListItem
            button={true}
            onClick={() => {
              this.setState({error: false, info: false, contentsRevealed: false});
              history.goBack();
            }}
          >
            <ListItemText primary={browser.i18n.getMessage('popup_error_option_back')}/>
          </ListItem>
          <ListItem button={true} onClick={() => browser.tabs.create({url: 'https://github.com/PassB/passB/issues'})}>
            <ListItemText primary={browser.i18n.getMessage('popup_error_option_issue')}/>
          </ListItem>
        </List>
      </div>

    );
  }
}

export const ErrorBoundary = compose(
  withRouter,
  withStyles(styles),
)(ErrorBoundaryComponent);
