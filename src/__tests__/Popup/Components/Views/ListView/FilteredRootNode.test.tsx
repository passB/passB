import {shallow} from 'enzyme';
import * as React from 'react';
import {Store} from 'redux';
import {getMockStore} from '__test_helpers__/getMockStore';
import {CollapsibleListItem} from 'Popup/Components/Views/ListView/CollapsibleListItem';
import {mapStateToProps, FilteredRootNodeComponent} from 'Popup/Components/Views/ListView/FilteredRootNode';
import {enableExtension} from 'State/Options/Actions';
import {reducer} from 'State/PassEntries';
import {setEntries} from 'State/PassEntries/Actions';
import {EntryAction, EntryNode} from 'State/PassEntries/Interfaces';
import {StoreContents} from 'State/State';

function mockRoot(entries: EntryAction[]): EntryNode {
  return reducer(undefined!, setEntries({
    extensionName: 'testExtension',
    entries,
  })).get('testExtension')!;
}

describe('FilteredRootNode', () => {
  describe('FilteredRootNodeComponent', () => {
    it('renders CollapsibleListItem that contains an EntryNodeList with root node - initially collapsed', () => {
      const rootNode = mockRoot([]);
      const rendered = shallow(<FilteredRootNodeComponent root={rootNode} filter=""/>);
      expect(rendered.find(CollapsibleListItem).length).toBe(1);
      expect((rendered.find(CollapsibleListItem).prop('CollapsedChildren') as JSX.Element).props.root).toEqualImmutable(rootNode);
      expect(rendered.find(CollapsibleListItem).prop('initiallyExpanded')).toBe(false);
    });

    it('renders with initiallyExpanded when filter is not empty', () => {
      const rootNode = mockRoot([]);
      const rendered = shallow(<FilteredRootNodeComponent root={rootNode} filter="test"/>);
      expect(rendered.find(CollapsibleListItem).prop('initiallyExpanded')).toBe(true);
    });
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

    it('filters for all nodes where fullPath matches partially', () => {
      const result = mapStateToProps(store.getState(), {filter: 'logout'});
      expect(result).toMatchSnapshot();
    });
  });
});
