import {injectable} from 'inversify';
import {Interfaces} from 'Container';

type ChangeCallback = (changes: browser.storage.ChangeDict, areaName: browser.storage.StorageName) => void;

@injectable()
export class BrowserStorageAdapter implements Interfaces.StorageAdaper {
  public async getItem<T extends {}>(key: string): Promise<T> {
    return (await browser.storage.local.get(key))[key];
  }

  public setItem<T extends {}>(key: string, item: T): Promise<void> {
    return browser.storage.local.set({[key]: item});
  }

  public removeItem(key: string): Promise<void> {
    return browser.storage.local.remove(key);
  }

  public addListener(callback: ChangeCallback): void {
    return browser.storage.onChanged.addListener(callback);
  }
}
