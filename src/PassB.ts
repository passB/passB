import deepExtend = require( "deep-extend");
import {ActionMetaData, Extension, ListEntry as ExtensionListEntry} from "./Extensions/Extension";

interface Options {
    extensions: Extension[];
}

interface Action {
    extension: string;
    action: string;
}

interface AvailableActions {
    [action: string]: ActionMetaData;
}

interface ListEntry {
    availableActions: AvailableActions;
}

export class PassB {
    private readonly options: Options;

    private entries: { [label: string]: ListEntry } = {};

    public constructor(options: Options) {
        this.options = options;
    }

    public async initialize() {
        this.entries = {};
        for (const extension of this.options.extensions) {
            extension.initializeList((entry) => this.registerListEntry(extension.name, entry));
        }
    }

    public registerListEntry(extensionName: string, entry: ExtensionListEntry) {
        const combinedEntries = entry.actions.reduce((flattened: AvailableActions, action: string) => ({
            ...flattened,
            [`${extensionName}/${action}`]: {
                extension: extensionName,
                action,
            },
        }), {});

        deepExtend(this.entries, {[entry.label]: combinedEntries});

        console.log(this.entries);
    }
}
