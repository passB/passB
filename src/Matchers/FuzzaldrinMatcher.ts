import {IScoringOptions, score} from "fuzzaldrin-plus";
import {Entry} from "../PassB";
import {Matcher} from "./Matcher";

interface ScoredEntry {
  entry: Entry;
  score: number;
}

/**
 * these matches are not very good but it serves as a proof of concept
 */
export class FuzzaldrinMatcher extends Matcher {
  private options = {
    fuzzOptions: {
      pathSeparator: '/',
      allowErrors: true,
      isPath: true,
    } as IScoringOptions,
  };

  public async filterEntries(url: string, entries: Entry[]): Promise<Entry[]> {
    const URL_CLEAN_REGEX = /^(http|ftp)s?:\/\//;
    url = url.replace(URL_CLEAN_REGEX, '');

    return entries
      .map((entry: Entry): ScoredEntry => {
        let accumulatedScore = 0;
        for (const part of entry.label.split('/')) {
          accumulatedScore += score(url, part, void 0, this.options.fuzzOptions);
        }

        return {entry, score: accumulatedScore};
      })
      .sort((a: ScoredEntry, b: ScoredEntry) => b.score - a.score)
      .map((entry: ScoredEntry) => entry.entry);
  }
}
