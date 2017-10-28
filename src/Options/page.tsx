import {MuiThemeProvider} from 'material-ui';
import {createMuiTheme} from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {Container} from 'typedi';
import {executionContext} from 'Constants';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassB} from 'PassB';
import {State} from 'State/State';
import {AddonOptions} from './Components/AddonOptions';

import 'typeface-roboto';
import './style.scss';

setExecutionContext(executionContext.options);

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

const state = Container.get(State);
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <PersistGate persistor={state.getPersistor()} loading={'loading'}>
      <Provider store={state.getStore()}>
        <AddonOptions/>
      </Provider>
    </PersistGate>
  </MuiThemeProvider>,
  document.getElementById('app'),
);
