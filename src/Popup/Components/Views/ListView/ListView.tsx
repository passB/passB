import {LazyInject} from "Decorators/LazyInject";
import {List, ListItem, ListItemText} from 'material-ui';
import {ClassProps, withStyles} from "material-ui/styles";
import {Entry, LabeledEntries, PassB} from "PassB";
import {MaterialIcon} from "Popup/Components/MaterialIcon";
import * as React from 'react';

interface Props {
  url: string;
  navigateTo: (newUrl: string, state: {}) => void;
}

interface State {
  entries: Entry[];
  filtered?: Entry[];
}

const styles = {
  centered: {
    width: '100%',
    textAlign: 'center',
  },
};

class ListViewComponent extends React.Component<Props & ClassProps<typeof styles>, State> {
  public state: State = {
    entries: [],
  };

  @LazyInject(() => PassB)
  private passB: PassB;

  public componentDidMount(): void {
    this.passB.getEntries()
      .then((entries: LabeledEntries) =>
        this.setState({entries: Object.values(entries)}, () => this.recalculateFilteredEntries()),
      );
  }

  public render(): JSX.Element {
    const {navigateTo, classes} = this.props;
    const {filtered} = this.state;

    return (
      <List>
        {!filtered && (
          <div className={classes.centered}> <MaterialIcon icon="loading" size="36" spin={true}/></div>
        )}
        {filtered && filtered.map((entry: Entry) => (
          <ListItem
            button={true}
            key={entry.label}
            onClick={() => navigateTo(`entry`, {entry})}
          >
            <ListItemText primary={entry.label.replace(/\//g, "/\u200b")}/>
          </ListItem>
        ))}
      </List>
    );
  }

  private async recalculateFilteredEntries(): Promise<void> {
    if (!this.props.url || !this.state.entries) {
      return;
    }
    (await (this.passB.getMatcher()))
      .filterEntries(this.props.url || '', this.state.entries)
      .then((filtered: Entry[]) => this.setState({filtered}));
  }
}

export const ListView = withStyles<Props>(styles)(ListViewComponent);
