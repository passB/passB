import {Entry} from "PassB";

import * as React from 'react';
import {PassCli} from "../../../PassCli";

interface Props {
  entry: string;
}

interface State {
  contents: string;
}

export class Show extends React.Component<Props, State> {
  public state: State = {
    contents: '',
  };

  public componentWillMount() {
    console.log(this.props);
    PassCli.show(this.props.entry)
      .then(
        (contents: string[]) => this.setState({contents: contents.join("\n")}),
      );
  }

  public render() {
    return <div>
      {this.state.contents}
    </div>;
  }
}
