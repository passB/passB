// tslint:disable:max-classes-per-file
import {mockBrowserMessaging} from '__test_helpers__/mockBrowserMessaging';
import {
  executeInCorrectContext,
  getExecutionContext,
  setExecutionContext,
  AsynchronousCallable,
  AsynchronousCallableServiceFactory,
} from 'Decorators/ExecuteInContext';

describe('ExecuteInContext', () => {

  @AsynchronousCallable()
  class SimpleCallbackInTest1 {
    private callback: () => Promise<{}>;

    public constructor(callback: () => Promise<{}> = async () => ({})) {
      this.callback = callback;
    }

    @executeInCorrectContext('test1')
    public directCallMe(...args: any[]): Promise<{}> { // tslint:disable-line:no-any
      return this.callback(...args);
    }
  }

  beforeAll(() => {
    const {resetListeners} = mockBrowserMessaging();
    beforeEach(resetListeners);
  });

  beforeEach(() => {
    setExecutionContext(void 0);
  });

  it('should set and get executionContext', () => {
    setExecutionContext('test1');
    expect(getExecutionContext()).toBe('test1');
    setExecutionContext('test2');
    expect(getExecutionContext()).toBe('test2');
  });

  describe('direct call behaviour', () => {

    it('should run directly in the specified context', () => {
      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test1');
      const instance = new SimpleCallbackInTest1(callable);
      instance.directCallMe();

      expect(callable).toHaveBeenCalled();
    });

    it('should run directly with parameters', () => {
      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test1');
      const instance = new SimpleCallbackInTest1(callable);
      instance.directCallMe('test', {property: 'value'}, ['array']);

      expect(callable).toHaveBeenCalledWith('test', {property: 'value'}, ['array']);
    });

    it('should also be called directly if context changes after instantiation', () => {
      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test1');
      const instance = new SimpleCallbackInTest1(callable);

      setExecutionContext('test2');
      instance.directCallMe();

      expect(callable).toHaveBeenCalled();
    });

    it('should not be called directly when instantiated in different context', () => {
      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test2');
      const instance = new SimpleCallbackInTest1(callable);

      instance.directCallMe();

      expect(callable).toHaveBeenCalledTimes(0);
    });

    it('should not be called directly when instantiated in different context and context changed', () => {
      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test2');
      const instance = new SimpleCallbackInTest1(callable);

      setExecutionContext('test1');
      instance.directCallMe();

      expect(callable).toHaveBeenCalledTimes(0);
    });
  });

  describe('context-traversing call behaviour', () => {
    it('should call from one instance in one context to another instance in another context', () => {
      const callable1 = jest.fn().mockReturnValue(Promise.resolve({}));
      const callable2 = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test2');
      const test2instance = new SimpleCallbackInTest1(callable2);

      setExecutionContext('test1');
      new SimpleCallbackInTest1(callable1);  // tslint:disable-line:no-unused-expression

      test2instance.directCallMe();

      expect(callable2).toHaveBeenCalledTimes(0);
      expect(callable1).toHaveBeenCalledTimes(1);
    });

    it('should pass multiple parameters into the other context', () => {
      const callable1 = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test2');
      const test2instance = new SimpleCallbackInTest1();

      setExecutionContext('test1');
      new SimpleCallbackInTest1(callable1);  // tslint:disable-line:no-unused-expression

      test2instance.directCallMe('test', {property: 'value'}, ['array']);

      expect(callable1).toHaveBeenCalledWith('test', {property: 'value'}, ['array']);
    });

    it('should return data from other context', async () => {
      setExecutionContext('test2');
      const test2instance = new SimpleCallbackInTest1();

      setExecutionContext('test1');
      new SimpleCallbackInTest1(async () => ({property: 'value'})); // tslint:disable-line:no-unused-expression

      const received = await test2instance.directCallMe();

      expect(received).toEqual({property: 'value'});
    });

    it('should return the correct data from the correct method/class', async () => {

      @AsynchronousCallable()
      class Class1 {
        @executeInCorrectContext('test1')
        public method(): Promise<{}> {
          return Promise.resolve('class1Result');
        }
      }

      @AsynchronousCallable()
      class Class2 {
        @executeInCorrectContext('test2')
        public method(): Promise<{}> {
          return Promise.resolve('class2Result');
        }

        @executeInCorrectContext('test1')
        public otherMethod(): Promise<{}> {
          return Promise.resolve('class2OtherResult');
        }
      }

      setExecutionContext('test1');
      const test1instance1 = new Class1();
      const test1instance2 = new Class2();

      setExecutionContext('test2');
      const test2instance1 = new Class1();
      const test2instance2 = new Class2();

      expect(await test1instance1.method()).toBe('class1Result');
      expect(await test1instance2.method()).toBe('class2Result');
      expect(await test1instance2.otherMethod()).toBe('class2OtherResult');
      expect(await test2instance1.method()).toBe('class1Result');
      expect(await test2instance2.method()).toBe('class2Result');
      expect(await test2instance2.otherMethod()).toBe('class2OtherResult');
    });
  });

  describe('wrong initialisation', () => {
    it('fails Promise when @executeInCorrectContext method is called non-@AsynchronousCallable class', async () => {

      class TestClass {
        @executeInCorrectContext('test1')
        public directCallMe(): Promise<{}> {
          return Promise.resolve({});
        }
      }

      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      setExecutionContext('test1');

      const instance = new TestClass();
      try {
        await instance.directCallMe();
      } catch (reason) {
        callable();
      }

      expect(callable).toHaveBeenCalled();

    });

    it('throws an error when @AsynchronousCallable class is instantiated without setting Context first', () => {
      @AsynchronousCallable()
      class TestClass {
      }

      const callable = jest.fn().mockReturnValue(Promise.resolve({}));

      try {
        new TestClass(); // tslint:disable-line:no-unused-expression
      } catch (reason) {
        callable();
      }

      expect(callable).toHaveBeenCalled();
    });
  });

  describe('AsynchronousCallableServiceFactory', () => {
    it('creates a wrapped instance of a class with correct constructor parameters', () => {
      class Test {
        public constructor(public param1: string, public param2: string) {// tslint:disable-line:no-parameter-properties
        }
      }
      setExecutionContext('test1');

      const instance = AsynchronousCallableServiceFactory(Test)('a', 'b');
      expect(instance).toBeInstanceOf(Test);
      if (instance instanceof Test) {
        expect(instance.constructor.name).toBe('AsynchronousCallableWrapped');
        expect(instance.param1).toEqual('a');
        expect(instance.param2).toEqual('b');
      }
    });
  });
});
