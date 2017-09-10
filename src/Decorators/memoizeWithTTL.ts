import memoize = require('lodash.memoize');

export const memoizeWithTTL = (ttl: number) =>
  <R, T extends (this: any, ...args: any[]) => R>
    (
      target: object,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<T>,
    ): TypedPropertyDescriptor<T> => {

    let memoized: T;
    let ttlEnd: number;

    return {
      value: function(this: any, ...args: any[]): R {
        const now = Date.now();
        if (!memoized || now > ttlEnd) {
          memoized = memoize(descriptor.value as Function) as any;
          ttlEnd = now + ttl;
        }
        return memoized.apply(this, args);
      } as T,
    };
  };
