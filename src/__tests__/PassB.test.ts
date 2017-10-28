// tslint:disable:no-var-requires max-classes-per-file
import {PassB as PassBType} from 'PassB';
import {Extension} from '../Extensions/Extension';
import {BaseStrategy} from '../PluggableStrategies/BaseStrategy';

/**
 * prevent side-effect imports
 * usually importing one of these would register all their implementations as tagged services
 */
function mockPreventSideEffects(): void {
  jest.setMock('Extensions', require('Extensions/Extension'));
  jest.setMock('PluggableStrategies/FileFormats', require('PluggableStrategies/FileFormats/FileFormat'));
  jest.setMock('PluggableStrategies/Fillers', require('PluggableStrategies/Fillers/Filler'));
  jest.setMock('PluggableStrategies/Matchers', require('PluggableStrategies/Matchers/Matcher'));
}

describe('PassB', () => {
  let {Container} = require('typedi');
  let {PassB} = require('PassB');
  let {setExecutionContext} = require('Decorators/ExecuteInContext');

  beforeEach(() => {
    jest.resetModules();
    setExecutionContext = require('Decorators/ExecuteInContext').setExecutionContext;
    Container = require('typedi').Container;
    PassB = require('PassB').PassB;
  });

  describe('tagged injections', () => {
    let passB: PassBType;
    beforeAll(() => {
      setExecutionContext('test1');
      passB = Container.get(PassB);
    });

    const mapToClassName = (item: BaseStrategy<{}> | Extension<{}>) => item.name;

    it('receives Extensions', () => {
      expect(passB.getAllExtensions().map(mapToClassName)).toMatchSnapshot();
    });

    it('receives FileFormats', () => {
      expect(passB.getAllFileFormats().map(mapToClassName)).toMatchSnapshot();
    });

    it('receives Fillers', () => {
      expect(passB.getAllFillers().map(mapToClassName)).toMatchSnapshot();
    });

    it('receives Matchers', () => {
      expect(passB.getAllMatchers().map(mapToClassName)).toMatchSnapshot();
    });
  });

  describe('extension behaviour', () => {
    beforeAll(mockPreventSideEffects);

    describe('extension injection', () => {

      it('receives extensions via the ExtensionTag', () => {
        const {Service} = require('typedi');
        const {ExtensionTag} = require('Extensions');

        @Service({tags: [ExtensionTag]})
        class Extension1 {
        }

        @Service({tags: [ExtensionTag]})
        class Extension2 {
        }

        setExecutionContext('background');
        const passB = Container.get(PassB);

        expect(passB.getAllExtensions().some((item: {}) => item instanceof Extension1)).toBeTruthy();
        expect(passB.getAllExtensions().some((item: {}) => item instanceof Extension2)).toBeTruthy();
        expect(passB.getAllExtensions().length).toBe(2);
      });

      it('receives FileFormats wia the FileFormatTag');
      it('receives Fillers wia the FillerTag');
      it('receives Matchers wia the MatcherTag');

    });

    it('validates that all extensions and strategies are of correct type at initialization');

    describe('injection of options', () => {
      //
    });
  });

  describe('context-specific behaviour', () => {
    it('injects options into children at initialize in any context');
    it('only starts loading entries in background context');
  });

  describe('loading on entries', () => {
    it('only triggers initializeList on enabled extensions');
    it('does not execute two extensions\' initializeList at the same time');
    it('waits for all extensions\' initializeList to finish');
    describe('builds a correct tree from the returned entries', () => {
      //
    });
  });
});
