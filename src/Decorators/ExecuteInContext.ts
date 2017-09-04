import "reflect-metadata";

export type ExecutionContext = "background" | "popup" | undefined;
const executionContexts = ["background", "popup"];

function getActionName(constructor: Function, propertyKey: string): string {
  return `$(constructor.name).$(propertyKey)`;
}

interface AsynchronousRequest {
  action: string;
  params: any[];
}

export const executeInCorrectContext = () =>
  <R, T extends (this: any, ...args: any[]) => Promise<R>>
    (
      target: object,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<T>,
    ): TypedPropertyDescriptor<T> => {

    const executionContext = Reflect.getMetadata("executionContext", target, propertyKey);
    if (!executionContexts.includes(executionContext)) {
      throw new Error("using " + executeInCorrectContext.name
        + ' decorator, but not declaring @Reflect.metadata("executionContext", "...") correctly',
      );
    }

    const wrappedFunction = descriptor.value || (() => Promise.reject(void 0));

    return {
      value: (async function wrapper(this: any, ...params: any[]): Promise<R> {
        if (window.executionContext === executionContext) {
          console.debug('executing synchonously %s.%s', target.constructor.name, propertyKey);
          return await wrappedFunction.apply(this, ...params);
        }

        console.debug('executing asynchonously %s.%s', target.constructor.name, propertyKey);
        return await browser.runtime.sendMessage({
          action: getActionName(target.constructor, propertyKey),
          params: [...params],
        });
      }) as T,
    };
  };

export const AsynchronousCallable = () =>
  <T extends { new(...args: any[]): {} }>(constructor: T): T =>
    class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        for (let obj = this; obj != null; obj = Object.getPrototypeOf(obj)) {
          for (const propertyKey of Object.getOwnPropertyNames(obj)) {
            const executionContext = Reflect.getMetadata("executionContext", this, propertyKey);
            if (executionContext && window.executionContext === executionContext) {

              browser.runtime.onMessage.addListener(
                (request: AsynchronousRequest, sender: object, sendResponse: Function) => {
                  if (request.action !== getActionName(constructor, propertyKey)) {
                    return false;
                  }

                  const wrappedFn: ((...args: any[]) => Promise<any>) = (this as any)[propertyKey];
                  wrappedFn.apply(this, ...request.params).then(sendResponse);
                  return true;
                },
              );

            }
          }
        }
      }
    };
