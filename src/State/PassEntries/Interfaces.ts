import {List, Map, OrderedMap} from 'immutable';
import {ActionName, ExtensionName} from 'State/Interfaces';
import {TypedMap} from 'State/Types/TypedMap';

export interface ActionInterface {
  extension: ExtensionName;
  action: ActionName;
}
export type Action = TypedMap<ActionInterface>;

type EntryName = string;

export interface EntryNodeInterface {
  name: EntryName;
  fullPath: string;
  actions: List<Action>;
  children: OrderedMap<string, EntryNode>;
}

export type EntryNode = TypedMap<EntryNodeInterface>;

export interface ExtensionNameArgs {
  extensionName: ExtensionName;
}

export interface EntryAction {
  fullPath: string;
  action: ActionName;
}

export interface ExtensionEntriesArgs {
  extensionName: ExtensionName;
  entries: EntryAction[];
}

export type PassEntryState = Map<ExtensionName, EntryNode>;
