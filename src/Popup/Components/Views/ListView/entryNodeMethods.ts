import {OrderedMap} from 'immutable';
import {EntryNode} from 'State/PassEntries/Interfaces';

export function flattenEntryNode(currentNode: EntryNode, flattened: EntryNode[] = []): EntryNode[] {
  flattened.push(currentNode);
  currentNode.get('children').forEach((item: EntryNode) => flattenEntryNode(item, flattened));

  return flattened;
}

export function deepFilterEntryNodes(node: EntryNode, filteredNodes: EntryNode[]): EntryNode {
  const nodeFullNames = filteredNodes.map((filtered: EntryNode) => filtered.get('fullPath'));
  return node.update(
    'children',
    (origChildren: OrderedMap<string, EntryNode>) =>
      origChildren
        .map((child: EntryNode) => deepFilterEntryNodes(child, filteredNodes))
        .filter((child: EntryNode) => nodeFullNames.includes(child.get('fullPath')) || child.get('children').count() > 0),
  );
}
