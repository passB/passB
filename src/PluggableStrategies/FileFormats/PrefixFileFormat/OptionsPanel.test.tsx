import {mount} from 'enzyme';
import {Checkbox, TextField} from 'material-ui';
import * as React from 'react';
import {OptionsPanel} from './OptionsPanel';
import {Options} from './PrefixFileFormat';

describe('PrefixFileFormat OptionsPanel', () => {
  it('should render with current options', () => {
    const testOptions: Options = {
      passwordFirstLine: false,
      passwordPrefix: 'password:',
      usernamePrefix: 'login:',
      trimWhitespace: true,
    };

    const panel = mount(
      <OptionsPanel options={testOptions} updateOptions={() => 0}/>,
    );

    expect(panel.find('#passwordFirstLine').find(Checkbox).prop('checked')).toBe(testOptions.passwordFirstLine);
    expect(panel.find(TextField).filter('#passwordPrefix').prop('value')).toBe(testOptions.passwordPrefix);
    expect(panel.find(TextField).filter('#usernamePrefix').prop('value')).toBe(testOptions.usernamePrefix);
    expect(panel.find('#trimWhitespace').find(Checkbox).prop('checked')).toBe(testOptions.trimWhitespace);
  });

  it('should not render passwordPrefix field when passwordFirstLine is true', () => {
    const testOptions: Options = {
      passwordFirstLine: true,
      passwordPrefix: 'password:',
      usernamePrefix: 'login:',
      trimWhitespace: true,
    };

    const panel = mount(
      <OptionsPanel options={testOptions} updateOptions={() => 0}/>,
    );

    expect(panel.find('#passwordFirstLine').find(Checkbox).prop('checked')).toBe(testOptions.passwordFirstLine);
    expect(panel.find(TextField).filter('#passwordPrefix').length).toBe(0);
  });

  describe('should update options on interaction', () => {
    const optionsCallback = jest.fn();

    const testOptions: Options = {
      passwordFirstLine: false,
      passwordPrefix: 'password:',
      usernamePrefix: 'login:',
      trimWhitespace: true,
    };

    const panel = mount(
      <OptionsPanel options={testOptions} updateOptions={(options: Options) => optionsCallback(options)}/>,
    );

    beforeEach(() => {
      optionsCallback.mockReset();
    });

    it('updates passwordFirstLine', () => {
      panel.find('#passwordFirstLine').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.passwordFirstLine}});
      expect(optionsCallback).toHaveBeenCalledWith({...testOptions, passwordFirstLine: !testOptions.passwordFirstLine});
    });

    it('updates passwordPrefix', () => {
      panel.find('#passwordPrefix').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith({...testOptions, passwordPrefix: 'test'});
    });

    it('updates usernamePrefix', () => {
      panel.find('#usernamePrefix').hostNodes().simulate('change', {target: {value: 'test'}});
      expect(optionsCallback).toHaveBeenCalledWith({...testOptions, usernamePrefix: 'test'});
    });

    it('updates trimWhitespace', () => {
      panel.find('#trimWhitespace').find('input').hostNodes()
        .simulate('change', {target: {checked: !testOptions.trimWhitespace}});
      expect(optionsCallback).toHaveBeenCalledWith({...testOptions, trimWhitespace: !testOptions.trimWhitespace});
    });
  });
});
