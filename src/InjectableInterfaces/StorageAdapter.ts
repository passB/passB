export interface StorageAdaper {
  getItem: <T extends {}>(key: string) => Promise<T>;
  setItem: <T extends {}>(key: string, item: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  addListener: typeof browser.storage.onChanged.addListener;
}
