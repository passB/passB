import {Container} from 'typedi';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {State} from 'State/State';
import {PassB} from './PassB';

setExecutionContext('background');

const state = Container.get(State);
Container.get(PassB).initialize();

console.log(Container.get(PassB).getAllFileFormats());
state.hydrated.then(() => console.log(state.getOptions().toJS()));
