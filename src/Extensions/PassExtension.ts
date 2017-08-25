import {PassCli} from "../PassCli";
import {ExecutionOptions, Extension, ListEntry, RegisterEntryCallback} from "./Extension";
import {passB} from "../ConfiguredPassB";

export class PassExtension extends Extension {
  public name = 'Base';
  public actions = ['show'];

  public async initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void> {
    for (const label of await PassCli.list()) {
      registerEntryCallback({
        label,
        actions: this.actions,
      });
    }
  }

  public getLabelForAction(action: string) {
    switch (action) {
      case 'show':
        return 'extension_pass_action_show';
      default:
        return '';
    }
  }

  public executeAction(action: string, entry: string, {navigateTo}: ExecutionOptions): void {
    switch (action) {
      case 'show':
        PassCli.show(entry).then((contents: string[]) => alert(contents.join("\n")));
        break;
      default:
        console.error('unknown action:', action);
    }
  }
}
