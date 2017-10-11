import 'ConfiguredPassB';
import {Popup} from "./Components/Popup";

import {MuiThemeProvider} from "material-ui";
import {createMuiTheme} from "material-ui/styles";
// import Settings from 'material-ui/svg-icons/action/settings'; TODO: 1.0 beta
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import "./style.scss";

const theme = createMuiTheme();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Popup/>
  </MuiThemeProvider>,
  document.getElementById('app'),
);
