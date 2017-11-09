import {List, OrderedMap} from 'immutable';
import {container} from 'Container';
import {SimpleMatcher} from 'PluggableStrategies/Matchers/SimpleMatcher/SimpleMatcher';
import {EntryNode} from 'State/PassEntries/Interfaces';
import {createTypedMap} from 'State/Types/TypedMap';

const getTestData = () => [
  'www.example.com',
  'example.com',
  'example.com/',
  'example.com/username',
  'example.com/login',
  'example.com/login/',
  'example.com/login/username',
  'example.com/logout',
  'example.com/otherPath/',
  'example.com/otherPath/login',
  'example.com/otherPath/login/username',
  'subFolder/example.com',
  'subFolder/example.com/',
  'subFolder/example.com/username',
  'subFolder/example.com/login',
  'otherDomain.com',
].map((fullPath: string): EntryNode => createTypedMap({
  name: (fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath).split('/').pop()! + (fullPath.endsWith('/') ? '/' : ''),
  fullPath,
  actions: List(),
  children: OrderedMap<string, EntryNode>(),
}));

const getFullPaths = (nodes: EntryNode[]) => nodes.map((node: EntryNode) => node.get('fullPath'));

describe('SimpleMatcher', () => {
  let matcher: SimpleMatcher;

  describe('autoWww: false, matchInSubDirs: false, ignoreLastPart: false, requireFullMatch: false', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: false,
          matchInSubDirs: false,
          ignoreLastPart: false,
          requireFullMatch: false,
        }),
      });
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'example.com/otherPath/login',
        'example.com/otherPath/login/username',
      ]);
    });

    it('example.com/login', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/login', getTestData()))).toEqual([
        'example.com',
        'example.com/login',
        'example.com/login/username',
      ]);
    });

    it('example.com/somethingElse', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/somethingElse', getTestData()))).toEqual([
        'example.com',
      ]);
    });
  });

  describe('autoWww: true, matchInSubDirs: false, ignoreLastPart: false, requireFullMatch: false', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: true,
          matchInSubDirs: false,
          ignoreLastPart: false,
          requireFullMatch: false,
        }),
      });
    });

    it('www.example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'www.example.com',
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'example.com/otherPath/login',
        'example.com/otherPath/login/username',
      ]);
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'www.example.com',
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'example.com/otherPath/login',
        'example.com/otherPath/login/username',
      ]);
    });
  });

  describe('autoWww: false, matchInSubDirs: false, ignoreLastPart: true, requireFullMatch: false', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: false,
          matchInSubDirs: false,
          ignoreLastPart: true,
          requireFullMatch: false,
        }),
      });
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'example.com/otherPath/login',
        'example.com/otherPath/login/username',
      ]);
    });

    it('example.com/login', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/login', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
      ]);
    });

    it('example.com/somethingElse', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/somethingElse', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/logout',
      ]);
    });
  });

  describe('autoWww: false, matchInSubDirs: true, ignoreLastPart: false, requireFullMatch: false', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: false,
          matchInSubDirs: true,
          ignoreLastPart: false,
          requireFullMatch: false,
        }),
      });
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'example.com/otherPath/login',
        'example.com/otherPath/login/username',
        'subFolder/example.com',
        'subFolder/example.com/username',
        'subFolder/example.com/login',
      ]);
    });

    it('example.com/login', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/login', getTestData()))).toEqual([
        'example.com',
        'example.com/login',
        'example.com/login/username',
        'subFolder/example.com',
        'subFolder/example.com/login',
      ]);
    });

    it('example.com/somethingElse', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/somethingElse', getTestData()))).toEqual([
        'example.com',
        'subFolder/example.com',
      ]);
    });
  });

  describe('autoWww: false, matchInSubDirs: true, ignoreLastPart: true, requireFullMatch: false', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: false,
          matchInSubDirs: true,
          ignoreLastPart: true,
          requireFullMatch: false,
        }),
      });
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'example.com/otherPath/login',
        'example.com/otherPath/login/username',
        'subFolder/example.com',
        'subFolder/example.com/username',
        'subFolder/example.com/login',
      ]);
    });

    it('example.com/login', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/login', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/login/username',
        'example.com/logout',
        'subFolder/example.com',
        'subFolder/example.com/username',
        'subFolder/example.com/login',
      ]);
    });

    it('example.com/somethingElse', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/somethingElse', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/logout',
        'subFolder/example.com',
        'subFolder/example.com/username',
        'subFolder/example.com/login',
      ]);
    });
  });

  describe('autoWww: false, matchInSubDirs: false, ignoreLastPart: false, requireFullMatch: true', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: false,
          matchInSubDirs: false,
          ignoreLastPart: false,
          requireFullMatch: true,
        }),
      });
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'example.com',
      ]);
    });

    it('example.com/login', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/login', getTestData()))).toEqual([
        'example.com/login',
      ]);
    });

    it('example.com/somethingElse', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/somethingElse', getTestData()))).toEqual([]);
    });
  });

  describe('autoWww: true, matchInSubDirs: false, ignoreLastPart: false, requireFullMatch: true', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: true,
          matchInSubDirs: false,
          ignoreLastPart: false,
          requireFullMatch: true,
        }),
      });
    });

    it('www.example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'www.example.com',
        'example.com',
      ]);
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'www.example.com',
        'example.com',
      ]);
    });
  });

  describe('autoWww: false, matchInSubDirs: true, ignoreLastPart: true, requireFullMatch: true', () => {
    beforeAll(() => {
      matcher = container.resolve(SimpleMatcher);
      Object.defineProperty(matcher, 'options', {
        value: createTypedMap({
          autoWww: false,
          matchInSubDirs: true,
          ignoreLastPart: true,
          requireFullMatch: true,
        }),
      });
    });

    it('example.com', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com', getTestData()))).toEqual([
        'example.com',
        'example.com/username',
        'example.com/login',
        'example.com/logout',
        'subFolder/example.com',
        'subFolder/example.com/username',
        'subFolder/example.com/login',
      ]);
    });

    it('example.com/login', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/login', getTestData()))).toEqual([
        'example.com/login',
        'example.com/login/username',
        'subFolder/example.com/login',
      ]);
    });

    it('example.com/somethingElse', () => {
      expect(getFullPaths(matcher.filterEntries('https://example.com/somethingElse', getTestData()))).toEqual([]);
    });
  });

});
