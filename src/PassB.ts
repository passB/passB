import deepExtend = require( "deep-extend");
import {AsynchronousCallable, executeInCorrectContext, ExecutionContext} from "./Decorators/ExecuteInContext";
import {Extension, ListEntry} from "./Extensions/Extension";
import {Matcher} from "./Matchers/Matcher";

interface Options {
  extensions: Extension[];
  matchers: Matcher[];
}

interface Action {
  extension: string;
  action: string;
}

export interface Entry {
  actions: { [actionName: string]: Action };
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

  public async initialize() {
    if (window.executionContext === "background") {
      this.entries = {};
      for (const extension of this.options.extensions) {
        await extension.initializeList((entry) => this.registerListEntry(extension.name, entry));
      }
    }
    return this;
  }

  public registerListEntry(extensionName: string, entry: ListEntry) {

    deepExtend(
      this.entries,
      {
        [entry.label]: {
          label: entry.label,
          actions: entry.actions.map((action: string) => `${extensionName}/${action}`),
        },
      },
    );
  }

  public getMatcher() {
    return this.options.matchers[0];
  }

  @executeInCorrectContext()
  @Reflect.metadata("executionContext", "background")
  public async getEntries(): Promise<LabeledEntries> {
    return this.entries;
  }
}
