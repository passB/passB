import {shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import {container, Symbols} from 'Container';
import {ListView} from 'Popup/Components/Views/ListView';
import {ContextualRootNode} from 'Popup/Components/Views/ListView/ContextualRootNode';
import {FilteredRootNode} from 'Popup/Components/Views/ListView/FilteredRootNode';

const searchQuery = '.search';
const rootQuery = FilteredRootNode;
const contextualQuery = ContextualRootNode;

describe('ListView Component', () => {

  beforeAll(() => {
    container.rebind(Symbols.PassB).toConstantValue({getMatcher: () => 'mockedMatcher'});
  });

  it('renders', () => {
    const rendered = shallow(<ListView url=""/>).dive();
    expect(rendered).toMatchSnapshot();
  });

  describe('search field', () => {
    it('is present', () => {
      const rendered = shallow(<ListView url=""/>).dive();
      expect(rendered.find(searchQuery).length).toBe(1);
    });

    it('is a controlled input field', async () => {
      const rendered = shallow(<ListView url=""/>).dive();
      let search = rendered.find(searchQuery);

      expect(search.prop('value')).not.toBeUndefined();
      expect(search.prop('value')).not.toBe('newValue');
      (search as ShallowWrapper<{ onChange: Function }>).prop('onChange')({target: {value: 'newValue'}});

      rendered.update();
      search = rendered.find(searchQuery) as ShallowWrapper;
      expect(search.prop('value')).toBe('newValue');
    });
  });

  describe('Root Node', () => {
    it('is present', () => {
      const rendered = shallow(<ListView url=""/>).dive();
      expect(rendered.find(rootQuery).length).toBe(1);
    });

    it('receives values from search field', () => {
      const rendered = shallow(<ListView url=""/>).dive();
      (rendered.find(searchQuery) as ShallowWrapper<{ onChange: Function }>).prop('onChange')({target: {value: 'newValue'}});

      rendered.update();

      expect(rendered.find(rootQuery).prop('filter')).toBe('newValue');
    });
  });

  describe('Contextual Node', () => {
    it('is not present if the url is empty', () => {
      const rendered = shallow(<ListView url=""/>).dive();
      expect(rendered.find(contextualQuery).length).toBe(0);
    });

    it('is present if the url is not empty', () => {
      const rendered = shallow(<ListView url="test"/>).dive();
      expect(rendered.find(contextualQuery).length).toBe(1);
    });

    it('is passed the url from the ListView prop', () => {
      const rendered = shallow(<ListView url="testTest"/>).dive();
      expect(rendered.find(contextualQuery).prop('url')).toBe('testTest');
    });

    it('is passed the the current Matcher', () => {
      const rendered = shallow(<ListView url="testTest"/>).dive();
      expect(rendered.find(contextualQuery).prop('matcher')).toBe('mockedMatcher');
    });
  });
});
