import 'jest';
import {Container} from 'typedi';
import {PrefixFileFormat} from './PrefixFileFormat';

const passwordFileName1 = 'test/file/path';

const passwordFile1 = [
  'firstLinePw',
  'username: testUser',
  'login: testUser2',
  'password: specifiedPw',
];
describe('PrefixFileFormat', () => {
  it('should return first line when passwordFirstLine is true', () => {
    const fileFormat = Container.get(PrefixFileFormat);
    fileFormat.injectOptions({
      passwordFirstLine: true,
      usernamePrefix: 'login:',
      trimWhitespace: true,
      passwordPrefix: '',
    });
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe('testUser2');
  });

  it('should return password when passwordPrefix is found', () => {
    const fileFormat = Container.get(PrefixFileFormat);
    fileFormat.injectOptions({
      passwordFirstLine: false,
      usernamePrefix: 'username:',
      trimWhitespace: true,
      passwordPrefix: 'password:',
    });
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('specifiedPw');
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe('testUser');
  });

  it('should return undefined when prefix is not present', () => {
    const fileFormat = Container.get(PrefixFileFormat);
    fileFormat.injectOptions({
      passwordFirstLine: false,
      usernamePrefix: 'username_not_present:',
      trimWhitespace: true,
      passwordPrefix: 'password_not_present:',
    });
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBeUndefined();
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBeUndefined();
  });

  it('should not trim matches when trimWhitespace is set to false', () => {
    const fileFormat = Container.get(PrefixFileFormat);
    fileFormat.injectOptions({
      passwordFirstLine: false,
      usernamePrefix: 'username:',
      trimWhitespace: false,
      passwordPrefix: 'password:',
    });
    expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe(' specifiedPw');
    expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe(' testUser');
  });
});
