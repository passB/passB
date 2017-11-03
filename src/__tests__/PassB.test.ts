// tslint:disable:no-var-requires max-classes-per-file
import {injectable} from 'inversify';
import {executionContext} from 'Constants';
import {container, Symbols} from 'Container';
import {setExecutionContext} from 'Decorators/ExecuteInContext';
import {PassB} from 'PassB';

describe('PassB', () => {
  beforeEach(() => {
    setExecutionContext('test1');
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  describe('construction', () => {
    it('triggers instantiation of all bound extensions and strategies', () => {
      const spies: jest.Mock[] = [];

      function getMockClass(): any { // tslint:disable-line:no-any
        const spy = jest.fn();
        spies.push(spy);
        return injectable()(class {
          public constructor() {
            spy();
          }
        });
      }

      container.rebind(Symbols.Extension).to(getMockClass());
      container.bind(Symbols.Extension).to(getMockClass());
      container.rebind(Symbols.FileFormat).to(getMockClass());
      container.bind(Symbols.FileFormat).to(getMockClass());
      container.rebind(Symbols.Filler).to(getMockClass());
      container.bind(Symbols.Filler).to(getMockClass());
      container.rebind(Symbols.Matcher).to(getMockClass());
      container.bind(Symbols.Matcher).to(getMockClass());

      expect(spies.length).toBe(8);

      container.resolve(PassB);

      for (const spy of spies) {
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('getter methods', () => {
    describe('getAllExtensions', () => {
      it('receives extensions from the container', () => {
        container.unbind(Symbols.Extension);
        container.bind(Symbols.Extension).toConstantValue('testExtension1');
        container.bind(Symbols.Extension).toConstantValue('testExtension2');

        expect(container.resolve(PassB).getAllExtensions()).toEqual(['testExtension1', 'testExtension2']);
      });
    });

    describe('getExtension', () => {
      it('returns Extension by name');
    });

    describe('getEnabledExtensions', () => {
      it('returns all enabled Extensions');
    });

    describe('getAllFileFormats', () => {
      it('receives FileFormats from the container', () => {
        container.unbind(Symbols.FileFormat);
        container.bind(Symbols.FileFormat).toConstantValue('testStrategy1');
        container.bind(Symbols.FileFormat).toConstantValue('testStrategy2');

        expect(container.resolve(PassB).getAllFileFormats()).toEqual(['testStrategy1', 'testStrategy2']);
      });
    });

    describe('getFileFormat', () => {
      it('returns selected FileFormat');
      it('returns first FileFormat when there is not selected FileFormat');
    });

    describe('getAllFillers', () => {
      it('receives Fillers from the container', () => {
        container.unbind(Symbols.Filler);
        container.bind(Symbols.Filler).toConstantValue('testStrategy1');
        container.bind(Symbols.Filler).toConstantValue('testStrategy2');

        expect(container.resolve(PassB).getAllFillers()).toEqual(['testStrategy1', 'testStrategy2']);
      });
    });

    describe('getFiller', () => {
      it('returns selected Filler');
      it('returns first Filler when there is not selected Filler');
    });

    describe('getAllMatchers', () => {
      it('receives Matchers from the container', () => {
        container.unbind(Symbols.Matcher);
        container.bind(Symbols.Matcher).toConstantValue('testStrategy1');
        container.bind(Symbols.Matcher).toConstantValue('testStrategy2');

        expect(container.resolve(PassB).getAllMatchers()).toEqual(['testStrategy1', 'testStrategy2']);
      });
    });

    describe('getMatcher', () => {
      it('returns selected Matcher');
      it('returns first Matcher when there is not selected Matcher');
    });
  });

  describe('reloadEntries', () => {
    it('triggers initializeList on enabled extensions');
    it('waits for all extensions\' initializeList to finish');
  });

  describe('reloadExtension', () => {
    it('triggers a browser extension reload', () => {
      setExecutionContext(executionContext.background);
      container.rebind(Symbols.Extension).toConstantValue('dummy');
      container.rebind(Symbols.Filler).toConstantValue('dummy');
      container.rebind(Symbols.FileFormat).toConstantValue('dummy');
      container.rebind(Symbols.Matcher).toConstantValue('dummy');

      expect(browser.runtime.reload).not.toHaveBeenCalled();
      container.resolve(PassB).reloadExtension();
      expect(browser.runtime.reload).toHaveBeenCalled();
    });
  });
});
