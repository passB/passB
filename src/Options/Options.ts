import deepExtend = require('deep-extend');
import {Service} from 'typedi';
import {LazyInject} from 'Decorators/LazyInject';
import {PassB} from 'PassB';
import {OptionsReceiverInterface} from './OptionsReceiver';

export interface OptionsList {
  [extensionName: string]: {};
}

export interface OptionsData {
  enabledExtensions: string[];
  extensionsOptions: OptionsList;
  selectedMatcher: string;
  matchers: OptionsList;
  selectedFileFormat: string;
  fileFormats: OptionsList;
  selectedFiller: string;
  fillers: OptionsList;
}

function extractDefaultOptionsList(receivers: Array<OptionsReceiverInterface<{}>>): OptionsList {
  return receivers.reduce((list: OptionsList, receiver: OptionsReceiverInterface<{}>): OptionsList => ({
    ...list,
    [receiver.name]: receiver.defaultOptions,
  }), {} as OptionsList);
}

@Service()
export class Options {
  @LazyInject(() => PassB)
  protected passB: PassB;

  private _options: OptionsData;

  public async getOptions(): Promise<OptionsData> {
    if (!this._options) {
      this._options = deepExtend(
        this.getDefaultOptions(),
        (await browser.storage.local.get('options')) as OptionsData,
      );
    }
    return deepExtend({}, this._options);
  }

  public setOptions(newOptions: OptionsData): Promise<void> {
    this._options = newOptions;
    return browser.storage.local.set({options: newOptions});
  }

  private getDefaultOptions(): OptionsData {
    return {
      enabledExtensions: ['Pass'],
      extensionsOptions: extractDefaultOptionsList(this.passB.getAllExtensions()),
      selectedMatcher: this.passB.getAllMatchers()[0].constructor.name,
      matchers: extractDefaultOptionsList(this.passB.getAllMatchers()),
      selectedFileFormat: this.passB.getAllFileFormats()[0].constructor.name,
      fileFormats: extractDefaultOptionsList(this.passB.getAllFileFormats()),
      selectedFiller: this.passB.getAllFillers()[0].constructor.name,
      fillers: extractDefaultOptionsList(this.passB.getAllFillers()),
    };
  }
}
