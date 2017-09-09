import {AsynchronousCallable, executeInCorrectContext} from "Decorators/ExecuteInContext";
import deepExtend = require( "deep-extend");
import {Extension, ListEntry} from "Extensions/Extension";
import {FileFormat} from "PluggableStrategies/FileFormats";
import {Filler} from "PluggableStrategies/Fillers";
import {Matcher} from "PluggableStrategies/Matchers";
import {Options, OptionsData} from "./Options/Options";
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

  public initialize(): Promise<this> {
    this.options = new Options(this);

    return this.reload();
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  public async reload(): Promise<this> {
    const enabledExtensions = (await (this.getOptions())).enabledExtensions;

    this.entries = {};

    await Promise.all(this.config.extensions
      .filter((extension: Extension<{}>) => enabledExtensions.includes(extension.name))
      .map((extension: Extension<{}>) => extension.initializeList(
        (entry: ListEntry) => this.registerListEntry(extension.name, entry)),
      ),
    );

    return this;
  }

  public registerListEntry(extensionName: string, entry: ListEntry): void {
    this.entries[entry.label] = {
      label: entry.label,
      actions: [
        ...(this.entries[entry.label] ? this.entries[entry.label].actions : []),
        ...entry.actions.map((action: string) => ({extension: extensionName, action})),
      ],
    };
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
    return newOptions;
  }
}
