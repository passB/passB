import {OptionsPanelType} from 'Options/OptionsReceiver';
import {getStrategyOptions, setStrategyDefaultOptions, StrategyName, StrategyType, TypedMap} from 'State/Options';
import {State} from 'State/State';
import {MapTypeAllowedData} from 'State/Types/TypedMap';
import {LazyInject} from '../Decorators/LazyInject';

export abstract class BaseStrategy<OptionType extends MapTypeAllowedData<OptionType>> {
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;

  @LazyInject(() => State)
  private state: State;

  // tslint:disable:no-parameter-properties
  // as these properties have to be accessed in this base class constructor, they have to be passed up by the inheriting class
  public constructor(
    public readonly type: StrategyType,
    public readonly name: StrategyName,
    public readonly defaultOptions: TypedMap<OptionType>,
  ) {
    this.state.dispatch(setStrategyDefaultOptions({
      strategyType: this.type,
      strategyName: this.name,
      options: this.defaultOptions,
    }));
  }

  protected get options(): TypedMap<OptionType> {
    return getStrategyOptions(this.state.getOptions(), this.type, this.name) as TypedMap<OptionType>;
  }
}
