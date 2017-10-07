import {OptionPanelProps, OptionsPanelType} from "Options/OptionsReceiver";
import {PassCli} from "PassCli";
import {ExecutionOptions, Extension, ExtensionTag, RegisterEntryCallback} from "..";
import {Show} from "./Views/Show";

import {FormControl, FormControlLabel, FormLabel, Grid, Input, List, ListItem, Radio, RadioGroup} from "material-ui";
import * as React from 'react';
import {QRCode} from "react-qr-svg";
import {RouteProps} from "react-router";
import {Service} from 'typedi';

type Level = "L" | "M" | "Q" | "H";
export interface Options {
  bgColor: string;
  fgColor: string;
  level: Level;
}

@Service({tags: [ExtensionTag]})
export class QRCodeExtension extends Extension<Options> {
  public static readonly routes: RouteProps[] = [
    {
      path: '/extension/QRCode/Show',
      component: Show,
    },
  ];
  public readonly name: string = 'QRCode';
  public readonly actions: string[] = ['show'];
  public readonly defaultOptions: Options = {
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    level: 'Q',
  };
  public readonly OptionsPanel: OptionsPanelType<Options> = OptionsPanel;

  public async initializeList(registerEntryCallback: RegisterEntryCallback): Promise<void> {
    for (const label of await PassCli.list()) {
      registerEntryCallback({
        label,
        actions: this.actions,
      });
    }
  }

  public getLabelForAction(action: string): string {
    switch (action) {
      case 'show':
        return 'extension_qrcode_action_show';
      default:
        return '';
    }
  }

  public executeAction(action: string, entry: string, {navigateTo}: ExecutionOptions): void {
    switch (action) {
      case 'show':
        navigateTo('/extension/QRCode/Show', {entry, options: this.options});
        break;
      default:
        console.error('unknown action:', action);
    }
  }
}

function OptionsPanel({options, updateOptions}: OptionPanelProps<Options>): JSX.Element {
  return (
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

                <FormControlLabel value="L" control={<Radio />} label="L"/>
                <FormControlLabel value="M" control={<Radio />} label="M"/>
                <FormControlLabel value="Q" control={<Radio />} label="Q"/>
                <FormControlLabel value="H" control={<Radio />} label="H"/>

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
        style={{height: 150}}
        {...options}
        value="example. happy testing 😀"
      />
    </Grid>
  );
}
