import {FormControl, FormControlLabel, FormLabel, Grid, Input, List, ListItem, Radio, RadioGroup} from 'material-ui';
import {withStyles, ClassProps} from 'material-ui/styles';
import * as React from 'react';
import {QRCode} from 'react-qr-svg';
import {OptionPanelProps} from 'Options/OptionsReceiver';
import {Level, Options} from './QRCodeExtension';

const styles = {
  qrcode: {
    height: '150px',
  },
};

export const OptionsPanel = withStyles<OptionPanelProps<Options>>(styles)(
  ({options, updateOptions, classes}: OptionPanelProps<Options> & ClassProps<typeof styles>): JSX.Element => (
    <Grid container={true} direction="row" justify="space-between" align="center" spacing={0}>
      <Grid item={true}>
        <List>
          <ListItem>
            <FormControl>
              <FormLabel>Error correction level:</FormLabel>
              <RadioGroup
                value={options.level}
                row={true}
                onChange={(event: React.InputHTMLAttributes<HTMLInputElement>, value: Level) => updateOptions({
                  ...options,
                  level: value,
                })}
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
              <FormLabel>Background color:</FormLabel>
              <Input
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => updateOptions({
                    ...options,
                    bgColor: event.target.value,
                  }),
                }}
                type="color"
                value={options.bgColor}
              />
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl>
              <FormLabel>Foreground color:</FormLabel>
              <Input
                inputProps={{
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => updateOptions({
                    ...options,
                    fgColor: event.target.value,
                  }),
                }}
                type="color"
                value={options.fgColor}
              />
            </FormControl>
          </ListItem>
        </List>
      </Grid>
      <QRCode
        className={classes.qrcode}
        {...options}
        value="example. happy testing 😀"
      />
    </Grid>
  ));
