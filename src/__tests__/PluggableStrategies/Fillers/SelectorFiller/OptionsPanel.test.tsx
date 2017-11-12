import {mount, shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import {OptionsPanel} from 'PluggableStrategies/Fillers/SelectorFiller/OptionsPanel';
import {Options} from 'PluggableStrategies/Fillers/SelectorFiller/SelectorFiller';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';

const getOptions = (partial: Partial<Options> = {}) => createTypedMap({
  defaultUsernameSelector: 'input[autocomplete="username"],input[type="email"]',
  defaultPasswordSelector: 'input[type="password"]',
  fillOnlyFirstMatchingField: true,
  usernameSelectorPrefix: '',
  passwordSelectorPrefix: '',
  ...partial,
});

describe('SelectorFiller OptionsPanel', () => {
  describe('rendering', () => {
    function testRendering(testOptions: TypedMap<Options>): void {
      let panel: ShallowWrapper<{}>;
      it('renders', () => {
        panel = shallow(
          <OptionsPanel options={testOptions} updateOptions={() => 0}/>,
        ).dive();
        expect(panel).toMatchSnapshot();
      });

      it('defaultUsernameSelector has correct value', () => {
        expect(panel.find('#defaultUsernameSelector').prop('value')).toBe(testOptions.get('defaultUsernameSelector'));
      });

      it('defaultUsernameSelector is not marked as erroneous', () => {
        expect(panel.find('#defaultUsernameSelector').prop('error')).toBe(false);
      });

      it('defaultPasswordSelector has correct value', () => {
        expect(panel.find('#defaultPasswordSelector').prop('value')).toBe(testOptions.get('defaultPasswordSelector'));
      });

      it('defaultPasswordSelector is not marked as erroneous', () => {
        expect(panel.find('#defaultPasswordSelector').prop('error')).toBe(false);
      });

      it('fillOnlyFirstMatchingField is checked correctly', () => {
        expect(
          (panel.find('#fillOnlyFirstMatchingField').prop('control') as JSX.Element).props.checked,
        ).toBe(testOptions.get('fillOnlyFirstMatchingField'));
      });

      it('usernameSelectorPrefix has correct value', () => {
        expect(panel.find('#usernameSelectorPrefix').prop('value')).toBe(testOptions.get('usernameSelectorPrefix'));
      });

      it('passwordSelectorPrefix has correct value', () => {
        expect(panel.find('#passwordSelectorPrefix').prop('value')).toBe(testOptions.get('passwordSelectorPrefix'));
      });
    }

    describe('default values', () => testRendering(getOptions()));
    describe('completely different options', () => testRendering(getOptions({
      defaultUsernameSelector: '',
      defaultPasswordSelector: '',
      fillOnlyFirstMatchingField: false,
      usernameSelectorPrefix: '#user',
      passwordSelectorPrefix: '#pass',
    })));
  });

  describe('should update options on interaction', () => {
    const optionsCallback = jest.fn();

    const testOptions: TypedMap<Options> = getOptions({});

    const panel = mount(
      <OptionsPanel options={testOptions} updateOptions={optionsCallback}/>,
    );

    beforeEach(() => {
      optionsCallback.mockReset();
    });

    it('updates defaultUsernameSelector', () => {
      panel.find('#defaultUsernameSelector').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('defaultUsernameSelector', 'test'));
    });

    it('marks defaultUsernameSelector as erroneous and does not call optionsCallback when invalid selector is entered', () => {
      panel.find('#defaultUsernameSelector').hostNodes().simulate('change', {target: {value: 'input[type="test]'}});
      expect(panel.find('#defaultUsernameSelector').first().prop('error')).toBe(true);
      expect(optionsCallback).not.toHaveBeenCalled();
    });

    it('updates defaultPasswordSelector', () => {
      panel.find('#defaultPasswordSelector').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('defaultPasswordSelector', 'test'));
    });

    it('marks defaultPasswordSelector as erroneous and does not call optionsCallback when invalid selector is entered', () => {
      panel.find('#defaultPasswordSelector').hostNodes().simulate('change', {target: {value: 'input[type="test]'}});
      expect(panel.find('#defaultPasswordSelector').first().prop('error')).toBe(true);
      expect(optionsCallback).not.toHaveBeenCalled();
    });

    it('updates fillOnlyFirstMatchingField', () => {
      panel.find('#fillOnlyFirstMatchingField').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('fillOnlyFirstMatchingField')}});
      expect(optionsCallback).toHaveBeenCalledWith(
        testOptions.set('fillOnlyFirstMatchingField', !testOptions.get('fillOnlyFirstMatchingField')),
      );
    });

    it('updates usernameSelectorPrefix', () => {
      panel.find('#usernameSelectorPrefix').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('usernameSelectorPrefix', 'test'));
    });

    it('updates passwordSelectorPrefix', () => {
      panel.find('#passwordSelectorPrefix').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('passwordSelectorPrefix', 'test'));
    });
  });

});
