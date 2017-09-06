import {passB} from 'ConfiguredPassB';

import {
  Checkbox,
  FormControlLabel,
  List, ListItem, ListItemText,
  MuiThemeProvider,
  Tab,
  Tabs,
  TextField,
} from "material-ui";
import {default as Radio, RadioGroup} from 'material-ui/Radio';
import {createMuiTheme} from "material-ui/styles";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// theme generated using https://cimdalli.github.io/mui-theme-generator/
// while the default theme looks good in the popup, it was a bit out of place in the options menu.
// this should be more subtle.
/*
 TODO: figure out how to do in 1.0 beta

 import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
 import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
 */
const theme = createMuiTheme();

import "./style.scss";

type TabValue = "Extensions" | "Matcher" | "Filler" | "FileFormat";

interface State {
  selectedTab: TabValue;
}

// TODO: 1.0 beta 8 does not support SelectField yet, update from radio once it's been updated
// https://github.com/callemall/material-ui/issues/5716
// maybe also look at https://material-ui-1dab0.firebaseapp.com/demos/menus/#selected-menus

class Popup extends React.Component<{}, State> {
  public state: State = {
    selectedTab: "Extensions",
  };

  public render(): JSX.Element {

    const FillerOptionsPanel = passB.getFiller().OptionsPanel;
    const MatcherOptionsPanel = passB.getMatcher().OptionsPanel;
    const FileFormatOptionsPanel = passB.getFileFormat().OptionsPanel;

    const {selectedTab} = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Tabs value={selectedTab} onChange={(event: object, value: TabValue) => this.setState({selectedTab: value})}>
            <Tab value="Extensions" label={browser.i18n.getMessage('options_tab_extensions')}/>
            <Tab value="Matcher" label={browser.i18n.getMessage('options_tab_matchers')}/>
            <Tab value="Filler" label={browser.i18n.getMessage('options_tab_file_formats')}/>
            <Tab value="FileFormat" label={browser.i18n.getMessage('options_tab_fillers')} />
          </Tabs>
          {selectedTab === "Extensions" && <div>
            <h2>{browser.i18n.getMessage('options_tab_extensions')}</h2>
            <List>
              <ListItem>
                <Checkbox checked={true}/>
                <ListItemText primary="Base Pass Functionality"/>
              </ListItem>
              <ListItem>
                <Checkbox checked={true}/>
                <ListItemText primary="OTP Extensio"/>
              </ListItem>
              <ListItem>
                <Checkbox checked={true}/>
                <ListItemText primary="QRCode"/>
              </ListItem>
            </List>
          </div>}

          {selectedTab === "Matcher" && <div>
            <h2>{browser.i18n.getMessage('options_tab_matchers')}</h2>
            <RadioGroup
              selectedValue="1"
              onChange={() => 0}
            >
              <FormControlLabel value="1" control={<Radio />} label="FuzzaldrinMatcher"/>
            </RadioGroup><br />
            <TextField
              label="minimum score"
              value="0"
            /><br />
            <TextField
              label="max. results"
              value="-1"
            /><br />
            <MatcherOptionsPanel options={passB.getMatcher().defaultOptions} updateOptions={() => 0}/>
          </div>}
          {selectedTab === "FileFormat" && <div>
            <h2>{browser.i18n.getMessage('options_tab_file_formats')}</h2>
            <RadioGroup
              selectedValue="1"
              onChange={() => 0}
            >
              <FormControlLabel value="1" control={<Radio />} label="Password in First Line"/>
              <FormControlLabel value="2" control={<Radio />} label="Labeled lines"/>
            </RadioGroup><br />
            <FileFormatOptionsPanel options={passB.getFileFormat().defaultOptions} updateOptions={() => 0}/>
          </div>}
          {selectedTab === "Filler" && <div>
            <h2>{browser.i18n.getMessage('options_tab_fillers')}</h2>
            <RadioGroup
              selectedValue="1"
              onChange={() => 0}
            >
              <FormControlLabel value="1" control={<Radio />} label="Fill all password inputs"/>
            </RadioGroup><br />
            <FillerOptionsPanel options={passB.getFiller().defaultOptions} updateOptions={() => 0}/>
          </div>}

        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
