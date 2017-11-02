import * as React from 'react';
import {QRCode} from 'react-qr-svg';
import {RouteComponentProps} from 'react-router';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
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

  @lazyInject(Symbols.PassB)
  private passB: Interfaces.PassB;

  @lazyInject(Symbols.PassCli)
  private passCli: Interfaces.PassCli;

  public async componentDidMount(): Promise<void> {
    const {location: {state: {entry}}} = this.props;
    const contents = await this.passCli.show(entry);
    const value = (await (this.passB.getFileFormat())).getPassword(contents, entry);
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
