import {executionContext} from 'Constants';
import {container, Interfaces, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';

setExecutionContext(executionContext.background);

container.get<Interfaces.State>(Symbols.State).hydrated.then(() => {
  container.get<Interfaces.PassB>(Symbols.PassB).reloadEntries();
});
