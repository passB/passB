import {passB} from 'ConfiguredPassB';
import {Extension} from "../Extensions/Extension";
import {EntryView} from './Views/EntryView';
import {ListView} from './Views/ListView';

import {AppBar, IconButton} from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Settings from 'material-ui/svg-icons/action/settings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;
import {MemoryRouter, Route, RouteComponentProps, RouteProps, Switch} from "react-router";

import "./style.scss";

interface State {
  activeTab?: Tab;
}

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
      <MuiThemeProvider>
        <MemoryRouter>
          <div>
            <AppBar
              title={<span>{browser.i18n.getMessage('extensionName')}</span>}
              iconElementLeft={<span/>}
              iconElementRight={<IconButton onClick={() => {
                browser.runtime.openOptionsPage();
                window.close();
              }}>
                <Settings />
              </IconButton>}
            />
            < Switch >
              {this.gatheredRoutes.map((route: RouteProps) => <Route key={String(route.path)}  {...route} />)}
              <Route
                path="/entry"
                component={EntryView}
              />
              <Route render={
                ({history}: RouteComponentProps<{}>) => <ListView
                  navigateTo={(newUrl: string, state: {}) => history.push(newUrl, state)}
                  url={activeTab && activeTab.url ? activeTab.url : ''}
                />
              }/>
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
