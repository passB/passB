import {Container} from 'typedi';
import {executionContext} from 'Constants';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {Options, PrefixFileFormat} from 'PluggableStrategies/FileFormats/PrefixFileFormat/PrefixFileFormat';
import {State} from 'State/State';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';

const passwordFileName1 = 'test/file/path';

const passwordFile1 = [
  'firstLinePw',
  'username: testUser',
  'login: testUser2',
  'password: specifiedPw',
];

const getOptions = (partial: Partial<Options> = {}): TypedMap<Options> => createTypedMap({
  passwordFirstLine: true,
  passwordPrefix: '',
  usernamePrefix: 'login:',
  trimWhitespace: true,
  ...partial,
});

describe('PrefixFileFormat', () => {

  const optionsGetter = jest.fn(getOptions);

  beforeEach(() => {
    optionsGetter.mockReset();
    Container.remove(PrefixFileFormat);
    Object.defineProperty(
      Container.get(PrefixFileFormat),
      'options',
      {get: optionsGetter},
    );
  });

  it('dispatches expected defaultOptions in background context', () => {
    const dispatch = jest.fn();

    setExecutionContext(executionContext.background);
    Container.set(State, {dispatch});
    Container.remove(PrefixFileFormat);
    Container.get(PrefixFileFormat);

    expect(dispatch).toHaveBeenCalled();
    expect(dispatch.mock.calls).toMatchSnapshot();

    Container.remove(State);
  });

  it('should return first line when passwordFirstLine is true', () => {
    optionsGetter.mockReturnValue(getOptions({
      passwordFirstLine: true,
    }));

    expect(Container.get(PrefixFileFormat).getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  });

  it('should return password when passwordPrefix is found', () => {
    optionsGetter.mockReturnValue(getOptions({
      passwordFirstLine: false,
      passwordPrefix: 'password:',
    }));

    expect(Container.get(PrefixFileFormat).getPassword(passwordFile1, passwordFileName1)).toBe('specifiedPw');
  });

  it('should return undefined when passwordPrefix is not present', () => {
    optionsGetter.mockReturnValue(getOptions({
      passwordFirstLine: false,
      passwordPrefix: 'password_not_present:',
    }));

    expect(Container.get(PrefixFileFormat).getPassword(passwordFile1, passwordFileName1)).toBeUndefined();
  });

  it('should return username when usernamePrefix is found', () => {
    optionsGetter.mockReturnValue(getOptions({
      usernamePrefix: 'username:',
    }));

    expect(Container.get(PrefixFileFormat).getUsername(passwordFile1, passwordFileName1)).toBe('testUser');
  });

  it('should return undefined when usernamePrefix is not present', () => {
    optionsGetter.mockReturnValue(getOptions({
      usernamePrefix: 'username_not_present:',
    }));

    expect(Container.get(PrefixFileFormat).getUsername(passwordFile1, passwordFileName1)).toBeUndefined();
  });

  it('should not trim matches when trimWhitespace is set to false', () => {
    optionsGetter.mockReturnValue(getOptions({
      passwordFirstLine: false,
      usernamePrefix: 'username:',
      trimWhitespace: false,
      passwordPrefix: 'password:',
    }));

    const fileFormat = Container.get(PrefixFileFormat);
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe(' specifiedPw');
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe(' testUser');
  });
});
