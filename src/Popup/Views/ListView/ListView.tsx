import {passB} from "ConfiguredPassB";
import {Entry, LabeledEntries} from "PassB";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;

import {ListEntry} from './ListEntry';
import "./style.scss";

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

  public componentDidMount() {
    passB.getEntries()
      .then((entries: LabeledEntries) =>
        this.setState({entries: Object.values(entries)}, () => this.recalculateFilteredEntries()),
      );
  }

  public render() {
    const {navigateTo} = this.props;
    const {filtered} = this.state;

    return (
      <div>
        <div id="entry-list">
          {filtered && filtered.map((entry: Entry) => (
            <ListEntry
              key={entry.label}
              entry={entry}
              onClick={(selectedEntry: Entry) => navigateTo(`entry`, {entry: selectedEntry})}/>
          ))}
        </div>
      </div>
    );
  }

  private recalculateFilteredEntries() {
    if (!this.props.url || !this.state.entries) {
      return;
    }
    passB.getMatcher()
      .filterEntries(this.props.url || '', this.state.entries)
      .then((filtered: Entry[]) => this.setState({filtered}));
  }
}
