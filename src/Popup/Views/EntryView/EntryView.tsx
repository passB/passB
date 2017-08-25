import {passB} from "ConfiguredPassB";
import {Action, Entry} from 'PassB';
import * as React from 'react';

interface Props {
  entry: Entry;
  navigateTo: (newUrl: string, state: {}) => void;
}

export const EntryView = ({entry, navigateTo}: Props) => (
  <div>
    <h2>{entry.label}</h2>
    <div>
      {Object.values(entry.actions).map((action: Action) => (
        <div
          key={`${action.extension}/${action.action}`}
          onClick={() =>
            passB.getExtension(action.extension).executeAction(action.action, entry.label, {navigateTo})
          }
        >
          {passB.getExtension(action.extension).getLabelForAction(action.action)}
        </div>
      ))}
    </div>
  </div>
);
