import {AsynchronousCallable, executeInCorrectContext} from "Decorators/ExecuteInContext";
import deepExtend = require( "deep-extend");
import {Extension, ListEntry} from "Extensions/Extension";
import {FileFormat} from "PluggableStrategies/FileFormats";
import {Filler} from "PluggableStrategies/Fillers";
import {Matcher} from "PluggableStrategies/Matchers";

interface Options {
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
  private readonly options: Options;

  private entries: LabeledEntries = {};

  public constructor(options: Options) {
    this.options = options;
  }

  public async initialize(): Promise<this> {
    if (window.executionContext === "background") {
      this.entries = {};
      for (const extension of this.options.extensions) {
        await extension.initializeList((entry: ListEntry) => this.registerListEntry(extension.name, entry));
      }
    }
    return this;
  }

  public registerListEntry(extensionName: string, entry: ListEntry): void {

    deepExtend(
      this.entries,
      {
        [entry.label]: {
          label: entry.label,
          actions: entry.actions.map((action: string) => ({extension: extensionName, action})),
        },
      },
    );
  }

  public getExtensions(): Array<Extension<{}>> {
    return this.options.extensions;
  }

  public getExtension(name: string): Extension<{}> {
    const extension = this.options.extensions.find((item: Extension<{}>) => item.name === name);
    if (!extension) {
      throw new Error('query for unknown extension ' + name);
    }
    return extension;
  }

  public getMatcher(): Matcher<{}> {
    return this.options.matchers[0];
  }

  public getFiller(): Filler<{}> {
    return this.options.fillers[0];
  }

  public getFileFormat(): FileFormat<{}> {
    return this.options.fileFormats[0];
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  public async getEntries(): Promise<LabeledEntries> {
    return this.entries;
  }
}
