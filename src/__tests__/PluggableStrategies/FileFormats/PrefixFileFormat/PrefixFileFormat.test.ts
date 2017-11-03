import {executionContext} from 'Constants';
import {container, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {Options, PrefixFileFormat} from 'PluggableStrategies/FileFormats/PrefixFileFormat/PrefixFileFormat';
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
    container.rebind(Symbols.State).toConstantValue({getStore: () => ({dispatch})});
    container.resolve(PrefixFileFormat);

    expect(dispatch).toHaveBeenCalled();
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  it('should return first line when passwordFirstLine is true', () => {
    const instance = container.resolve(PrefixFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({
      passwordFirstLine: true,
    })});

    expect(instance.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  });

  it('should return password when passwordPrefix is found', () => {
    const instance = container.resolve(PrefixFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({
      passwordFirstLine: false,
      passwordPrefix: 'password:',
    })});

    expect(instance.getPassword(passwordFile1, passwordFileName1)).toBe('specifiedPw');
  });

  it('should return undefined when passwordPrefix is not present', () => {
    const instance = container.resolve(PrefixFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({
      passwordFirstLine: false,
      passwordPrefix: 'password_not_present:',
    })});

    expect(instance.getPassword(passwordFile1, passwordFileName1)).toBeUndefined();
  });

  it('should return username when usernamePrefix is found', () => {
    const instance = container.resolve(PrefixFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({
      usernamePrefix: 'username:',
    })});

    expect(instance.getUsername(passwordFile1, passwordFileName1)).toBe('testUser');
  });

  it('should return undefined when usernamePrefix is not present', () => {
    const instance = container.resolve(PrefixFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({
      usernamePrefix: 'username_not_present:',
    })});

    expect(instance.getUsername(passwordFile1, passwordFileName1)).toBeUndefined();
  });

  it('should not trim matches when trimWhitespace is set to false', () => {
    const instance = container.resolve(PrefixFileFormat);
    Object.defineProperty(instance, 'options', {value: getOptions({
      passwordFirstLine: false,
      usernamePrefix: 'username:',
      trimWhitespace: false,
      passwordPrefix: 'password:',
    })});

    expect(instance.getPassword(passwordFile1, passwordFileName1)).toBe(' specifiedPw');
    expect(instance.getUsername(passwordFile1, passwordFileName1)).toBe(' testUser');
  });
});
