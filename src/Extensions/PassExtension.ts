import {PassCli} from "../PassCli";
import {Extension, ListEntry, RegisterEntryCallback} from "./Extension";

export class PassExtension extends Extension {
  public name = 'Base';
  public actions = ['show'];

  public async initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void> {
    for (const label of await PassCli.list()) {
      registerEntryCallback({
        label,
        actions: this.actions,
        metadata: {},
      });
    }
    return void 0;
  }

  public executeAction(action: string, entry: ListEntry): void {
    switch (action) {
      case 'show':
        break;
      default:
        console.error('unknown action:', action);
    }
  }
}
