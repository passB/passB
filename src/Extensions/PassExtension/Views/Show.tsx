import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';

interface LocationStateProps {
  location: {
    state: {
      entry: string;
    };
  };
}

interface State {
  contents: string[];
}

export class Show extends React.Component<RouteComponentProps<{}> & LocationStateProps, State> {
  public state: State = {
    contents: [browser.i18n.getMessage('popup_message_loading')],
  };

  @lazyInject(Symbols.PassCli)
  private passCli: Interfaces.PassCli;

  public async componentDidMount(): Promise<void> {
    const {location: {state: {entry}}} = this.props;
    const contents = await this.passCli.show(entry);
    this.setState({contents});
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.state.contents.map((line: string, idx: number) => <div key={idx}>{line}</div>)}
      </div>
    );
  }
}
