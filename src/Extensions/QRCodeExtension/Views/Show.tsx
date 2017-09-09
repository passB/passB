import * as React from 'react';
import {QRCode} from 'react-qr-svg';
import {RouteComponentProps} from "react-router";

import {passB} from "ConfiguredPassB";
import {PassCli} from "PassCli";
import {Options} from '../QRCodeExtension';

interface LocationStateProps {
  location: {
    state: {
      entry: string;
      options: Options;
    };
  };
}

interface State {
  value?: string;
}

export class Show extends React.Component<RouteComponentProps<{}> & LocationStateProps, State> {
  public state: State = {};

  public async componentDidMount(): Promise<void> {
    const {location: {state: {entry}}} = this.props;
    const contents = await PassCli.show(entry);
    const value = (await (passB.getFileFormat())).getPassword(contents, entry);
    this.setState({value});
  }

  public render(): JSX.Element {
    const {value} = this.state;
    const {location: {state: {options}}} = this.props;

    if (!value) {
      return <div>loading....</div>;
    }

    return (
      <QRCode
        {...options}
        value={value}
      />
    );
  }
}
