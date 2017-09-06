import {passB} from 'ConfiguredPassB';
import {Extension} from "../Extensions/Extension";
import {EntryView} from './Views/EntryView';
import {ListView} from './Views/ListView';

import {AppBar, Button, MuiThemeProvider, Toolbar, Typography} from "material-ui";
import {createMuiTheme} from "material-ui/styles";
// import Settings from 'material-ui/svg-icons/action/settings'; TODO: 1.0 beta
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;
import {MemoryRouter, Route, RouteComponentProps, RouteProps, Switch} from "react-router";

import "./style.scss";

interface State {
  activeTab?: Tab;
}

const theme = createMuiTheme();

class Popup extends React.Component<{}, State> {
  public state: State = {};
  private gatheredRoutes: RouteProps[] = this.gatherRoutes();

  public componentDidMount(): void {
    browser.tabs.query({
      active: true,
      currentWindow: true,
    }).then((tabs: Tab[]) => this.setState({activeTab: tabs[0]}));
  }

  public render(): JSX.Element {
    const {activeTab} = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <MemoryRouter>
          <div>
            <AppBar position="static">
              <Toolbar disableGutters={true}>
                <Typography type="title" color="inherit">
                  {browser.i18n.getMessage('extensionName')}
                </Typography>
                <Button
                  color="contrast"
                  onClick={() => {
                    browser.runtime.openOptionsPage();
                    window.close();
                  }}
                >
                  Settings
                </Button>
              </Toolbar>
            </AppBar>
            <Switch>
              {this.gatheredRoutes.map((route: RouteProps) => <Route key={String(route.path)}  {...route} />)}
              <Route
                path="/entry"
                component={EntryView}
              />
              <Route
                render={
                  ({history}: RouteComponentProps<{}>) => (
                    <ListView
                      navigateTo={(newUrl: string, state: {}) => history.push(newUrl, state)}
                      url={activeTab && activeTab.url ? activeTab.url : ''}
                    />
                  )}
              />
            </Switch>
          </div>
        </MemoryRouter>
      </MuiThemeProvider>
    );
  }

  private gatherRoutes(): RouteProps[] {
    const gatheredRoutes: RouteProps[] = [];
    for (const extension of passB.getExtensions()) {
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

ReactDOM.render(<Popup/>, document.getElementById('app'));
