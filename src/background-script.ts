import {Container} from 'typedi';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassB} from './PassB';

setExecutionContext('background');

Container.get(PassB).initialize();
