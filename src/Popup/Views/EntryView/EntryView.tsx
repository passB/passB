import {passB} from "ConfiguredPassB";
import {List, ListItem, ListItemText, ListSubheader} from "material-ui";
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
    <List subheader={<ListSubheader>{entry.label}</ListSubheader>}>
      {Object.values(entry.actions).map((action: Action) => (
        <ListItem
          button={true}
          key={`${action.extension}/${action.action}`}
          onClick={() =>
            passB.getExtension(action.extension).executeAction(
              action.action,
              entry.label,
              {navigateTo: (newUrl: string, state: {}) => history.push(newUrl, state)},
            )
          }
        >
          <ListItemText
            primary={browser.i18n.getMessage(passB.getExtension(action.extension).getLabelForAction(action.action))}
          />
        </ListItem>
      ))}
    </List>
  </div>
);
