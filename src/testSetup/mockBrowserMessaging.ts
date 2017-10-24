export function mockBrowserMessaging(): { resetListeners: () => void } {
  const foreverPendingPromise = Promise.race([]);
  type Listener = (request: {}) => Promise<{}>;

  let listeners: Listener[] = [];
  afterEach(() => listeners = []);

  browser.runtime.onMessage.addListener = (listener: Listener) => listeners.push(listener);
  browser.runtime.sendMessage = (message: {}) => Promise.race(
    listeners.map((listener: Listener) => listener(message) || foreverPendingPromise),
  );

  return {
    resetListeners: () => listeners = [],
  };
}
