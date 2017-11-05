import {Interfaces} from 'Container';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName, StrategyType} from 'State/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class FileFormat<OptionType extends MapTypeAllowedData<OptionType>>
  extends BaseStrategy<OptionType>
  implements Interfaces.FileFormat<OptionType> {
  public readonly type: StrategyType = 'FileFormat';
  public abstract readonly name: StrategyName;
  public abstract readonly defaultOptions: TypedMap<OptionType>;

  public abstract getPassword(lines: string[], entryName: string): string | undefined;

  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}
