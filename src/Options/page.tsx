import {MuiThemeProvider} from 'material-ui';
import {createMuiTheme} from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from 'typedi';
import {PassB} from 'PassB';
import {AddonOptions} from './Components/AddonOptions';

import 'typeface-roboto';
import './style.scss';

Container.get(PassB).initialize();

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
