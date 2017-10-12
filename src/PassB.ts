import {InjectTagged, Service} from 'typedi';
import {executeInCorrectContext, AsynchronousCallableServiceFactory} from 'Decorators/ExecuteInContext';
import {LazyInject} from 'Decorators/LazyInject';
import {Extension, ExtensionTag, ListEntry} from 'Extensions';
import {FileFormat, FileFormatTag} from 'PluggableStrategies/FileFormats';
import {Filler, FillerTag} from 'PluggableStrategies/Fillers';
import {Matcher, MatcherTag} from 'PluggableStrategies/Matchers';
import {Options, OptionsData, OptionsList} from './Options/Options';
import {OptionsReceiverInterface} from './Options/OptionsReceiver';

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

@Service({factory: AsynchronousCallableServiceFactory(PassB)})
export class PassB {
  @InjectTagged(ExtensionTag)
  protected extensions: Array<Extension<{}>>;
  @InjectTagged(FileFormatTag)
  protected fileFormats: Array<FileFormat<{}>>;
  @InjectTagged(MatcherTag)
  protected matchers: Array<Matcher<{}>>;
  @InjectTagged(FillerTag)
  protected fillers: Array<Filler<{}>>;
  @LazyInject(() => Options)
  protected options: Options;

  private entries: LabeledEntries = {};

  public async initialize(): Promise<this> {
    if (window.executionContext === 'background') {
      this.injectIntoChildren(await this.getOptions());
      await this.reloadEntries();
      return this;
    } else {
      this.injectIntoChildren(await this.getOptions());
      return this;
    }
  }

  public getAllExtensions(): Array<Extension<{}>> {
    return this.extensions;
  }

  public getExtension(name: string): Extension<{}> {
    const extension = this.extensions.find((item: Extension<{}>) => item.name === name);
    if (!extension) {
      throw new Error('query for unknown extension ' + name);
    }
    return extension;
  }

  public async getMatcher(): Promise<Matcher<{}>> {
    const selected = (await this.getOptions()).selectedMatcher;
    return this.matchers.find((strategy: OptionsReceiverInterface<{}>) => strategy.name === selected)
      || this.matchers[0];
  }

  public getAllMatchers(): Array<Matcher<{}>> {
    return this.matchers;
  }

  public async getFiller(): Promise<Filler<{}>> {
    const selected = (await this.getOptions()).selectedFiller;
    return this.fillers.find((strategy: OptionsReceiverInterface<{}>) => strategy.name === selected)
      || this.fillers[0];
  }

  public getAllFillers(): Array<Filler<{}>> {
    return this.fillers;
  }

  public async getFileFormat(): Promise<FileFormat<{}>> {
    const selected = (await this.getOptions()).selectedFileFormat;
    return this.fileFormats.find((strategy: OptionsReceiverInterface<{}>) => strategy.name === selected)
      || this.fileFormats[0];
  }

  public getAllFileFormats(): Array<FileFormat<{}>> {
    return this.fileFormats;
  }

  @executeInCorrectContext()
  @Reflect.metadata('executionContext', 'background')
  public async getEntries(): Promise<LabeledEntries> {
    return this.entries;
  }

  @executeInCorrectContext()
  @Reflect.metadata('executionContext', 'background')
  public async getOptions(): Promise<OptionsData> {
    return await this.options.getOptions();
  }

  @executeInCorrectContext()
  @Reflect.metadata('executionContext', 'background')
  public async setOptions(newOptions: OptionsData): Promise<OptionsData> {
    await this.options.setOptions(newOptions);
    this.injectIntoChildren(newOptions);
    await this.reloadEntries();
    return newOptions;
  }

  @executeInCorrectContext()
  @Reflect.metadata('executionContext', 'background')
  private async reloadEntries(): Promise<this> {
    const enabledExtensionNames = (await (this.getOptions())).enabledExtensions;
    const enabledExtensions = this.extensions
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

    this.extensions.forEach(injectOptions(options.extensionsOptions));
    this.fileFormats.forEach(injectOptions(options.fileFormats));
    this.fillers.forEach(injectOptions(options.fillers));
    this.matchers.forEach(injectOptions(options.matchers));
  }
}
