import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;
import {passB} from "./ConfiguredPassB";
import {Entry, LabeledEntries} from "./PassB";

interface State {
  activeTab?: Tab;
  entries: LabeledEntries;
}

class Popup extends React.Component<{}, State> {
  public state: State = {
    entries: [],
  };

  public async componentDidMount() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    this.setState({activeTab: tabs[0]});

    passB.getEntries().then((entries: LabeledEntries) => this.setState({entries}));
  }

  public render() {
    const {activeTab, entries} = this.state;
    console.log(this.state);
    return (
      <div>
        <h1>PassB</h1>
        <div>
          <ul>
            {activeTab
            && <li>You are currently on {activeTab.url}</li>
            || <li>Could not determine active tab.</li>
            }
            {Object.keys(entries).map((label: string) => <li>{label}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
