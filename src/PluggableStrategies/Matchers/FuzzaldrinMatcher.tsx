import {IScoringOptions, score} from "fuzzaldrin-plus";
import {OptionsPanelType} from "Options/OptionsReceiver";
import {Entry} from "PassB";
import {Matcher} from "./Matcher";

import * as React from 'react';

interface ScoredEntry {
  entry: Entry;
  score: number;
}

interface Options {
  fuzzOptions: IScoringOptions;
}

/**
 * these matches are not very good but it serves as a proof of concept
 */
export class FuzzaldrinMatcher extends Matcher<Options> {
  public readonly defaultOptions: Options = {
    fuzzOptions: {
      pathSeparator: '/',
      allowErrors: true,
      isPath: true,
    },
  };
  public readonly name: string = FuzzaldrinMatcher.name;
  public readonly OptionsPanel?: OptionsPanelType<Options> = void 0;

  public async filterEntries(url: string, entries: Entry[]): Promise<Entry[]> {
    const URL_CLEAN_REGEX = /^(http|ftp)s?:\/\//;
    url = url.replace(URL_CLEAN_REGEX, '');

    return entries
      .map((entry: Entry): ScoredEntry => {
        let accumulatedScore = 0;
        for (const part of entry.label.split('/')) {
          accumulatedScore += score(url, part, void 0, this.defaultOptions.fuzzOptions); // TODO
        }

        return {entry, score: accumulatedScore};
      })
      .sort((a: ScoredEntry, b: ScoredEntry) => b.score - a.score)
      .map((entry: ScoredEntry) => entry.entry);
  }
}
