import {mount, shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import {OptionsPanel} from 'PluggableStrategies/FileFormats/PrefixFileFormat/OptionsPanel';
import {Options} from 'PluggableStrategies/FileFormats/PrefixFileFormat/PrefixFileFormat';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';

const getOptions = (partial: Partial<Options> = {}) => createTypedMap({
  passwordFirstLine: true,
  passwordPrefix: '',
  usernamePrefix: 'login:',
  trimWhitespace: true,
  ...partial,
});

describe('PrefixFileFormat OptionsPanel', () => {
  describe('rendering', () => {
    function testRendering(testOptions: TypedMap<Options>): void {
      let panel: ShallowWrapper<{}>;
      it('renders', () => {
        panel = shallow(
          <OptionsPanel options={testOptions} updateOptions={() => 0}/>,
        );
        expect(panel).toMatchSnapshot();
      });

      it('passwordFirstLine is checked correctly', () => {
        expect(
          shallow(panel.find('#passwordFirstLine').prop('control'))
            .prop('checked'),
        ).toBe(testOptions.get('passwordFirstLine'));
      });

      if (testOptions.get('passwordFirstLine')) {
        it('passwordPrefix is absent', () => {
          expect(panel.find('#passwordPrefix').length).toBe(0);
        });
      } else {
        it('passwordPrefix has correct value', () => {
          expect(panel.find('#passwordPrefix').prop('value')).toBe(testOptions.get('passwordPrefix'));
        });
      }

      it('usernamePrefix has correct value', () => {
        expect(panel.find({id: 'usernamePrefix'}).prop('value')).toBe(testOptions.get('usernamePrefix'));
      });

      it('trimWhitespace is checked correctly', () => {
        expect(
          shallow(panel.find('#trimWhitespace').prop('control'))
            .prop('checked'),
        ).toBe(testOptions.get('trimWhitespace'));
      });
    }

    describe('default values', () => testRendering(getOptions()));
    describe('without passwordPrefix', () => testRendering(getOptions({passwordFirstLine: false})));
    describe('completely different options', () => testRendering(getOptions({
      passwordFirstLine: false,
      passwordPrefix: 'pw:',
      usernamePrefix: 'lg:',
      trimWhitespace: false,
    })));
  });

  describe('should update options on interaction', () => {
    const optionsCallback = jest.fn();

    const testOptions: TypedMap<Options> = getOptions({
      passwordFirstLine: false,
      passwordPrefix: 'password:',
      usernamePrefix: 'login:',
      trimWhitespace: true,
    });

    const panel = mount(
      <OptionsPanel options={testOptions} updateOptions={optionsCallback}/>,
    );

    beforeEach(() => {
      optionsCallback.mockReset();
    });

    it('updates passwordFirstLine', () => {
      panel.find('#passwordFirstLine').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('passwordFirstLine')}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('passwordFirstLine', !testOptions.get('passwordFirstLine')));
    });

    it('updates passwordPrefix', () => {
      panel.find('#passwordPrefix').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('passwordPrefix', 'test'));
    });

    it('updates usernamePrefix', () => {
      panel.find('#usernamePrefix').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('usernamePrefix', 'test'));
    });

    it('updates trimWhitespace', () => {
      panel.find('#trimWhitespace').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('trimWhitespace')}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('trimWhitespace', !testOptions.get('trimWhitespace')));
    });
  });

});
