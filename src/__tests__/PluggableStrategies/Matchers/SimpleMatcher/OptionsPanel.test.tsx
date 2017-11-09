import {mount, shallow, ShallowWrapper} from 'enzyme';
import * as React from 'react';
import {OptionsPanel} from 'PluggableStrategies/Matchers/SimpleMatcher/OptionsPanel';
import {Options} from 'PluggableStrategies/Matchers/SimpleMatcher/SimpleMatcher';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';

const getOptions = (partial: Partial<Options> = {}) => createTypedMap({
  autoWww: true,
  matchInSubDirs: false,
  ignoreLastPart: false,
  requireFullMatch: false,
  ...partial,
});

describe('SimpleMatcher OptionsPanel', () => {
  describe('rendering', () => {
    function testRendering(testOptions: TypedMap<Options>): void {
      let panel: ShallowWrapper<{}>;
      it('renders', () => {
        panel = shallow(
          <OptionsPanel options={testOptions} updateOptions={() => 0}/>,
        );
        expect(panel).toMatchSnapshot();
      });

      it('autoWww is checked correctly', () => {
        expect(
          (panel.find('#autoWww').prop('control') as JSX.Element).props.checked,
        ).toBe(testOptions.get('autoWww'));
      });

      it('matchInSubDirs is checked correctly', () => {
        expect(
          (panel.find('#matchInSubDirs').prop('control') as JSX.Element).props.checked,
        ).toBe(testOptions.get('matchInSubDirs'));
      });

      it('ignoreLastPart is checked correctly', () => {
        expect(
          (panel.find('#ignoreLastPart').prop('control') as JSX.Element).props.checked,
        ).toBe(testOptions.get('ignoreLastPart'));
      });

      it('requireFullMatch is checked correctly', () => {
        expect(
          (panel.find('#requireFullMatch').prop('control') as JSX.Element).props.checked,
        ).toBe(testOptions.get('requireFullMatch'));
      });

    }

    describe('default values', () => testRendering(getOptions()));
    describe('autoWww false', () => testRendering(getOptions({autoWww: false})));
    describe('matchInSubDirs true', () => testRendering(getOptions({matchInSubDirs: true})));
    describe('ignoreLastPart true', () => testRendering(getOptions({ignoreLastPart: true})));
    describe('requireFullMatch true', () => testRendering(getOptions({requireFullMatch: true})));
  });

  describe('should update options on interaction', () => {
    const optionsCallback = jest.fn();

    const testOptions: TypedMap<Options> = getOptions();

    const panel = mount(
      <OptionsPanel options={testOptions} updateOptions={optionsCallback}/>,
    );

    beforeEach(() => {
      optionsCallback.mockReset();
    });

    it('updates autoWww', () => {
      panel.find('#autoWww').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('autoWww')}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('autoWww', !testOptions.get('autoWww')));
    });

    it('updates matchInSubDirs', () => {
      panel.find('#matchInSubDirs').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('matchInSubDirs')}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('matchInSubDirs', !testOptions.get('matchInSubDirs')));
    });

    it('updates ignoreLastPart', () => {
      panel.find('#ignoreLastPart').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('ignoreLastPart')}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('ignoreLastPart', !testOptions.get('ignoreLastPart')));
    });

    it('updates requireFullMatch', () => {
      panel.find('#requireFullMatch').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.get('requireFullMatch')}});
      expect(optionsCallback).toHaveBeenCalledWith(testOptions.set('requireFullMatch', !testOptions.get('requireFullMatch')));
    });
  });

});
