import {List, ListItem, ListItemText, ListSubheader} from "material-ui";
import {Action, Entry, PassB} from 'PassB';
import * as React from 'react';
import {RouteComponentProps} from "react-router";
import {LazyInject} from "../../../Decorators/LazyInject";

interface LocationStateProps {
  location: {
    state: {
      entry: Entry;
    };
  };
}

export class EntryView extends React.Component<RouteComponentProps<{}> & LocationStateProps> {
  @LazyInject(() => PassB)
  private passB: PassB;

  public render(): JSX.Element {
    const {location: {state: {entry}}, history} = this.props;
    return (
      <div>
        <List subheader={<ListSubheader>{entry.label}</ListSubheader>}>
          {Object.values(entry.actions).map((action: Action) => (
            <ListItem
              button={true}
              key={`${action.extension}/${action.action}`}
              onClick={() =>
                this.passB.getExtension(action.extension).executeAction(
                  action.action,
                  entry.label,
                  {navigateTo: (newUrl: string, state: {}) => history.push(newUrl, state)},
                )
              }
            >
              <ListItemText
                primary={
                  browser.i18n.getMessage(this.passB.getExtension(action.extension).getLabelForAction(action.action))
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}