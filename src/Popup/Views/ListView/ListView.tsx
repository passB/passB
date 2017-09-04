import {passB} from "ConfiguredPassB";
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
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
    passB.getEntries()
      .then((entries: LabeledEntries) =>
        this.setState({entries: Object.values(entries)}, () => this.recalculateFilteredEntries()),
      );
  }

  public render(): JSX.Element {
    const {navigateTo} = this.props;
    const {filtered} = this.state;

    return (
      <Menu autoWidth={false} width={400} maxHeight={400}>
        {filtered && filtered.map((entry: Entry) => (
          <MenuItem
            key={entry.label}
            onClick={() => navigateTo(`entry`, {entry})}
            primaryText={entry.label.replace(/\//g, "/\u200b")}
          />
        ))}
      </Menu>
    );
  }

  private recalculateFilteredEntries(): void {
    if (!this.props.url || !this.state.entries) {
      return;
    }
    passB.getMatcher()
      .filterEntries(this.props.url || '', this.state.entries)
      .then((filtered: Entry[]) => this.setState({filtered}));
  }
}
