import {MuiThemeProvider} from 'material-ui';
import {createMuiTheme} from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from 'typedi';
import {executionContext} from 'Constants';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassB} from 'PassB';
import {Popup} from './Components/Popup';

import 'typeface-roboto';
import {State} from 'State/State';
import './style.scss';

setExecutionContext(executionContext.popup);

Container.get(PassB).initialize();

const theme = createMuiTheme();

Container.get(State).hydrated.then(() => {

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Popup/>
  </MuiThemeProvider>,
  document.getElementById('app'),
);

});
