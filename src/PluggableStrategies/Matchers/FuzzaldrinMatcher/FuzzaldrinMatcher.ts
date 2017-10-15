import {score, IScoringOptions} from 'fuzzaldrin-plus';
import {Service} from 'typedi';
import {OptionsPanelType} from 'Options/OptionsReceiver';
import {EntryNode} from 'PassB';
import {Matcher, MatcherTag} from '../';
import {OptionsPanel} from './OptionsPanel';

interface ScoredEntry {
  entry: EntryNode;
  score: number;
}

export interface Options {
  fuzzOptions: IScoringOptions;
  minScore: number;
  maxResults: number;
}

/**
 * these matches are not very good but it serves as a proof of concept
 */
@Service({tags: [MatcherTag]})
export class FuzzaldrinMatcher extends Matcher<Options> {
  public static readonly URL_CLEAN_REGEX: RegExp = /^(http|ftp)s?:\/\//;

  public readonly defaultOptions: Options = {
    fuzzOptions: {
      pathSeparator: '/',
      allowErrors: true,
      isPath: true,
    },
    minScore: 1,
    maxResults: 20,
  };
  public readonly name: string = FuzzaldrinMatcher.name;
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

  public async filterEntries(url: string, entries: EntryNode[]): Promise<EntryNode[]> {
    url = url.replace(FuzzaldrinMatcher.URL_CLEAN_REGEX, '');
    const {maxResults, minScore} = this.options;

    return entries
      .map((entry: EntryNode): ScoredEntry => {
        let accumulatedScore = 0;
        for (const part of entry.fullPath.split('/')) {
          accumulatedScore += score(url, part, void 0, this.options.fuzzOptions);
        }

        return {entry, score: accumulatedScore};
      })
      .sort((a: ScoredEntry, b: ScoredEntry) => b.score - a.score)
      .filter((value: ScoredEntry) => value.score >= minScore)
      .slice(0, maxResults > 0 ? maxResults : void 0)
      .map((entry: ScoredEntry) => entry.entry);
  }
}
