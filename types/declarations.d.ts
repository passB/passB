// web-ext-types is not a @types repo and needs to be referenced here
/// <reference types='web-ext-types/global' />

import {ExecutionContext} from '../src/Decorators/ExecuteInContext';

declare global {
  export interface Window {
    executionContext: ExecutionContext;
  }

  export class InputEvent extends Event {
  }
}
