import {List, ListItem, ListItemText, Menu, MenuItem} from 'material-ui';
import * as React from 'react';

// see https://material-ui-1dab0.firebaseapp.com/demos/menus/

interface Props {
  options: string[];
  label: string;
  selectedIndex: number;
  onChange: (newSelectedIndex: number) => void;
}

interface State {
  anchorEl?: HTMLElement;
  open: boolean;
}

export class DropDown extends React.Component<Props, State> {
  public state: State = {
    anchorEl: undefined,
    open: false,
  };

  public render(): JSX.Element {
    const {options, label, selectedIndex, onChange} = this.props;

    return (
      <div>
        <List>
          <ListItem
            button={true}
            onClick={(event: React.MouseEvent<HTMLElement>) =>
              this.setState({open: true, anchorEl: event.currentTarget})}
          >
            <ListItemText
              primary={options[selectedIndex]}
              secondary={label}
            />
          </ListItem>
        </List>
        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false})}
        >
          {options.map((option: string, index: number) => (
            <MenuItem
              key={index}
              selected={index === selectedIndex}
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                this.setState({open: false});
                onChange(index);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}
