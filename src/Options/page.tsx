import 'ConfiguredPassB';
import {AddonOptions} from './Components/AddonOptions';
import "./style.scss";

import {MuiThemeProvider} from "material-ui";
import {createMuiTheme} from "material-ui/styles";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const theme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: '20px',
      },
    },
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <AddonOptions/>
  </MuiThemeProvider>,
  document.getElementById('app'),
);
