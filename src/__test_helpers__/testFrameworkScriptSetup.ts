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
