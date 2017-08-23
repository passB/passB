import {score} from "fuzzaldrin";
import {ListEntry} from "../Extensions/Extension";
import {Matcher} from "./Matcher";

interface ScoredEntry {
  entry: ListEntry;
  score: number;
}

export class FuzzaldrinMatcher extends Matcher {
  private options = {
    cutoff: 0.1,
    maxResults: 20,
  };

  public async filterEntries(url: string, entries: ListEntry[]): Promise<ListEntry[]> {
    return entries
      .map((entry: ListEntry): ScoredEntry => ({entry, score: score(entry.label, url)}))
      .filter((entry: ScoredEntry) => entry.score > this.options.cutoff)
      .sort((a: ScoredEntry, b: ScoredEntry) => a.score - b.score)
      .slice(0, this.options.maxResults)
      .map((entry: ScoredEntry) => entry.entry);
  }
}
