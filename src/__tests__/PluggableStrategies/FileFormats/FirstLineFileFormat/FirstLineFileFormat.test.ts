import {Container} from 'typedi';
import {executionContext} from 'Constants';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {
  FirstLineFileFormat,
  Options,
  UsernameStyle,
} from 'PluggableStrategies/FileFormats/FirstLineFileFormat/FirstLineFileFormat';
import {State} from 'State/State';
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
  const optionsGetter = jest.fn(getOptions);

  beforeEach(() => {
    optionsGetter.mockReset();
    Container.remove(FirstLineFileFormat);
    Object.defineProperty(
      Container.get(FirstLineFileFormat),
      'options',
      {get: optionsGetter},
    );
  });

  it('dispatches expected defaultOptions in background context', () => {
    const dispatch = jest.fn();

    setExecutionContext(executionContext.background);
    Container.set(State, {getStore: () => ({dispatch})});
    Container.remove(FirstLineFileFormat);
    Container.get(FirstLineFileFormat);

    expect(dispatch).toHaveBeenCalled();
    expect(dispatch.mock.calls).toMatchSnapshot();

    Container.remove(State);
  });

  it('returns the first line as password', () => {
    const fileFormat = Container.get(FirstLineFileFormat);
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  });

  it('returns undefined on usernameStyle None', () => {
    optionsGetter.mockReturnValue(getOptions({usernameStyle: 'None'}));

    const fileFormat = Container.get(FirstLineFileFormat);
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe(void 0);
  });

  test('returns the second line on usernameStyle SecondLine', () => {
    optionsGetter.mockReturnValue(getOptions({usernameStyle: 'SecondLine'}));

    const fileFormat = Container.get(FirstLineFileFormat);
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe('testUser');
  });

  test('returns the last path part at usernameStyle LastPathPart', () => {
    optionsGetter.mockReturnValue(getOptions({usernameStyle: 'LastPathPart'}));

    const fileFormat = Container.get(FirstLineFileFormat);
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe('path');
  });

});
