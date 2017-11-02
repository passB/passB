import {MuiThemeProvider} from 'material-ui';
import {createMuiTheme} from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {executionContext} from 'Constants';
import {Container, Interfaces, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {Popup} from './Components/Popup';

import 'typeface-roboto';
import './style.scss';

import './keyboardNavigation';

setExecutionContext(executionContext.popup);

const theme = createMuiTheme();

const state = Container.get<Interfaces.State>(Symbols.State);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <PersistGate persistor={state.getPersistor()} loading={'loading'}>
      <Provider store={state.getStore()}>
        <Popup/>
      </Provider>
    </PersistGate>
  </MuiThemeProvider>,
  document.getElementById('app'),
);
