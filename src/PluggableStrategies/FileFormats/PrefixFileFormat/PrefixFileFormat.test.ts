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

test('test passwordFirstLine', () => {
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

test('test passwordPrefix', () => {
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

test('test without trimWhitespace', () => {
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
