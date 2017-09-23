import {passB} from 'ConfiguredPassB';
import {FileFormat} from 'PluggableStrategies/FileFormats/FileFormat';
import {StrategyTab} from './Components/StrategyTab';

import "./style.scss";

import {
  Card,
  CardContent,
  Checkbox,
  List, ListItem, ListItemText,
  MuiThemeProvider,
  Tab,
  Tabs,
} from "material-ui";
import {createMuiTheme} from "material-ui/styles";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Extension} from "Extensions/Extension";
import {OptionsData, OptionsList} from "./Options";

const theme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: '20px',
      },
    },
  },
});

type TabValue = "Extensions" | "Matcher" | "Filler" | "FileFormat";

interface State {
  selectedTab: TabValue;
  options?: OptionsData;
}

class Popup extends React.Component<{}, State> {
  public state: State = {
    selectedTab: "Extensions",
    options: void 0,
  };

  public async componentDidMount(): Promise<void> {
    this.setState({options: await passB.getOptions()});
  }

  public render(): JSX.Element {
    const {selectedTab, options} = this.state;

    if (!options) {
      return <div>please wait, loading...</div>;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Tabs value={selectedTab} onChange={(event: object, value: TabValue) => this.setState({selectedTab: value})}>
            <Tab value="Extensions" label={browser.i18n.getMessage('options_tab_extensions')}/>
            <Tab value="Matcher" label={browser.i18n.getMessage('options_tab_matchers')}/>
            <Tab value="FileFormat" label={browser.i18n.getMessage('options_tab_file_formats')}/>
            <Tab value="Filler" label={browser.i18n.getMessage('options_tab_fillers')}/>
          </Tabs>
          {selectedTab === "Extensions" && <div>
            <List>
              {passB.getAllExtensions().map((extension: Extension<{}>) => {
                const enabled = options.enabledExtensions.includes(extension.name);
                const OptionsPanel = extension.OptionsPanel;
                return (
                  <ListItem
                    key={extension.name}
                    style={{flexWrap: "wrap"}}
                  >
                    <Checkbox
                      checked={enabled}
                      onChange={(event: any, newValue: boolean) => {
                        this.updateOptions({
                          enabledExtensions: [
                            ...(newValue ?
                                [...options.enabledExtensions, extension.name] :
                                options.enabledExtensions.filter((value: string) => value !== extension.name)
                            ),
                          ],
                        });

                      }}
                    />
                    <ListItemText primary={extension.name}/>
                    {enabled && OptionsPanel && (
                      <Card style={{pageBreakBefore: "always", width: "100%"}}>
                        <CardContent>
                          <OptionsPanel
                            options={options.extensionsOptions[extension.name]}
                            updateOptions={(newOptions: {}) => this.updateOptions({
                              extensionsOptions: {...options.extensionsOptions, [extension.name]: newOptions},
                            })}
                          />
                        </CardContent>
                      </Card>
                    )}

                  </ListItem>
                );
              })}
            </List>
          </div>
          }
          {selectedTab === "Matcher" && (
            <StrategyTab
              label="options_tab_matchers"
              strategies={passB.getAllMatchers()}
              selectedStrategyName={options.selectedMatcher}
              strategyOptions={options.matchers}
              updateSelectedStrategyName={(selectedMatcher: string) => this.updateOptions({selectedMatcher})}
              updateOptions={(matchers: OptionsList) => this.updateOptions({matchers})}
            />
          )}
          {selectedTab === "FileFormat" && (
            <StrategyTab
              label="options_tab_file_formats"
              strategies={passB.getAllFileFormats()}
              selectedStrategyName={options.selectedFileFormat}
              strategyOptions={options.fileFormats}
              updateSelectedStrategyName={(selectedFileFormat: string) => this.updateOptions({selectedFileFormat})}
              updateOptions={(fileFormats: OptionsList) => this.updateOptions({fileFormats})}
            />
          )}
          {selectedTab === "Filler" && (
            <StrategyTab
              label="options_tab_fillers"
              strategies={passB.getAllFillers()}
              selectedStrategyName={options.selectedFiller}
              strategyOptions={options.fillers}
              updateSelectedStrategyName={(selectedFiller: string) => this.updateOptions({selectedFiller})}
              updateOptions={(fillers: OptionsList) => this.updateOptions({fillers})}
            />
          )}

        </div>
      </MuiThemeProvider>
    );
  }

  private updateOptions(newOptions: Partial<OptionsData>): void {
    const fullNewOptions = {...this.state.options, ...newOptions} as OptionsData;
    this.setState({options: fullNewOptions});
    passB.setOptions(fullNewOptions);
  }
}

ReactDOM.render(<Popup/> , document.getElementById('app'));
