import {readFileSync} from 'fs';

const translations = JSON.parse(readFileSync(`${__dirname}/../../extension/_locales/en/messages.json`).toString());

// build 'skeleton' browser object so that test can override properties with the base objects being present
(global as any).browser = { // tslint:disable-line:no-any
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    reload: jest.fn(),
  },
  tabs: {
    executeScript: jest.fn(),
    getCurrent: jest.fn(() => Promise.resolve()),
    query: jest.fn(() => Promise.resolve([{url: ''}])),
  },
  storage: {
    onChanged: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve()),
      remove: jest.fn(() => Promise.resolve()),
      addListener: jest.fn(),
    },
  },
  i18n: {
    getMessage: jest.fn((orig: string) => {
      if (!translations || !translations[orig] || !translations[orig].message) {
        return;
      }
      return translations[orig].message;
    }),
  },
};

expect.extend({
  toEqualImmutable(received: Equalable, argument: Equalable): ({ pass: boolean; message(): string }) {
    const pass = received.equals(argument);
    if (pass) {
      return {
        message: () => (
          `expected ${received} not to be equal to ${argument}`
        ),
        pass: true,
      };
    } else {
      return {
        message: () => (`expected ${received} to be equal to ${argument}`),
        pass: false,
      };
    }
  },
});
