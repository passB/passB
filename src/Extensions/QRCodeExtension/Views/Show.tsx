import * as React from 'react';
import {QRCode} from 'react-qr-svg';
import {RouteComponentProps} from "react-router";

import {passB} from "ConfiguredPassB";
import {PassCli} from "PassCli";

interface LocationStateProps {
  location: {
    state: {
      entry: string;
    };
  };
}

interface State {
  contents?: string[];
}

export class Show extends React.Component<RouteComponentProps<{}> & LocationStateProps, State> {
  public state: State = {};

  public async componentDidMount(): Promise<void> {
    const {location: {state: {entry}}} = this.props;
    const contents = await PassCli.show(entry);
    this.setState({contents});
  }

  public render(): JSX.Element {
    const {contents} = this.state;
    const {location: {state: {entry}}} = this.props;

    if (!contents) {
      return <div>loading....</div>;
    }
    const value = passB.getFileFormat().getPassword(contents, entry);
    if (!value) {
      return <div>file contains no password!</div>;
    }
    return (
      <QRCode
        value={value}
      />
    );
  }
}
