import {getMockStore} from '__test_helpers__/getMockStore';
import {container, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassExtension} from 'Extensions/PassExtension/PassExtension';
import {Extension} from 'InjectableInterfaces';
import {executionContext} from '../../../Constants';

describe('PassExtension', () => {
  beforeEach(() => {
    setExecutionContext('test');
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('is bound as Symbols.Extension', () => {
    expect(
      container.getAll(Symbols.Extension)
        .some((extension: Extension<{}>) => extension instanceof PassExtension),
    ).toBeTruthy();
  });

  it('is named "Pass"', () => {
    expect(container.resolve(PassExtension).name).toBe('Pass');
  });

  it('has translated labels for all actions', () => {
    const extension = container.resolve(PassExtension);
    for (const action of extension.actions) {
      const label = extension.getLabelForAction(action);
      expect(label).not.toBeUndefined();
      expect(browser.i18n.getMessage(label!)).not.toBeUndefined();
    }
  });

  describe('initializeList method', () => {
    beforeEach(() => {
      container.rebind(Symbols.State).toConstantValue({getStore: jest.fn(getMockStore)});
    });

    it('calls PassCli.list', async () => {
      const list = jest.fn(() => Promise.resolve([]));
      container.rebind(Symbols.PassCli).toConstantValue({list});
      await container.resolve(PassExtension).initializeList();
      expect(list).toHaveBeenCalled();
    });

    it('registers actions only on files, not on folders', async () => {
      const list = jest.fn(() => Promise.resolve([
        'folder/', 'sub/folder/', 'file', 'sub/file',
      ]));
      container.rebind(Symbols.PassCli).toConstantValue({list});
      const extension = container.resolve(PassExtension);

      const spy = jest.spyOn(extension as any, 'setEntries'); // tslint:disable-line:no-any

      await extension.initializeList();

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls).toMatchSnapshot();
    });
  });

  describe('actions', () => {
    describe('show', () => {
      it('starts navigation to /extension/Pass/Show with entry name as parameter', () => {
        const navigateTo = jest.fn();
        container.resolve(PassExtension).executeAction('show', 'my/test/entry', {navigateTo});
        expect(navigateTo).toHaveBeenCalledTimes(1);
        expect(navigateTo.mock.calls[0]).toEqual(['/extension/Pass/Show', {entry: 'my/test/entry'}]);
      });
    });

    describe('fill', () => {
      let tabSpy: jest.Mock<Promise<[{url: string}]>>;
      let passCli: { show: jest.Mock<Promise<string[]>> };
      let fileFormat: { getUsername: jest.Mock<string>; getPassword: jest.Mock<string> };
      let filler: { fillUsername: jest.Mock<Promise<void>>; fillPassword: jest.Mock<Promise<void>> };

      beforeEach(() => {
        tabSpy = ((global as any).browser.tabs.query as jest.Mock<Promise<[{url: string}]>>); // tslint:disable-line:no-any
        tabSpy.mockReset();
        tabSpy.mockReturnValue(Promise.resolve([{url: 'https://example.com'}]));

        passCli = {show: jest.fn(() => Promise.resolve(['firstLine', 'secondLine']))};
        container.rebind(Symbols.PassCli).toConstantValue(passCli);

        fileFormat = {getUsername: jest.fn(() => 'user'), getPassword: jest.fn(() => 'pass')};
        filler = {fillPassword: jest.fn(() => Promise.resolve()), fillUsername: jest.fn(() => Promise.resolve())};
        container.rebind(Symbols.PassB).toConstantValue({
          getFileFormat: () => fileFormat,
          getFiller: () => filler,
        });
      });

      it('calls executeAction and then closes the window', () => {
        const instance = container.resolve(PassExtension);
        const executeFillActionSpy = jest.spyOn(instance as any, 'executeFillAction'); // tslint:disable-line:no-any
        const windowCloseSpy = jest.spyOn(window, 'close');

        instance.executeAction('fill', 'my/test/entry', {navigateTo: jest.fn()});
        expect(executeFillActionSpy).toHaveBeenCalledWith('my/test/entry');
        expect(windowCloseSpy).toHaveBeenCalled();
      });

      it('normal filling', async () => {
        setExecutionContext(executionContext.background);
        await (container.resolve(PassExtension) as any).executeFillAction('my/test/entry'); // tslint:disable-line:no-any

        expect(tabSpy).toHaveBeenCalledTimes(2);
        expect(passCli.show).toHaveBeenCalledWith('my/test/entry');
        expect(fileFormat.getPassword).toHaveBeenCalledWith(['firstLine', 'secondLine'], 'my/test/entry');
        expect(fileFormat.getUsername).toHaveBeenCalledWith(['firstLine', 'secondLine'], 'my/test/entry');
        expect(filler.fillUsername).toHaveBeenCalledWith({url: 'https://example.com'}, 'user');
        expect(filler.fillPassword).toHaveBeenCalledWith({url: 'https://example.com'}, 'pass');
      });

      it('does not fill when url changes while pass contents are received', async () => {
        setExecutionContext(executionContext.background);

        tabSpy
          .mockReturnValueOnce(Promise.resolve([{url: 'https://example.com'}]))
          .mockReturnValueOnce(Promise.resolve([{url: 'https://example.com/attack'}]))
        ;

        const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => 0);

        await (container.resolve(PassExtension) as any).executeFillAction('my/test/entry'); // tslint:disable-line:no-any

        expect(spy).toHaveBeenCalled();

        expect(tabSpy).toHaveBeenCalledTimes(2);
        expect(passCli.show).toHaveBeenCalledWith('my/test/entry');
        expect(fileFormat.getPassword).not.toHaveBeenCalled();
        expect(fileFormat.getUsername).not.toHaveBeenCalled();
        expect(filler.fillUsername).not.toHaveBeenCalled();
        expect(filler.fillPassword).not.toHaveBeenCalled();
      });
    });
  });
});
