import {passB} from "ConfiguredPassB";
import {List, ListItem, ListItemText} from 'material-ui';
import {Entry, LabeledEntries} from "PassB";
import * as React from 'react';
import Tab = browser.tabs.Tab;

interface Props {
  url: string;
  navigateTo: (newUrl: string, state: {}) => void;
}

interface State {
  entries: Entry[];
  filtered: Entry[];
}

export class ListView extends React.Component<Props, State> {
  public state: State = {
    entries: [],
    filtered: [],
  };

  public componentDidMount(): void {
    console.time('get items');
    passB.getEntries()
      .then((entries: LabeledEntries) =>
        this.setState({entries: Object.values(entries)}, () => this.recalculateFilteredEntries()),
      );
  }

  public render(): JSX.Element {
    const {navigateTo} = this.props;
    const {filtered} = this.state;

    return (
      <List>
        {filtered && filtered.map((entry: Entry) => (
          <ListItem
            button={true}
            key={entry.label}
            onClick={() => navigateTo(`entry`, {entry})}
          >
            <ListItemText primary={entry.label.replace(/\//g, "/\u200b")}/>
          </ListItem>
        ))}
      </List>
    );
  }

  private async recalculateFilteredEntries(): Promise<void> {
    if (!this.props.url || !this.state.entries) {
      return;
    }
    (await (passB.getMatcher()))
      .filterEntries(this.props.url || '', this.state.entries)
      .then((filtered: Entry[]) => this.setState({filtered}));
  }
}
