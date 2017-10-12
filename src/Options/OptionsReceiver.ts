import {ComponentType} from 'react';

export interface OptionPanelProps<OptionType> {
  options: OptionType;
  updateOptions: (newOptions: OptionType) => void;
}

export type OptionsPanelType<OptionType> = ComponentType<OptionPanelProps<OptionType>>;

export interface OptionsReceiverInterface<OptionType> {
  readonly defaultOptions: OptionType;
  readonly OptionsPanel?: OptionsPanelType<OptionType>;
  readonly name: string;

  injectOptions(options: OptionType): void;
}

export abstract class OptionsReceiver<OptionType> implements OptionsReceiverInterface<OptionType> {
  public abstract readonly defaultOptions: OptionType;
  public abstract readonly OptionsPanel?: OptionsPanelType<OptionType>;
  public abstract readonly name: string;

  private _options: OptionType;

  public injectOptions(options: OptionType): void {
    this._options = options;
  }

  protected get options(): OptionType {
    return this._options;
  }
}
