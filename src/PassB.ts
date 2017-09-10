import {AsynchronousCallable, executeInCorrectContext} from "Decorators/ExecuteInContext";
import deepExtend = require( "deep-extend");
import {Extension, ListEntry} from "Extensions/Extension";
import {FileFormat} from "PluggableStrategies/FileFormats";
import {Filler} from "PluggableStrategies/Fillers";
import {Matcher} from "PluggableStrategies/Matchers";
import {Options, OptionsData, OptionsList} from "./Options/Options";
import {OptionsReceiverInterface} from "./Options/OptionsReceiver";

interface Config {
  extensions: Array<Extension<{}>>;
  matchers: Array<Matcher<{}>>;
  fileFormats: Array<FileFormat<{}>>;
  fillers: Array<Filler<{}>>;
}

export interface Action {
  extension: string;
  action: string;
}

export interface Entry {
  actions: Action[];
  label: string;
}

export interface LabeledEntries {
  [label: string]: Entry;
}

@AsynchronousCallable()
export class PassB {
  private readonly config: Config;
  private options: Options;

  private entries: LabeledEntries = {};

  public constructor(config: Config) {
    this.config = config;
  }

  public async initialize(): Promise<this> {
    if (window.executionContext === "background") {
      this.options = new Options(this);
      this.injectIntoChildren(await this.getOptions());
      await this.reloadEntries();
      return this;
    } else {
      this.injectIntoChildren(await this.getOptions());
      return this;
    }
  }

  public getAllExtensions(): Array<Extension<{}>> {
    return this.config.extensions;
  }

  public getExtension(name: string): Extension<{}> {
    const extension = this.config.extensions.find((item: Extension<{}>) => item.name === name);
    if (!extension) {
      throw new Error('query for unknown extension ' + name);
    }
    return extension;
  }

  public async getMatcher(): Promise<Matcher<{}>> {
    const selected = (await this.getOptions()).selectedMatcher;
    return this.config.matchers.find((strategy: OptionsReceiverInterface<{}>) => strategy.name === selected)
      || this.config.matchers[0];
  }

  public getAllMatchers(): Array<Matcher<{}>> {
    return this.config.matchers;
  }

  public async getFiller(): Promise<Filler<{}>> {
    const selected = (await this.getOptions()).selectedFiller;
    return this.config.fillers.find((strategy: OptionsReceiverInterface<{}>) => strategy.name === selected)
      || this.config.fillers[0];
  }

  public getAllFillers(): Array<Filler<{}>> {
    return this.config.fillers;
  }

  public async getFileFormat(): Promise<FileFormat<{}>> {
    const selected = (await this.getOptions()).selectedFileFormat;
    return this.config.fileFormats.find((strategy: OptionsReceiverInterface<{}>) => strategy.name === selected)
      || this.config.fileFormats[0];
  }

  public getAllFileFormats(): Array<FileFormat<{}>> {
    return this.config.fileFormats;
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  public async getEntries(): Promise<LabeledEntries> {
    return this.entries;
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  public async getOptions(): Promise<OptionsData> {
    return await this.options.getOptions();
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  public async setOptions(newOptions: OptionsData): Promise<OptionsData> {
    await this.options.setOptions(newOptions);
    this.injectIntoChildren(newOptions);
    await this.reloadEntries();
    return newOptions;
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  private async reloadEntries(): Promise<this> {
    const enabledExtensionNames = (await (this.getOptions())).enabledExtensions;
    const enabledExtensions = this.config.extensions
      .filter((extension: Extension<{}>) => enabledExtensionNames.includes(extension.name));

    this.entries = {};
    const entries = this.entries; // keep reference to "current" entries to prevent potential timing issues
    for (const extension of enabledExtensions) {
      await (extension.initializeList((entry: ListEntry) =>
        entries[entry.label] = {
          label: entry.label,
          actions: [
            ...(entries[entry.label] ? entries[entry.label].actions : []),
            ...entry.actions.map((action: string) => ({extension: extension.name, action})),
          ],
        }));
    }

    return this;
  }

  private injectIntoChildren(options: OptionsData): void {
    const injectOptions = (optionsList: OptionsList) =>
      (item: OptionsReceiverInterface<{}>) => item.injectOptions(optionsList[item.name]);

    this.config.extensions.forEach(injectOptions(options.extensionsOptions));
    this.config.fileFormats.forEach(injectOptions(options.fileFormats));
    this.config.fillers.forEach(injectOptions(options.fillers));
    this.config.matchers.forEach(injectOptions(options.matchers));
  }
}
