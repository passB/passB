import {Container} from 'typedi';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {actions} from 'State/Options';
import {State} from 'State/State';
import {PassB} from './PassB';

setExecutionContext('background');

const state = new State();
let i = 0;
setInterval(() => state.dispatch(actions.enableExtension({extensionName: `test ${i++}`})), 5000);

Container.get(PassB).initialize();
