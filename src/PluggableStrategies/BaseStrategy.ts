import {Service} from 'typedi/build/compiled/src';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {getStrategyOptions, setStrategyDefaultOptions, OptionsDataType, StrategyName, StrategyType} from 'State/Options';
import {LazyInject} from '../Decorators/LazyInject';
import {State} from '../State/State';

@Service()
export abstract class BaseStrategy<OptionType> {
  public abstract readonly defaultOptions: OptionsDataType<OptionType>;
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;
  public abstract readonly type: StrategyType;
  public abstract readonly name: StrategyName;

  @LazyInject(() => State)
  private state: State;

  public constructor() {
    this.state.dispatch(setStrategyDefaultOptions({
      strategyType: this.type,
      strategyName: this.name,
      options: this.defaultOptions,
    }));
  }

  protected get options(): OptionsDataType<OptionType> {
    return getStrategyOptions(this.state.getOptions(), this.type, this.name) as OptionsDataType<OptionType>;
  }
}
