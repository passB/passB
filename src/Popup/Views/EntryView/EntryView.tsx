import {passB} from "ConfiguredPassB";
import {Menu, MenuItem, Subheader} from "material-ui";
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
    <Menu autoWidth={false} width={400} maxHeight={400}>
      <Subheader>{entry.label}</Subheader >
      {Object.values(entry.actions).map((action: Action) => (
        <MenuItem
          key={`${action.extension}/${action.action}`}
          onClick={() =>
            passB.getExtension(action.extension).executeAction(
              action.action,
              entry.label,
              {navigateTo: (newUrl: string, state: {}) => history.push(newUrl, state)},
            )
          }
          primaryText={browser.i18n.getMessage(passB.getExtension(action.extension).getLabelForAction(action.action))}
        />
      ))}
    </Menu>
  </div>
);
