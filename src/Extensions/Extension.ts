export interface ListEntry {
  label: string;
  actions: string[];
}

export interface Options {
}

export interface ExecutionOptions {
  navigateTo: (newUrl: string, state: {}) => void;
}

export type RegisterEntryCallback = (entry: ListEntry) => void;

export abstract class Extension {
  public abstract readonly name: string;
  public abstract readonly actions: string[];
  protected readonly options: Options;

  public constructor(options: Options) {
    this.options = options;
  }

  public abstract initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void>;
  public abstract getLabelForAction(action: string): string;
  public abstract executeAction(action: string, entry: string, options: ExecutionOptions): void;
}
