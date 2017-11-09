import {List, ListItem, TextField} from 'material-ui';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {ContextualRootNode} from './ContextualRootNode';
import {FilteredRootNode} from './FilteredRootNode';

interface Props {
  url: string;
}

interface State {
  filter: string;
}

const styles = {
  noTopPadding: {
    paddingTop: '0px',
  },
};

type InnerProps = Props & WithStyles<keyof typeof styles>;

class ListViewComponent extends React.Component<InnerProps, State> {
  public state: State = {
    filter: '',
  };

  @lazyInject(Symbols.PassB)
  private passB: Interfaces.PassB;

  public constructor(props: InnerProps) {
    super(props);
  }

  public render(): JSX.Element {
    const {classes, url} = this.props;
    const {filter} = this.state;

    return (
      <List>
        <ListItem className={classes.noTopPadding}>
          <TextField
            className="search"
            label={browser.i18n.getMessage('popup_search')}
            type="search"
            fullWidth={true}
            margin="none"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({filter: e.target.value})}
            inputProps={{autoFocus: true, tabIndex: 0}}
            value={filter}
          />
        </ListItem>
        <FilteredRootNode filter={filter} />
        {url &&
        <ContextualRootNode url={url} matcher={this.passB.getMatcher()} />
        }
      </List>
    );
  }
}

export const ListView = withStyles<keyof typeof styles>(styles)(ListViewComponent);
