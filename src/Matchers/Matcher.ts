import {ListEntry} from "../Extensions/Extension";

export abstract class Matcher {
  public abstract filterEntries(url: string, entries: ListEntry[]): Promise<ListEntry[]>;
}
