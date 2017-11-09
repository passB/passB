import {injectable} from 'inversify';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {StrategyName} from 'State/Interfaces';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';
import {Matcher} from '../';

interface Options {
  autoWww: boolean;
  matchInSubDirs: boolean;
  ignoreLastPart: boolean;
  requireFullMatch: boolean;
}

@injectable()
export class SimpleMatcher extends Matcher<Options> {
  public static readonly URL_CLEAN_REGEX: RegExp = /^(?:http|ftp)s?:\/\/(.*?)\/?$/;
  public readonly name: StrategyName = 'SimpleMatcher';
  public readonly defaultOptions: TypedMap<Options> = createTypedMap({
    autoWww: true,
    matchInSubDirs: false,
    ignoreLastPart: false,
    requireFullMatch: false,
  });
  public readonly OptionsPanel: OptionsPanelType<Options>;

  public filterEntries(url: string, entries: EntryNode[]): EntryNode[] {
    url = url.replace(SimpleMatcher.URL_CLEAN_REGEX, '$1');
    const {autoWww, matchInSubDirs, ignoreLastPart, requireFullMatch} = this.options.toJS();

    if (autoWww && url.startsWith('www.')) {
      url = url.substring(4);
    }

    return entries
      .filter((entry: EntryNode) => !entry.get('fullPath').endsWith('/'))
      .filter((entry: EntryNode) => {
        const fullPath = entry.get('fullPath');
        let filterVals: Set<string> = new Set([fullPath]);

        if (matchInSubDirs) {
          const parts = fullPath.split('/');
          while (parts.length > 1) {
            parts.shift();
            filterVals.add(parts.join('/'));
          }
        }

        if (ignoreLastPart) {
          for (const val of Array.from(filterVals)) {
            if (val.lastIndexOf('/') !== -1) {
              filterVals.add(val.substring(0, val.lastIndexOf('/')));
            }
          }
        }

        if (autoWww) {
          filterVals = new Set(Array.from(filterVals).map((val: string) => val.startsWith('www.') ? val.substring(4) : val));
        }

        if (requireFullMatch) {
          return Array.from(filterVals).includes(url);
        } else {
          return Array.from(filterVals).some((pathString: string) => pathString.startsWith(url) || url.startsWith(pathString));
        }
      })
      ;
  }
}
