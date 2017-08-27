import {EntryView} from './Views/EntryView';
import {ListView} from './Views/ListView';

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;
import {MemoryRouter, Route, Switch} from "react-router";

import "./style.scss";

interface State {
  activeTab?: Tab;
}

class Popup extends React.Component<{}, State> {
  public state: State = {};

  public componentDidMount() {
    browser.tabs.query({
      active: true,
      currentWindow: true,
    }).then((tabs: Tab[]) => this.setState({activeTab: tabs[0]}));
  }

  public render() {
    const {activeTab} = this.state;

    return (
      <MuiThemeProvider>
        <MemoryRouter>
          <div>
            <h1>PassB</h1>
            <Switch>
              <Route
                path="/entry"
                render={({history, location: {state: {entry}}}) =>
                  <EntryView
                    navigateTo={(newUrl: string, state: {}) => history.push(newUrl, state)}
                    entry={entry}
                  />}
              />
              <Route render={
                ({history}) => <ListView
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
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
