// tslint:disable:no-var-requires
// prevent side-effect imports
// usually importing one of these would register all their implementations as tagged services
jest.setMock('Extensions', require('Extensions/Extension'));
jest.setMock('PluggableStrategies/FileFormats', require('PluggableStrategies/FileFormats/FileFormat'));
jest.setMock('PluggableStrategies/Fillers', require('PluggableStrategies/Fillers/Filler'));
jest.setMock('PluggableStrategies/Matchers', require('PluggableStrategies/Matchers/Matcher'));

// build 'skeleton' browser object so that test can override properties with the base objects being present
(global as any).browser = { // tslint:disable-line:no-any
  runtime: {
    sendMessage: () => 0,
    onMessage: {
      addListener: () => 0,
    },
  },
  tabs: {
    executeScript: () => 0,
  },
};
