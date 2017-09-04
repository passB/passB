import Tab = browser.tabs.Tab;
export abstract class Filler {
  public abstract fillUsername(activeTab: Tab, username?: string): Promise<void>;
  public abstract fillPassword(activeTab: Tab, password?: string): Promise<void>;
}
