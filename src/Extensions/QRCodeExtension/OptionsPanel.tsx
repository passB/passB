import {FormControl, FormControlLabel, FormLabel, Grid, Input, List, ListItem, Radio, RadioGroup} from 'material-ui';
import {withStyles, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {QRCode} from 'react-qr-svg';
import {OptionPanelProps} from 'InjectableInterfaces/OptionsPanel';
import {Level, Options} from './QRCodeExtension';

const styles = {
  qrcode: {
    height: '150px',
  },
};

export const OptionsPanel = withStyles<'qrcode'>(styles)(
  ({options, updateOptions, classes}: OptionPanelProps<Options> & WithStyles<'qrcode'>): JSX.Element => (
    <Grid container={true} direction="row" justify="space-between" alignItems="center" spacing={0}>
      <Grid item={true}>
        <List>
          <ListItem>
            <FormControl>
              <FormLabel>{browser.i18n.getMessage('options_extension_qrcode_error_correction')}</FormLabel>
              <RadioGroup
                value={options.get('level')}
                row={true}
                onChange={(event: React.InputHTMLAttributes<HTMLInputElement>, value: Level) =>
                  updateOptions(options.set('level', value))}
              >

                <FormControlLabel value="L" control={<Radio/>} label="L"/>
                <FormControlLabel value="M" control={<Radio/>} label="M"/>
                <FormControlLabel value="Q" control={<Radio/>} label="Q"/>
                <FormControlLabel value="H" control={<Radio/>} label="H"/>

              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl>
              <FormLabel>{browser.i18n.getMessage('options_extension_qrcode_background_color')}</FormLabel>
              <Input
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('bgColor', event.target.value)),
                }}
                type="color"
                value={options.get('bgColor')}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl>
              <FormLabel>{browser.i18n.getMessage('options_extension_qrcode_foreground_color')}</FormLabel>
              <Input
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => updateOptions(options.set('fgColor', event.target.value)),
                }}
                type="color"
                value={options.get('fgColor')}
              />
            </FormControl>
          </ListItem>
        </List>
      </Grid>
      <QRCode
        className={classes.qrcode}
        {...options.toJS()}
        value={browser.i18n.getMessage('options_extension_qrcode_test_message')}
      />
    </Grid>
  ));
