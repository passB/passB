// tslint:disable:no-any
declare module 'remotedev-serialize' {
  import * as Immutable from 'immutable';

  export function immutable(immutable: typeof Immutable): {
    stringify(data: {}): string;
    parse(jsonData: string): any;
  };
}
