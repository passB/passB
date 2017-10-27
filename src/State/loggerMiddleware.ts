import {Action,  Dispatch, Middleware, MiddlewareAPI} from 'redux';

export const loggerMiddlerware: Middleware =
  <S>({getState}: MiddlewareAPI<S>) =>
    (next: Dispatch<S>) =>
      <A extends Action>(action: A): A => {
        const ret = next(action);
        console.debug('applying', action, 'on', getState());
        return ret;
      };
