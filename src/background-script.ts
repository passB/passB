import {executionContext} from 'Constants';
import {Container, Interfaces, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';

setExecutionContext(executionContext.background);

Container.get<Interfaces.State>(Symbols.State).hydrated.then(() => {
  Container.get<Interfaces.PassB>(Symbols.PassB).reloadEntries();
});
