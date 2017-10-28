import {Container} from 'typedi';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {State} from 'State/State';
import {PassB} from './PassB';

setExecutionContext('background');

browser.storage.local.clear();

const state = Container.get(State);
Container.get(PassB).initialize();

state.hydrated.then(() => console.log(state.getOptions().toJS()));
state.getStore().subscribe(() => console.log(state.getOptions().toJS()));

