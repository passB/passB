import {PassExtension} from "Extensions/PassExtension/PassExtension";
import {PassB} from "PassB";
import {OptionsReceiverInterface} from "./OptionsReceiver";

import deepExtend = require("deep-extend");

interface OptionsList {
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

export class Options {
  private _options: OptionsData;

  public constructor(private passB: PassB) {
  }

  public async getOptions(): Promise<OptionsData> {
    if (!this._options) {
      this._options = deepExtend(
        this.getDefaultOptions(this.passB),
        (await browser.storage.local.get('options')) as OptionsData,
      );
    }
    return deepExtend({}, this._options);
  }

  public setOptions(newOptions: OptionsData): Promise<void> {
    this._options = newOptions;
    return browser.storage.local.set({options: newOptions});
  }

  private getDefaultOptions(passB: PassB): OptionsData {
    return {
      enabledExtensions: [PassExtension.name],
      extensionsOptions: extractDefaultOptionsList(passB.getAllExtensions()),
      selectedMatcher: passB.getAllMatchers()[0].constructor.name,
      matchers: extractDefaultOptionsList(passB.getAllMatchers()),
      selectedFileFormat: passB.getAllFileFormats()[0].constructor.name,
      fileFormats: extractDefaultOptionsList(passB.getAllFileFormats()),
      selectedFiller: passB.getAllFillers()[0].constructor.name,
      fillers: extractDefaultOptionsList(passB.getAllFillers()),
    };
  }
}
