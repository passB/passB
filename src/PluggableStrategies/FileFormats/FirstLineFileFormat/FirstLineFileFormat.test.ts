import 'jest';
import {Container} from 'typedi';
import {FirstLineFileFormat} from './FirstLineFileFormat';

const passwordFileName1 = 'test/file/path';

const passwordFile1 = [
  'firstLinePw',
  'testUser',
  'login: testUser2',
  'password: specifiedPw',
];

test('test usernameStyle None', () => {
  const fileFormat = Container.get(FirstLineFileFormat);
  fileFormat.injectOptions({
    usernameStyle: 'None',
  });
  expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe(void 0);
});

test('test usernameStyle SecondLine', () => {
  const fileFormat = Container.get(FirstLineFileFormat);
  fileFormat.injectOptions({
    usernameStyle: 'SecondLine',
  });
  expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe('testUser');
});

test('test usernameStyle LastPathPart', () => {
  const fileFormat = Container.get(FirstLineFileFormat);
  fileFormat.injectOptions({
    usernameStyle: 'LastPathPart',
  });
  expect(fileFormat.getPassword(passwordFile1, passwordFileName1)).toBe('firstLinePw');
  expect(fileFormat.getUsername(passwordFile1, passwordFileName1)).toBe('path');
});
