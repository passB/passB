import {shallow} from 'enzyme';
import * as React from 'react';
import {Store} from 'redux';
import {getMockStore} from '__test_helpers__/getMockStore';
import {Matcher} from 'PluggableStrategies/Matchers/Matcher';
import {CollapsibleListItem} from 'Popup/Components/Views/ListView/CollapsibleListItem';
import {mapStateToProps, ContextualRootNodeComponent} from 'Popup/Components/Views/ListView/ContextualRootNode';
import {enableExtension} from 'State/Options/Actions';
import {reducer} from 'State/PassEntries';
import {setEntries} from 'State/PassEntries/Actions';
import {EntryAction, EntryNode} from 'State/PassEntries/Interfaces';
import {getEntryNode} from 'State/PassEntries/Reducers';
import {StoreContents} from 'InjectableInterfaces/State';

function mockRoot(entries: EntryAction[]): EntryNode {
  return reducer(undefined!, setEntries({
    extensionName: 'testExtension',
    entries,
  })).get('testExtension')!;
}

describe('ContextualRootNode', () => {
  describe('ContextualRootNodeComponent', () => {
    it('returns empty component when called with a rootNode without children', () => {
      const rendered = shallow(<ContextualRootNodeComponent root={getEntryNode({name: '', fullPath: ''})}/>);
      expect(rendered.children().length).toBe(0);
    });

    it(
      'renders CollapsibleListItem that contains an EntryNodeList with root node when rootNode contains children - initially expanded',
      () => {
        const rootNode = mockRoot([
          {fullPath: 'example.com/login1/testUser', action: 'test'},
          {fullPath: 'example.com/logout1/testUser', action: 'test'},
        ]);
        const rendered = shallow(<ContextualRootNodeComponent root={rootNode}/>);
        expect(rendered.find(CollapsibleListItem).length).toBe(1);
        expect((rendered.find(CollapsibleListItem).prop('CollapsedChildren') as JSX.Element).props.root).toEqualImmutable(rootNode);
        expect(rendered.find(CollapsibleListItem).prop('initiallyExpanded')).toBe(true);
      },
    );
  });

  describe('mapStateToProps', () => {
    let store: Store<StoreContents>;
    beforeAll(() => {
      store = getMockStore();
      store.dispatch(enableExtension({extensionName: 'testExtension'}));
      store.dispatch(setEntries({
        extensionName: 'testExtension',
        entries: [
          {fullPath: 'example.com/login1/testUser', action: 'test'},
          {fullPath: 'example.com/logout1/testUser', action: 'test'},
          {fullPath: 'example.com/logout2/testUser', action: 'test'},
        ],
      }));
    });

    it('calls the matcher on all entries', () => {
      const filterEntries = jest.fn((url: string, nodes: EntryNode[]) => nodes);
      const matcher: Matcher<{}> = {filterEntries} as any; // tslint:disable-line:no-any

      mapStateToProps(store.getState(), {url: 'testUrl', matcher});
      expect(filterEntries.mock.calls).toMatchSnapshot();
    });

    it('filters the tree up to the matched entries', () => {
      const filterEntries = jest.fn((url: string, nodes: EntryNode[]) =>
        nodes.filter((node: EntryNode) =>
          node.get('fullPath') === 'example.com/logout1/testUser' || node.get('fullPath') === 'example.com/logout2/',
        ));
      const matcher: Matcher<{}> = {filterEntries} as any; // tslint:disable-line:no-any

      const result = mapStateToProps(store.getState(), {url: 'testUrl', matcher});
      expect(result).toMatchSnapshot();
    });
  });
});
