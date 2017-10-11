import {LazyInject} from "Decorators/LazyInject";
import {PassCli} from "PassCli";
import * as React from 'react';
import {RouteComponentProps} from "react-router";

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
    contents: [],
  };

  @LazyInject(() => PassCli)
  private passCli: PassCli;

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
