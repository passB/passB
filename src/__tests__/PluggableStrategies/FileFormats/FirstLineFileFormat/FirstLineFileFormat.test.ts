import {Store} from 'redux';
import {getMockStore} from '__test_helpers__/getMockStore';
import {executionContext} from 'Constants';
import {container, Interfaces, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {StoreContents} from 'InjectableInterfaces/State';
import {
  FirstLineFileFormat,
  Options,
  UsernameStyle,
} from 'PluggableStrategies/FileFormats/FirstLineFileFormat/FirstLineFileFormat';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';

const passwordFileName1 = 'test/file/path';

const passwordFile1 = [
  'firstLinePw',
  'testUser',
  'login: testUser2',
  'password: specifiedPw',
];

const getOptions = (partial: Partial<Options> = {}): TypedMap<Options> => createTypedMap({
  usernameStyle: 'SecondLine' as UsernameStyle,
  ...partial,
});

describe('FirstLineFileFormat', () => {
  beforeEach(() => {
    container.snapshot();
    setExecutionContext('test');
  });

  afterEach(() => {
    container.restore();
  });

  it('dispatches expected defaultOptions in background context', () => {
    const dispatch = jest.fn();

    setExecutionContext(executionContext.background);
    container.rebind(Symbols.State).toConstantValue({getStore: () => ({dispatch})})
    container.resolve(FirstLineFileFormat);

    expect(dispatch).toHaveBeenCalled();
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  it('returns the first line as password', () => {
    const fileFormat = container.resolve(FirstLineFileFormat);
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  });

  it('returns undefined on usernameStyle None', () => {
    const instance = container.resolve(FirstLineFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({usernameStyle: 'None'})});
    expect(instance.getUsername(passwordFile1, passwordFileName1)).toBe(void 0);
  });

  test('returns the second line on usernameStyle SecondLine', () => {
    const instance = container.resolve(FirstLineFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({usernameStyle: 'SecondLine'})});
    expect(instance.getUsername(passwordFile1, passwordFileName1)).toBe('testUser');
  });

  test('returns the last path part at usernameStyle LastPathPart', () => {
    const instance = container.resolve(FirstLineFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({usernameStyle: 'LastPathPart'})});
    expect(instance.getUsername(passwordFile1, passwordFileName1)).toBe('path');
  });

});
