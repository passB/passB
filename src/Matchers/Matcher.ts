import {Entry, LabeledEntries} from "../PassB";

export abstract class Matcher {
  public abstract filterEntries(url: string, entries: Entry[]): Promise<Entry[]>;
}
