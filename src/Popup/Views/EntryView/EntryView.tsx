import {passB} from "ConfiguredPassB";
import {Action, Entry} from 'PassB';
import * as React from 'react';
import {RouteComponentProps} from "react-router";

interface LocationStateProps {
  location: {
    state: {
      entry: Entry;
    };
  };
}

export const EntryView = ({location: {state: {entry}}, history}: RouteComponentProps<{}> & LocationStateProps) => (
  <div>
    <h2>{entry.label}</h2>
    <div>
      {Object.values(entry.actions).map((action: Action) => (
        <div
          key={`${action.extension}/${action.action}`}
          onClick={() =>
            passB.getExtension(action.extension).executeAction(
              action.action,
              entry.label,
              {navigateTo: (newUrl: string, state: {}) => history.push(newUrl, state)},
            )
          }
        >
          {passB.getExtension(action.extension).getLabelForAction(action.action)}
        </div>
      ))}
    </div>
  </div>
);
