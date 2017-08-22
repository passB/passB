import deepExtend = require( "deep-extend");
import {Extension, ListEntry as ExtensionListEntry} from "./Extensions/Extension";

interface Options {
  extensions: Extension[];
}

interface Action {
  extension: string;
  action: string;
}

interface Entry {
  [actionName: string]: Action;
}

export class PassB {
  private readonly options: Options;

  private entries: { [label: string]: Entry } = {};

  public constructor(options: Options) {
    this.options = options;
  }

  public async initialize() {
    this.entries = {};
    for (const extension of this.options.extensions) {
      extension.initializeList((entry) => this.registerListEntry(extension.name, entry));
    }
  }

  public registerListEntry(extensionName: string, entry: ExtensionListEntry) {
    const combinedEntry: Entry = entry.actions.reduce(
      (flattened: Entry, action: string): Entry => ({
        ...flattened,
        [`${extensionName}/${action}`]: {
          extension: extensionName,
          action,
        },
      }),
      {},
    );

    deepExtend(this.entries, {[entry.label]: combinedEntry});
  }
}
