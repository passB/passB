import {withStyles, ListItem,  WithStyles} from 'material-ui';
import {ExpandLess, ExpandMore} from 'material-ui-icons';
import {Theme} from 'material-ui/styles';
import Collapse from 'material-ui/transitions/Collapse';
import * as React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[] | React.ReactNode;
  CollapsedChildren: React.ComponentType<{}>;
  initiallyExpanded?: boolean;
}

interface State {
  collapsed: boolean;
}

type styleClasses = 'nested';

const styles = (theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

export const CollapsibleListItem = withStyles<styleClasses>(styles)(
  class extends React.Component<Props & WithStyles<styleClasses>, State> {
    public constructor(props: Props & WithStyles<styleClasses>) {
      super(props);
      this.state = {
        collapsed: !this.props.initiallyExpanded,
      };
    }

    public render(): JSX.Element[] {
      const {classes, children, CollapsedChildren} = this.props;
      const {collapsed} = this.state;

      // tslint:disable:jsx-wrap-multiline - see https://github.com/palantir/tslint-react/issues/79
      return [
        <ListItem
          button={true}
          key="item"
          onClick={() => this.setState({collapsed: !collapsed})}
        >
          {children}
          {collapsed ?
            <ExpandMore/> :
            <ExpandLess/>
          }
        </ListItem>,
        <Collapse key="collapsible" in={!collapsed} transitionDuration="auto" unmountOnExit={true}>
          <div className={classes.nested}>
            <CollapsedChildren />
          </div>
        </Collapse>,
      ];
    }
  });
