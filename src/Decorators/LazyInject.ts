import {Container, Token} from "typedi";

export function LazyInject(typeOrName: ((type?: any) => Function) | string | Token<any>): Function {

  let identifier: any;
  if (typeof typeOrName === "string") {
    identifier = typeOrName;

  } else if (typeOrName instanceof Token) {
    identifier = typeOrName;

  } else {
    identifier = typeOrName();
  }

  let injectedService: any;

  return (target: any, key: string) => {
    Object.defineProperty(target, key, {
      get: () => {
        if (!injectedService) {
          injectedService = Container.get(identifier);
        }
        return injectedService;
      },
      enumerable: true,
      configurable: false,
    });
  };
}
