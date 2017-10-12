// web-ext-types is not a @types repo and needs to be referenced here
/// <reference types='web-ext-types/global' />

import {StyleRules} from 'material-ui/styles';
import {ExecutionContext} from '../src/Decorators/ExecuteInContext';

declare global {
  export interface Window {
    executionContext: ExecutionContext;
  }

  export class InputEvent extends Event {
  }
}

declare module 'material-ui/styles' {
  // this is not part of material-ui but just makes sense in this context
  export interface ClassProps<T extends StyleRules> {
    classes: {
      [P in keyof T]: string;
      };
  }
}

import {ListItemProps} from 'material-ui/List';

declare module 'material-ui/Menu/MenuItem' {
  export interface MenuItemProps extends ListItemProps {
    // value is missing in material-ui 1.0 beta 11 - fix it up
    value?: string;
  }
}
