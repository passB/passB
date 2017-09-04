import {passB} from 'ConfiguredPassB';

import {Card, Checkbox, List, ListItem, MenuItem, SelectField, Slider, Tab, Tabs, TextField} from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// theme generated using https://cimdalli.github.io/mui-theme-generator/
// while the default theme looks good in the popup, it was a bit out of place in the options menu.
// this should be more subtle.
const getTheme = () => {
  const overwrites = {
    palette: {
      primary1Color: "#616161",
      primary2Color: "#9e9e9e",
      accent1Color: "#263238",
      pickerHeaderColor: "#9e9e9e",
    },
  };
  return getMuiTheme(baseTheme, overwrites);
};

import "./style.scss";

interface State {
}

class Popup extends React.Component<{}, State> {
  public state: State = {};

  public render(): JSX.Element {

    return (
      <MuiThemeProvider muiTheme={getTheme()}>
        <div>
          <Tabs>
            <Tab label={browser.i18n.getMessage('options_tab_extensions')}>
              <div>
                <h2>{browser.i18n.getMessage('options_tab_extensions')}</h2>
                <List>
                  <ListItem
                    leftCheckbox={<Checkbox checked={true}/>}
                    primaryText="Base Pass Functionality"
                  />
                  <ListItem
                    leftCheckbox={<Checkbox checked={true}/>}
                    primaryText="OTP Extension"
                  />
                  <ListItem
                    leftCheckbox={<Checkbox />}
                    primaryText="QRCode"
                  />
                </List>
              </div>
            </Tab>
            <Tab label={browser.i18n.getMessage('options_tab_matchers')}>
              <div>
                <h2>{browser.i18n.getMessage('options_tab_matchers')}</h2>
                <SelectField
                  value={1}
                  onChange={() => 0}
                >
                  <MenuItem value={1} primaryText="FuzzaldrinMatcher"/>
                </SelectField><br />
                <TextField
                  floatingLabelText="minimum score"
                  value="0"
                /><br />
                <TextField
                  floatingLabelText="max. results"
                  value="-1"
                /><br />
              </div>
            </Tab>
            <Tab label={browser.i18n.getMessage('options_tab_fillers')}>
              <div>
                <h2>{browser.i18n.getMessage('options_tab_fillers')}</h2>
                <SelectField
                  value={1}
                  onChange={() => 0}
                >
                  <MenuItem value={1} primaryText="Password in First Line"/>
                  <MenuItem value={2} primaryText="Labeled lines"/>
                </SelectField><br />
              </div>
            </Tab>
          </Tabs>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
