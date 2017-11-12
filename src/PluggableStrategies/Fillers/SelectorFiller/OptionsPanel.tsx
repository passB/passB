import {Checkbox, FormControl, FormControlLabel, TextField, Typography, WithStyles} from 'material-ui';
import withStyles from 'material-ui/styles/withStyles';
import * as React from 'react';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Options} from './SelectorFiller';

const styles = {
  topPadding: {
    paddingTop: '24px',
  },
};

interface State {
  invalidProps: {
    defaultUsernameSelector?: string | false;
    defaultPasswordSelector?: string | false;
  };
}

class OptionsPanelComponent extends React.Component<OptionPanelProps<Options> & WithStyles<keyof typeof styles>, State> {
  public state: State = {
    invalidProps: {},
  };

  public render(): JSX.Element {
    const {
      options,
      updateOptions,
      classes,
    } = this.props;

    const {
      invalidProps: {
        defaultUsernameSelector: invalidDefaultUsernameSelector,
        defaultPasswordSelector: invalidDefaultPasswordSelector,
      },
    } = this.state;

    const {
      defaultUsernameSelector,
      defaultPasswordSelector,
      fillOnlyFirstMatchingField,
      usernameSelectorPrefix,
      passwordSelectorPrefix,
    } = options.toJS();

    return (
      <FormControl fullWidth={true}>
        <TextField
          id="defaultUsernameSelector"
          error={!!invalidDefaultUsernameSelector}
          label={browser.i18n.getMessage('options_selectorfiller_defaultUsernameSelector')}
          helperText={browser.i18n.getMessage('options_selectorfiller_defaultUsernameSelector_helperText')}
          value={invalidDefaultUsernameSelector || defaultUsernameSelector}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setSelectorOptions('defaultUsernameSelector', event.target.value)}
          margin="normal"
        />
        <TextField
          id="defaultPasswordSelector"
          error={!!invalidDefaultPasswordSelector}
          label={browser.i18n.getMessage('options_selectorfiller_defaultPasswordSelector')}
          helperText={browser.i18n.getMessage('options_selectorfiller_defaultPasswordSelector_helperText')}
          value={invalidDefaultPasswordSelector || defaultPasswordSelector}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setSelectorOptions('defaultPasswordSelector', event.target.value)}
          margin="normal"
        />
        <FormControlLabel
          id="fillOnlyFirstMatchingField"
          label={browser.i18n.getMessage('options_selectorfiller_fillOnlyFirstMatchingField')}
          control={
            <Checkbox
              checked={fillOnlyFirstMatchingField}
              onChange={
                (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) =>
                  updateOptions(options.set('fillOnlyFirstMatchingField', isChecked))
              }
            />
          }
        />
        <Typography type="title" className={classes.topPadding} gutterBottom={true}>
          {browser.i18n.getMessage('options_selectorfiller_prefix_heading')}
        </Typography>
        <Typography type="subheading">
          {browser.i18n.getMessage('options_selectorfiller_prefix_explanation')}
        </Typography>
        <TextField
          id="usernameSelectorPrefix"
          label={browser.i18n.getMessage('options_selectorfiller_usernameSelectorPrefix')}
          value={usernameSelectorPrefix}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            updateOptions(options.set('usernameSelectorPrefix', event.target.value))}
          margin="normal"
        />
        <TextField
          id="passwordSelectorPrefix"
          label={browser.i18n.getMessage('options_selectorfiller_passwordSelectorPrefix')}
          value={passwordSelectorPrefix}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            updateOptions(options.set('passwordSelectorPrefix', event.target.value))}
          margin="normal"
        />
      </FormControl>
    );
  }

  private setSelectorOptions(selector: keyof Options, value: string): void {
    try {
      if (value) {
        // try to use the selector to detect invalid syntax
        document.querySelector(value);
      }
      this.props.updateOptions(this.props.options.set(selector, value));
      this.setState({invalidProps: {...this.state.invalidProps, [selector]: false}});
    } catch (e) {
      this.setState({invalidProps: {...this.state.invalidProps, [selector]: value}});
    }

  }
}

export const OptionsPanel = withStyles(styles)(OptionsPanelComponent);
