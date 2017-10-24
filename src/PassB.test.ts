// tslint:disable:no-var-requires max-classes-per-file

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

  describe('extension behaviour', () => {

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
