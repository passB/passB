import {InjectTagged, Service} from 'typedi';
import {executionContext} from 'Constants';
import {
  executeInCorrectContext,
  getExecutionContext,
  AsynchronousCallableServiceFactory,
} from 'Decorators/ExecuteInContext';
import {LazyInject} from 'Decorators/LazyInject';
import {EntryActions, Extension, ExtensionTag} from 'Extensions';
import {FileFormat, FileFormatTag} from 'PluggableStrategies/FileFormats';
import {Filler, FillerTag} from 'PluggableStrategies/Fillers';
import {Matcher, MatcherTag} from 'PluggableStrategies/Matchers';
import * as OptionsSelectors from 'State/Options/Selectors';
import {State} from 'State/State';

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
  @LazyInject(() => State)
  protected state: State;

  private rootNode: EntryNode = buildEntryNode({fullPath: '', name: ''});

  public async initialize(): Promise<this> {
    if (getExecutionContext() === executionContext.background) {
      await this.reloadEntries();
    }
    return this;
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

  public getMatcher(): Matcher<{}> {
    const selected = OptionsSelectors.getSelectedStrategy(this.state.getOptions(), 'Matcher');
    return this.matchers.find((strategy: Matcher<{}>) => strategy.name === selected)
      || this.matchers[0];
  }

  public getAllMatchers(): Array<Matcher<{}>> {
    return this.matchers;
  }

  public getFiller(): Filler<{}> {
    const selected = OptionsSelectors.getSelectedStrategy(this.state.getOptions(), 'Filler');
    return this.fillers.find((strategy: Filler<{}>) => strategy.name === selected)
      || this.fillers[0];
  }

  public getAllFillers(): Array<Filler<{}>> {
    return this.fillers;
  }

  public getFileFormat(): FileFormat<{}> {
    const selected =  OptionsSelectors.getSelectedStrategy(this.state.getOptions(), 'FileFormat');
    return this.fileFormats.find((strategy: FileFormat<{}>) => strategy.name === selected)
      || this.fileFormats[0];
  }

  public getAllFileFormats(): Array<FileFormat<{}>> {
    return this.fileFormats;
  }

  @executeInCorrectContext(executionContext.background)
  public async getRootNode(): Promise<EntryNode> {
    return this.rootNode;
  }

  @executeInCorrectContext(executionContext.background)
  private async reloadEntries(): Promise<this> {
    const enabledExtensionNames = OptionsSelectors.getEnabledExtensions(this.state.getOptions());
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
}
