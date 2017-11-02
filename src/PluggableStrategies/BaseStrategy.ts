import {injectable, unmanaged} from 'inversify';
import {executionContext} from 'Constants';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {getExecutionContext} from 'Decorators/ExecuteInContext';
import {StrategyName, StrategyType} from 'State/Interfaces';
import {getStrategyOptions, setStrategyDefaultOptions} from 'State/Options';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';
import {OptionsPanelType} from '../InjectableInterfaces/OptionsPanel';

@injectable()
export abstract class BaseStrategy<OptionType extends MapTypeAllowedData<OptionType>> implements Interfaces.Strategy<OptionType> {
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;

  @lazyInject(Symbols.State)
  private state: Interfaces.State;

  // tslint:disable:no-parameter-properties
  // as these properties have to be accessed in this base class constructor, they have to be passed up by the inheriting class
  public constructor(
    @unmanaged() public readonly type: StrategyType,
    @unmanaged() public readonly name: StrategyName,
    @unmanaged() public readonly defaultOptions: TypedMap<OptionType>,
  ) {
    if (getExecutionContext() === executionContext.background) {
      this.state.getStore().dispatch(setStrategyDefaultOptions({
        strategyType: this.type,
        strategyName: this.name,
        options: this.defaultOptions,
      }));
    }
  }

  protected get options(): TypedMap<OptionType> {
    return getStrategyOptions(this.state.getStore().getState(), this.type, this.name) as TypedMap<OptionType>;
  }
}
