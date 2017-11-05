// tslint:disable:no-unused-expression max-classes-per-file
import {injectable} from 'inversify';
import {RouteProps} from 'react-router';
import {Store} from 'redux';
import {getMockStore} from '__test_helpers__/getMockStore';
import {container, Symbols} from 'Container';
import {Extension} from 'Extensions/Extension';
import {ExecutionOptions} from 'InjectableInterfaces/Extension';
import {OptionsPanelType} from 'InjectableInterfaces/OptionsPanel';
import {StoreContents} from 'InjectableInterfaces/State';
import {setExtensionOptions} from 'State/Options/Actions';
import {createTypedMap, TypedMap} from 'State/Types/TypedMap';

@injectable()
class TestExtension extends Extension<{}> {
  public routes: RouteProps[] = [];
  public OptionsPanel: OptionsPanelType<{}>;
  public actions: string[];

  public constructor() {
    super('testExtension', createTypedMap({defaultOption1: 'value1'}));
  }

  public initializeList(): Promise<void> {
    return Promise.resolve();
  }

  public getLabelForAction(action: string): string {
    return '';
  }

  public executeAction(action: string, entry: string, options: ExecutionOptions): void {
    return;
  }
}

describe('Extension base class', () => {
  let store: Store<StoreContents>;
  let state: { getStore: jest.Mock<Store<StoreContents>> };

  beforeAll(() => {
    state = {getStore: jest.fn((): Store<StoreContents> => store)};
    container.rebind(Symbols.State).toConstantValue(state);
  });

  beforeEach(() => {
    state.getStore = jest.fn((): Store<StoreContents> => store);
    store = getMockStore();
  });

  describe('onOptionsUpdate method', () => {
    it('should be triggered when options change', () => {
      const triggered = jest.fn();

      const extension = container.resolve(class extends TestExtension {
        public onOptionsUpdate(lastOptions: TypedMap<{}>): void {
          super.onOptionsUpdate(lastOptions);
          triggered(lastOptions);
        }
      });
      expect(triggered).not.toHaveBeenCalled();

      store.dispatch(setExtensionOptions({extensionName: extension.name, options: createTypedMap({foo: 'bar'})}));
      expect(triggered).toHaveBeenCalledTimes(1);

      store.dispatch(setExtensionOptions({extensionName: extension.name, options: createTypedMap({foo: 'baz'})}));
      expect(triggered).toHaveBeenCalledTimes(2);

      expect(triggered.mock.calls).toMatchSnapshot();
    });
  });
  describe('setEntries method', () => {
    it('should dispatch setEntries Action', () => {
      const extension = container.resolve(TestExtension);
      const spy = jest.spyOn(store, 'dispatch');

      (extension as any) // tslint:disable-line:no-any
        .setEntries([{
          fullPath: 'foo/bar',
          action: 'test',
        }]);

      expect(spy.mock.calls).toMatchSnapshot();
    });
  });

  describe('options property', () => {
    it('should contain default options', () => {
      const defaultOptions = createTypedMap({foo: 'bar'});

      const extension = container.resolve(TestExtension);
      Object.defineProperty(extension, 'defaultOptions', {value: defaultOptions});

      expect(
        (extension as any).options, // tslint:disable-line:no-any
      ).toEqualImmutable(defaultOptions);
    });

    it('should contain a merge of default and explicitly set options', () => {
      const defaultOptions = createTypedMap({foo: 'bar'});
      const explicitOptions = createTypedMap({snafu: 'baz'});

      store = getMockStore();
      store.dispatch(setExtensionOptions({extensionName: 'testExtension', options: explicitOptions}));

      const extension = container.resolve(TestExtension);
      Object.defineProperty(extension, 'defaultOptions', {value: defaultOptions});

      expect(
        (extension as any).options, // tslint:disable-line:no-any
      ).toEqualImmutable(defaultOptions.merge(explicitOptions));
    });
  });
});
