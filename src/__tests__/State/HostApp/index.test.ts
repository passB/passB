import {getLastError, reducer, Actions, ErrorType} from 'State/HostApp';
import {StoreContents} from '../../../InjectableInterfaces/State';

describe('HostApp State', () => {
  test('setLastError', () => {
    expect(reducer(undefined!, Actions.setLastError({type: ErrorType.HOST_APP_ERROR, message: 'test'}))).toMatchSnapshot();
  });

  test('clearLastError', () => {
    const before = reducer(undefined!, Actions.setLastError({type: ErrorType.HOST_APP_ERROR, message: 'test'}));
    expect(reducer(before, Actions.clearLastError(void 0))).toMatchSnapshot();
  });

  test('getLastError', () => {
    const state = {hostApp: reducer(undefined!, Actions.setLastError({type: ErrorType.HOST_APP_ERROR, message: 'test'}))};
    expect(getLastError(state as StoreContents)).toEqual({type: ErrorType.HOST_APP_ERROR, message: 'test'});
  });
});
