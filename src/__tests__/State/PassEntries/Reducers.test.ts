import * as Actions from 'State/PassEntries/Actions';
import {reducer} from 'State/PassEntries/Reducers';

describe('PassEntries Reducer', () => {
  it('has an empty map as initial state', () => {
    expect(reducer(undefined!, {type: 'SOME-ACTION'})).toMatchSnapshot();
  });

  it('resets extension "testExtension"', () => {
    expect(reducer(undefined!, Actions.resetEntries({extensionName: 'testExtension'}))).toMatchSnapshot();
  });

  describe('tree building', () => {
    it('builds an empty tree', () => {
      expect(reducer(undefined!, Actions.setEntries({
        extensionName: 'testExtension',
        entries: [],
      }))).toMatchSnapshot();
    });

    it('adds actions to root node', () => {
      expect(reducer(undefined!, Actions.setEntries({
        extensionName: 'testExtension',
        entries: [
          {fullPath: '', action: 'test'},
          {fullPath: '', action: 'test2'},
        ],
      }))).toMatchSnapshot();
    });

    describe('directories', () => {
      it('adds actions', () => {
        expect(reducer(undefined!, Actions.setEntries({
          extensionName: 'testExtension',
          entries: [
            {fullPath: 'dir/', action: 'test'},
            {fullPath: 'foo/dir/', action: 'test2'},
            {fullPath: 'foo/bar/dir/', action: 'test3'},
          ],
        }))).toMatchSnapshot();
      });

      it('creates missing intermediate directory nodes if necessary', () => {
        expect(reducer(undefined!, Actions.setEntries({
          extensionName: 'testExtension',
          entries: [
            {fullPath: 'foo/bar/dir/', action: 'test'},
          ],
        }))).toMatchSnapshot();
      });
    });

    describe('files', () => {
      it('adds actions to file nodes', () => {
        expect(reducer(undefined!, Actions.setEntries({
          extensionName: 'testExtension',
          entries: [
            {fullPath: 'file', action: 'test'},
            {fullPath: 'foo/file', action: 'test2'},
            {fullPath: 'foo/bar/file', action: 'test3'},
          ],
        }))).toMatchSnapshot();
      });

      it('creates missing intermediate directory nodes if necessary', () => {
        expect(reducer(undefined!, Actions.setEntries({
          extensionName: 'testExtension',
          entries: [
            {fullPath: 'foo/bar/file', action: 'test'},
          ],
        }))).toMatchSnapshot();
      });
    });

    it('adds actions for similarly named directories and files into different nodes', () => {
      expect(reducer(undefined!, Actions.setEntries({
        extensionName: 'testExtension',
        entries: [
          {fullPath: 'foo/bar', action: 'fileTest'},
          {fullPath: 'foo/bar/', action: 'directoryTest'},
          {fullPath: 'foo/bar/contents', action: 'fileTest2'},
        ],
      }))).toMatchSnapshot();
    });
  });
});
