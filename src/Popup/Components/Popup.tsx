import {AppBar, Button, Card, CardContent, Toolbar, Typography, WithStyles} from 'material-ui';
import {Settings} from 'material-ui-icons';
import {withStyles, StyleRules} from 'material-ui/styles';
import * as React from 'react';
import Tab = browser.tabs.Tab;
import {MemoryRouter, Route, RouteComponentProps, RouteProps, Switch} from 'react-router';
import {LazyInject} from 'Decorators/LazyInject';
import {Extension} from 'Extensions';
import {PassB} from 'PassB';
import {ListView} from './Views/ListView';

interface Props {}

interface State {
  activeTab?: Tab;
}

const styles: StyleRules = {
  flexLeft: {
    flex: 1,
    marginLeft: '15px',
  },
  cardSize: {
    maxHeight: '390px',
    overflow: 'auto',
  },
};

class ClassLessPopup extends React.Component<Props & WithStyles<keyof typeof styles>, State> {
  public state: State = {};
  private gatheredRoutes: RouteProps[] = this.gatherRoutes();

  @LazyInject(() => PassB)
  private passB: PassB;

  public componentDidMount(): void {
    browser.tabs.query({
      active: true,
      currentWindow: true,
    }).then((tabs: Tab[]) => this.setState({activeTab: tabs[0]}));
  }

  public render(): JSX.Element {
    const {activeTab} = this.state;
    const {classes} = this.props;

    return (
      <MemoryRouter>
        <div>
          <AppBar position="fixed">
            <Toolbar>
              <Typography type="title" color="inherit" className={classes.flexLeft}>
                {browser.i18n.getMessage('extensionName')}
              </Typography>
              <Button
                color="contrast"
                onClick={() => {
                  browser.runtime.openOptionsPage();
                  window.close();
                }}
              >
                <Settings />
              </Button>
            </Toolbar>
          </AppBar>
          <Card>
            <CardContent className={classes.cardSize}>
              <Switch>
                {this.gatheredRoutes.map((route: RouteProps) => <Route key={String(route.path)}  {...route} />)}
                <Route
                  render={
                    ({history}: RouteComponentProps<{}>) => (
                      <ListView
                        url={activeTab && activeTab.url ? activeTab.url : ''}
                      />
                    )}
                />
              </Switch>
            </CardContent>
          </Card>
        </div>
      </MemoryRouter>
    );
  }

  private gatherRoutes(): RouteProps[] {
    const gatheredRoutes: RouteProps[] = [];
    for (const extension of this.passB.getAllExtensions()) {
      for (const route of (extension.constructor as typeof Extension).routes) {
        if (!(route.path || '').startsWith(`/extension/${extension.name}/`)) {
          throw Error(
            `every route path for extension ${extension.name} has to start with "/extension/${extension.name}/"`,
          );
        }
        gatheredRoutes.push(route);
      }
    }

    return gatheredRoutes;
  }
}

export const Popup = withStyles<keyof typeof styles>(styles)(ClassLessPopup);
