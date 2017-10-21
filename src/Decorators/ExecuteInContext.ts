// tslint:disable:no-any

import 'reflect-metadata';

export type ExecutionContext = 'background' | 'popup' | 'options';

const EXECUTION_CONTEXT = 'execution_context';
const EXECUTING_IN_CONTEXT = 'executing_in_context';
const CONTEXT_METHODS = 'execution_context_methods';

function getActionName(constructor: Function, propertyKey: string): string {
  return `${constructor.name}.${propertyKey}`;
}

interface AsynchronousRequest {
  action: string;
  params: any[];
}

let definedExecutionContext: ExecutionContext;
export const setExecutionContext = (executionContext: ExecutionContext) => definedExecutionContext = executionContext;
export const getExecutionContext = () => definedExecutionContext;

export const executeInCorrectContext = (executionContext: ExecutionContext) => (
  <R, T extends (this: any, ...args: any[]) => Promise<R>>
  (
    target: object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> => {

    // define executionContext metadata information on property
    Reflect.defineMetadata(EXECUTION_CONTEXT, executionContext, target, propertyKey);

    // keep track of all methods with executionContext annotation
    let propertiesWithExecutionContext = Reflect.getOwnMetadata(CONTEXT_METHODS, target);
    if (!propertiesWithExecutionContext) {
      propertiesWithExecutionContext = [...(Reflect.getMetadata(CONTEXT_METHODS, target) || [])];
      Reflect.defineMetadata(CONTEXT_METHODS, propertiesWithExecutionContext, target);
    }
    propertiesWithExecutionContext.push(propertyKey);

    return {
      value: function(this: any, ...params: any[]): Promise<R> {
        const executingInContext = Reflect.getMetadata(EXECUTING_IN_CONTEXT, this);
        if (executingInContext !== executionContext) {
          return browser.runtime.sendMessage({
            action: getActionName(target.constructor, propertyKey),
            params: [...params],
          });
        }

        return descriptor.value!.call(this, params);
      } as T,
    };
  });

export const AsynchronousCallable = () =>
  <T extends { new(...args: any[]): {} }>(constructor: T): T =>
    class extends constructor {
      public constructor(...args: any[]) {
        super(...args);

        // save definedExecutionContext at the moment of class initialization for later use
        // in @executeInCorrectContext methods
        Reflect.defineMetadata(EXECUTING_IN_CONTEXT, definedExecutionContext, this);

        for (const propertyKey of Reflect.getMetadata(CONTEXT_METHODS, this) || []) {
          const executionContext = Reflect.getMetadata(EXECUTION_CONTEXT, this, propertyKey);
          if (executionContext && definedExecutionContext === executionContext) {
            browser.runtime.onMessage.addListener(
              (request: AsynchronousRequest, sender: object, sendResponse: Function) => {
                if (request.action !== getActionName(constructor, propertyKey)) {
                  return false;
                }

                const wrappedFn: ((...args: any[]) => Promise<any>) = (this as any)[propertyKey];
                wrappedFn.apply(this, request.params).then(sendResponse);
                return true;
              },
            );

          }
        }
      }
    };

export const AsynchronousCallableServiceFactory =
  <X, T extends { new(...args: any[]): X }>(type: T): ((...args: any[]) => X) =>
    ((...args: any[]): X => (new (AsynchronousCallable()(type))(...args)));
