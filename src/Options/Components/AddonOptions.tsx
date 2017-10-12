import {
  Card,
  CardContent,
  Checkbox,
  List, ListItem, ListItemText,
  Tab,
  Tabs,
} from "material-ui";
import {withStyles, ClassProps, StyleRules} from "material-ui/styles";
import * as React from 'react';
import {LazyInject} from "Decorators/LazyInject";
import {Extension} from "Extensions/Extension";
import {OptionsData, OptionsList} from "Options/Options";
import {PassB} from 'PassB';
import {FileFormat} from 'PluggableStrategies/FileFormats/FileFormat';
import {StrategyTab} from './StrategyTab';

type TabValue = "Extensions" | "Matcher" | "Filler" | "FileFormat";

interface State {
  selectedTab: TabValue;
  options?: OptionsData;
}

const x: Partial<React.CSSProperties> = {flexWrap: 'wrap'};

const styles: StyleRules = {
  wrap: {
    flexWrap: 'wrap',
  },
  breakBefore: {
    pageBreakBefore: 'always',
    width: '100%',
  },
};

class ClassLessAddonOptions extends React.Component<ClassProps<typeof styles>, State> {
  public state: State = {
    selectedTab: "Extensions",
    options: void 0,
  };

  @LazyInject(() => PassB)
  private passB: PassB;

  public async componentDidMount(): Promise<void> {
    this.setState({options: await this.passB.getOptions()});
  }

  public render(): JSX.Element {
    const {selectedTab, options} = this.state;
    const {classes} = this.props;
    const passB = this.passB;

    if (!options) {
      return <div>please wait, loading...</div>;
    }

    return (
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
                  className={classes.wrap}
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
                    <Card className={classes.breakBefore}>
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
    );
  }

  private updateOptions(newOptions: Partial<OptionsData>): void {
    const fullNewOptions = {...this.state.options, ...newOptions} as OptionsData;
    this.setState({options: fullNewOptions});
    this.passB.setOptions(fullNewOptions);
  }
}

export const AddonOptions = withStyles(styles)(ClassLessAddonOptions);
