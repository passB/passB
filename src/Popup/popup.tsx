import {MuiThemeProvider} from 'material-ui';
import {createMuiTheme} from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from 'typedi';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassB} from 'PassB';
import {Popup} from './Components/Popup';

import 'typeface-roboto';
import './style.scss';

setExecutionContext('popup');

Container.get(PassB).initialize();

const theme = createMuiTheme();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Popup/>
  </MuiThemeProvider>,
  document.getElementById('app'),
);

import {State} from 'State/State';
const state = new State();

setTimeout(() => console.log('state options', state.getOptions().toJS()), 500);