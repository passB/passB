import {Map, Set} from 'immutable';
import {
  Card,
  CardContent,
  Checkbox,
  List, ListItem, ListItemText,
  Tab,
  Tabs,
} from 'material-ui';
import {withStyles, StyleRules, WithStyles} from 'material-ui/styles';
import * as React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {LazyInject} from 'Decorators/LazyInject';
import {Extension} from 'Extensions/Extension';
import {PassB} from 'PassB';
import {
  disableExtension,
  enableExtension,
  setExtensionOptions,
  setSelectedStrategy,
  setStrategyOptions,
} from 'State/Options/Actions';
import {getOptionsFromState, StoreContents} from 'State/State';
import {BaseStrategy} from '../../PluggableStrategies/BaseStrategy';
import {
  ExtensionName,
  ExtensionNameArgs,
  ExtensionOptionsArgs,
  OptionsDataType,
  StrategyName,
  StrategyNameArgs,
  StrategyOptionsArgs,
  StrategyType,
} from '../../State/Options/Interfaces';
import {
  getAllExtensionOptions, getAllStrategyOptions, getEnabledExtensions,
  getSelectedStrategies,
} from '../../State/Options/Selectors';
import {StrategyTab} from './StrategyTab';

type TabValue = 'Extensions' | 'Matcher' | 'Filler' | 'FileFormat';

interface Props {
}

interface MappedProps {
  enabledExtensions: Set<ExtensionName>;
  extensionOptions: Map<ExtensionName, OptionsDataType<{}>>;
  selectedStrategies: Map<StrategyType, StrategyName>;
  strategyOptions: Map<StrategyType, Map<StrategyName, OptionsDataType<{}>>>;
  enableExtension: (args: ExtensionNameArgs) => void;
  disableExtension: (args: ExtensionNameArgs) => void;
  setExtensionOptions: (args: ExtensionOptionsArgs) => void;
  setSelectedStrategy: (args: StrategyNameArgs) => void;
  setStrategyOptions: (args: StrategyOptionsArgs) => void;
}

interface State {
  selectedTab: TabValue;
}

const styles: StyleRules<'wrap' | 'breakBefore'> = {
  wrap: {
    flexWrap: 'wrap',
  },
  breakBefore: {
    pageBreakBefore: 'always',
    width: '100%',
  },
};

interface StrategyTabData {
  strategyType: StrategyType;
  strategies: Array<BaseStrategy<{}>>;
  tabLabel: string;
}

class ClassLessAddonOptions extends React.Component<Props & MappedProps & WithStyles<keyof typeof styles>, State> {
  public state: State = {
    selectedTab: 'Extensions',
  };

  @LazyInject(() => PassB)
  private passB: PassB;

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // TODO: better error handling
    console.error(error, info);
  }

  public render(): JSX.Element {
    const {selectedTab} = this.state;

    const {
      classes,
      enabledExtensions,
      extensionOptions,
      selectedStrategies,
      strategyOptions,
      // tslint:disable:no-shadowed-variable
      enableExtension,
      disableExtension,
      setExtensionOptions,
      setSelectedStrategy,
      setStrategyOptions,
      // tslint:enable:no-shadowed-variable
    } = this.props;
    const passB = this.passB;

    const strategyTabs: StrategyTabData[] = [
      {strategyType: 'Matcher', strategies: passB.getAllMatchers(), tabLabel: 'options_tab_matchers'},
      {strategyType: 'FileFormat', strategies: passB.getAllFileFormats(), tabLabel: 'options_tab_file_formats'},
      {strategyType: 'Filler', strategies: passB.getAllFillers(), tabLabel: 'options_tab_fillers'},
    ];

    return (
      <div>
        <Tabs value={selectedTab} onChange={(event: object, value: TabValue) => this.setState({selectedTab: value})}>
          <Tab value="Extensions" label={browser.i18n.getMessage('options_tab_extensions')}/>
          {strategyTabs.map(({strategyType, tabLabel}: StrategyTabData) => (
            <Tab
              key={`tab_${strategyType}`}
              value={strategyType}
              label={tabLabel}
            />
          ))}
        </Tabs>
        {selectedTab === 'Extensions' && <div>
          <List>
            {passB.getAllExtensions().map((extension: Extension<{}>) => {
              const extensionName = extension.name;
              const enabled = enabledExtensions.includes(extensionName);
              const OptionsPanel = extension.OptionsPanel;
              return (
                <ListItem
                  key={extensionName}
                  className={classes.wrap}
                >
                  <Checkbox
                    checked={enabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, newValue: boolean) =>
                      (newValue ? enableExtension : disableExtension)({extensionName})
                    }
                  />
                  <ListItemText primary={extensionName}/>
                  {enabled && OptionsPanel && (
                    <Card className={classes.breakBefore}>
                      <CardContent>
                        <OptionsPanel
                          options={extensionOptions.get(extensionName)!}
                          updateOptions={(options: OptionsDataType<{}>) => setExtensionOptions({
                            extensionName,
                            options,
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
        {strategyTabs.map(({strategyType, tabLabel, strategies}: StrategyTabData) => {
          console.log({strategyType, tabLabel, strategies, x: strategies.map(x => x.name)});
          const selectedStrategy = selectedStrategies.get(strategyType) || strategies[0].name;
          return (
            <StrategyTab
              key={`tabContents_${strategyType}`}
              label={tabLabel}
              strategies={strategies}
              selectedStrategyName={selectedStrategy}
              strategyOptions={strategyOptions.getIn([strategyType, selectedStrategy])}
              updateSelectedStrategyName={(strategyName: string) =>
                setSelectedStrategy({strategyType, strategyName})}
              updateOptions={(options: OptionsDataType<{}>) =>
                setStrategyOptions({strategyType, strategyName: selectedStrategy, options})}
            />
          );
        })}
      </div>
    );
  }
}

export const AddonOptions: React.ComponentClass<Props> = compose(
  withStyles<keyof typeof styles>(styles),
  connect(
    (state: StoreContents) => {
      const options = getOptionsFromState(state);
      return {
        enabledExtensions: getEnabledExtensions(options),
        extensionOptions: getAllExtensionOptions(options),
        selectedStrategies: getSelectedStrategies(options),
        strategyOptions: getAllStrategyOptions(options),
      };
    },
    {
      enableExtension,
      disableExtension,
      setExtensionOptions,
      setSelectedStrategy,
      setStrategyOptions,
    },
  ),
)(ClassLessAddonOptions);
