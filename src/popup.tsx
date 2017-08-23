import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;
import {passB} from "./ConfiguredPassB";
import {Entry, LabeledEntries} from "./PassB";

interface State {
  activeTab?: Tab;
  entries: Entry[];
  filtered: Entry[];
}

class Popup extends React.Component<{}, State> {
  public state: State = {
    entries: [],
    filtered: [],
  };

  public componentDidMount() {
    browser.tabs.query({
      active: true,
      currentWindow: true,
    }).then((tabs: Tab[]) => this.setState({activeTab: tabs[0]}, () => this.recalculateFilteredEntries()));
    passB.getEntries()
      .then((entries: LabeledEntries) =>
        this.setState({entries: Object.values(entries)}, () => this.recalculateFilteredEntries()),
      );
  }

  public render() {
    const {activeTab, filtered} = this.state;

    return (
      <div>
        <h1>PassB</h1>
        <div>
          <ul>
            {activeTab
            && <li>You are currently on {activeTab.url}</li>
            || <li>Could not determine active tab.</li>
            }
            {filtered && filtered.map((entry: Entry) => <li key={entry.label}>{entry.label}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  private recalculateFilteredEntries() {
    if (!this.state.activeTab || !this.state.entries) {
      return;
    }
    passB.getMatcher()
      .filterEntries(this.state.activeTab.url || '', this.state.entries)
      .then((filtered: Entry[]) => this.setState({filtered}));
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
