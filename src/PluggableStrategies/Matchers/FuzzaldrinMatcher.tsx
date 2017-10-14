import {score, IScoringOptions} from 'fuzzaldrin-plus';
import {TextField} from 'material-ui';
import * as React from 'react';
import {Service} from 'typedi';
import {OptionsPanelType, OptionPanelProps} from 'Options/OptionsReceiver';
import {EntryNode} from 'PassB';
import {Matcher, MatcherTag} from '.';

interface ScoredEntry {
  entry: EntryNode;
  score: number;
}

interface Options {
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
    minScore: 0,
    maxResults: 0,
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
          accumulatedScore += score(url, part, void 0, this.defaultOptions.fuzzOptions); // TODO
        }

        return {entry, score: accumulatedScore};
      })
      .sort((a: ScoredEntry, b: ScoredEntry) => b.score - a.score)
      .filter((value: ScoredEntry) => value.score >= minScore)
      .slice(0, maxResults > 0 ? maxResults : void 0)
      .map((entry: ScoredEntry) => entry.entry);
  }
}

function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
    <div>
      <TextField
        label="Minimum score:"
        helperText=""
        value={options.minScore}
        onChange={(e: any) => updateOptions({ // tslint:disable-line:no-any
          // required until material-ui get their typings right
          // this will be finally fixed with beta v1.0.0-beta.17
          ...options,
          minScore: Math.max(0, (e as React.ChangeEvent<HTMLInputElement>).target.valueAsNumber),
        })}
        type="number"
      />
      <br/>
      <TextField
        label="Maximum visible results:"
        helperText="to show all results, enter '0'"
        value={options.maxResults}
        onChange={(e: any) => updateOptions({ // tslint:disable-line:no-any
          // required until material-ui get their typings right
          ...options,
          maxResults: Math.max(0, (e as React.ChangeEvent<HTMLInputElement>).target.valueAsNumber),
        })}
        type="number"
      />
    </div>
  );
}
