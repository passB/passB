import {Container} from 'typedi';
import {executionContext} from 'Constants';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassB} from 'PassB';
import {State} from 'State/State';

setExecutionContext(executionContext.background);

Container.get(State).hydrated.then(() => {
  Container.get(PassB).initialize();
});
