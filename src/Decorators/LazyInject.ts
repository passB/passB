import {Container, Token} from "typedi";

export function LazyInject(typeOrName?: ((type?: any) => Function) | string | Token<any>): Function {
  return (target: Object, propertyName: string, index?: number) => {

    let injectedService: any;

    Object.defineProperty(target, propertyName, {
      get: () => {
        if (!injectedService) {
          if (!typeOrName) {
            typeOrName = () => (Reflect as any).getMetadata("design:type", target, propertyName);
          }

          let identifier: any;
          if (typeof typeOrName === "string") {
            identifier = typeOrName;

          } else if (typeOrName instanceof Token) {
            identifier = typeOrName;

          } else if (typeof typeOrName === 'function') {
            identifier = typeOrName();
          }

          injectedService = Container.get(identifier);
        }
        return injectedService;
      },
      enumerable: true,
      configurable: false,
    });
  };
}
