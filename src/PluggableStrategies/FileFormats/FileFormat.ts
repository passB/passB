import {Interfaces} from 'Container';
import {BaseStrategy} from 'PluggableStrategies/BaseStrategy';
import {StrategyName} from 'State/Interfaces';
import {MapTypeAllowedData, TypedMap} from 'State/Types/TypedMap';

export abstract class FileFormat<OptionType extends MapTypeAllowedData<OptionType>>
  extends BaseStrategy<OptionType>
  implements Interfaces.FileFormat<OptionType> {
  public constructor(name: StrategyName, defaultOptions: TypedMap<OptionType>) {
    super('FileFormat', name, defaultOptions);
  }

  public abstract getPassword(lines: string[], entryName: string): string | undefined;

  public abstract getUsername(lines: string[], entryName: string): string | undefined;
}
