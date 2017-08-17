import {Extension, ListEntry, RegisterEntryCallback} from "./Extension";

export class PassExtension extends Extension {
    public name = 'Base';
    public actions = ['show'];

    public initializeList(registerEntryCallback: RegisterEntryCallback): void {
        for (const label of [
            'example.org/user',
            'example.com/username',
        ]) {
            registerEntryCallback({
                label,
                actions: this.actions,
                metadata: {},
            });
        }
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
