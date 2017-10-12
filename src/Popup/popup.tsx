import {MuiThemeProvider} from 'material-ui';
import {createMuiTheme} from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from 'typedi';
import {PassB} from 'PassB';
import {Popup} from './Components/Popup';

import './style.scss';

Container.get(PassB).initialize();

const theme = createMuiTheme();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Popup/>
  </MuiThemeProvider>,
  document.getElementById('app'),
);
