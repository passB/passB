import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab = browser.tabs.Tab;

interface State {
  activeTab?: Tab;
}

class Popup extends React.Component<{}, State> {
  public state: State = {};

  public async componentDidMount() {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log(tabs);
    console.log(tabs[0].url);
    this.setState({activeTab: tabs[0]});
  }

  public render() {
    console.log(this.state, 'state');

    const {activeTab} = this.state;
    return (
      <div>
        <h1>PassB</h1>
        <div>
          <ul>
            {activeTab
            && <li>You are currently on {activeTab.url}</li>
            || <li>Could not determine active tab.</li>
            }
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
