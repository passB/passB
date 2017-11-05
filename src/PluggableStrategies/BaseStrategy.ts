import {injectable} from 'inversify';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {StrategyName, StrategyType} from 'State/Interfaces';
import {getStrategyOptions} from 'State/Options';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

@injectable()
export abstract class BaseStrategy<OptionType extends MapTypeAllowedData<OptionType>> implements Interfaces.Strategy<OptionType> {
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;
  public abstract readonly type: StrategyType;
  public abstract readonly name: StrategyName;
  public abstract readonly defaultOptions: TypedMap<OptionType>;

  @lazyInject(Symbols.State)
  private state: Interfaces.State;

  protected get options(): TypedMap<OptionType> {
    return getStrategyOptions(this.state.getStore().getState(), this);
  }
}
