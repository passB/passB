// build 'skeleton' browser object so that test can override properties with the base objects being present
(global as any).browser = { // tslint:disable-line:no-any
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
  tabs: {
    executeScript: jest.fn(),
    getCurrent: jest.fn(() => Promise.resolve()),
  },
  storage: {
    onChanged: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve()),
      remove: jest.fn(() => Promise.resolve()),
      addListener: jest.fn(),
    },
  },
};

// tslint:disable:no-var-requires
// prevent side-effect imports
// usually importing one of these would register all their implementations as tagged services
jest.setMock('Extensions', require('Extensions/Extension'));
jest.setMock('PluggableStrategies/FileFormats', require('PluggableStrategies/FileFormats/FileFormat'));
jest.setMock('PluggableStrategies/Fillers', require('PluggableStrategies/Fillers/Filler'));
jest.setMock('PluggableStrategies/Matchers', require('PluggableStrategies/Matchers/Matcher'));
