import {InjectTagged, Service} from 'typedi';
import {executeInCorrectContext, AsynchronousCallableServiceFactory} from 'Decorators/ExecuteInContext';
import {LazyInject} from 'Decorators/LazyInject';
import {EntryActions, Extension, ExtensionTag} from 'Extensions';
import {FileFormat, FileFormatTag} from 'PluggableStrategies/FileFormats';
import {Filler, FillerTag} from 'PluggableStrategies/Fillers';
import {Matcher, MatcherTag} from 'PluggableStrategies/Matchers';
import {Options, OptionsData, OptionsList} from './Options/Options';
import {OptionsReceiverInterface} from './Options/OptionsReceiver';

export interface Action {
  extension: string;
  action: string;
}

export interface EntryNode {
  name: string;
  fullPath: string;
  actions: Action[];
  children: { [label: string]: EntryNode };
}

function buildEntryNode({name, fullPath, actions = [], children = {}}: {
  name: string;
  fullPath: string;
  actions?: Action[];
  children?: { [label: string]: EntryNode };
}): EntryNode {
  return {
    name,
    fullPath,
    actions,
    children,
  };
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

  private rootNode: EntryNode = buildEntryNode({fullPath: '', name: ''});

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
      throw new Error(`query for unknown extension ${name}`);
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
  public async getRootNode(): Promise<EntryNode> {
    return this.rootNode;
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

    this.rootNode = buildEntryNode({fullPath: '', name: ''});
    const rootNode = this.rootNode; // keep reference to "current" rootNode to prevent potential timing issues

    const addEntries = (newActions: EntryActions, extension: Extension<{}>) => {
      const parts = newActions.label.split('/');
      let node: EntryNode = rootNode;
      for (const [depth, part] of Array.from(parts.entries())) {
        if (part !== '') {
          const partName = depth === parts.length - 1 ? part : `${part}/`;

          if (!node.children[partName]) {
            node.children[partName] = buildEntryNode({
              name: part,
              fullPath: node.fullPath + partName,
            });
          }
          node = node.children[partName];
        }

        if (depth === parts.length - 1) {
          node.actions.push(...newActions.actions.map((action: string) => ({extension: extension.name, action})));
        }
      }
    };

    for (const extension of enabledExtensions) {
      await (extension.initializeList((newActions: EntryActions) => addEntries(newActions, extension)));
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
