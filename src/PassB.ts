import {InjectTagged, Service} from 'typedi';
import {executionContext} from 'Constants';
import {
  executeInCorrectContext,
  AsynchronousCallableServiceFactory,
} from 'Decorators/ExecuteInContext';
import {LazyInject} from 'Decorators/LazyInject';
import {Extension, ExtensionTag} from 'Extensions';
import {FileFormat, FileFormatTag} from 'PluggableStrategies/FileFormats';
import {Filler, FillerTag} from 'PluggableStrategies/Fillers';
import {Matcher, MatcherTag} from 'PluggableStrategies/Matchers';
import * as OptionsSelectors from 'State/Options/Selectors';
import {State} from 'State/State';

@Service({factory: AsynchronousCallableServiceFactory(PassB)})
export class PassB {
  @InjectTagged(ExtensionTag)
  protected extensions: Array<Extension<{}>>;
  @InjectTagged(FileFormatTag)
  protected fileFormats: Array<FileFormat<{}>>;
  @InjectTagged(MatcherTag)
  protected matchers: Array<Matcher<{}>>;
  @InjectTagged(FillerTag)
  protected fillers: Array<Filler<{}>>;
  @LazyInject(() => State)
  protected state: State;

  public getAllExtensions(): Array<Extension<{}>> {
    return this.extensions;
  }

  public getExtension(name: string): Extension<{}> {
    const extension = this.extensions.find((item: Extension<{}>) => item.name === name);
    if (!extension) {
      throw new Error(`query for unknown extension ${name}`);
    }
    return extension;
  }

  public getMatcher(): Matcher<{}> {
    const selected = OptionsSelectors.getSelectedStrategy(this.state.getStore().getState(), 'Matcher');
    return this.matchers.find((strategy: Matcher<{}>) => strategy.name === selected)
      || this.matchers[0];
  }

  public getAllMatchers(): Array<Matcher<{}>> {
    return this.matchers;
  }

  public getFiller(): Filler<{}> {
    const selected = OptionsSelectors.getSelectedStrategy(this.state.getStore().getState(), 'Filler');
    return this.fillers.find((strategy: Filler<{}>) => strategy.name === selected)
      || this.fillers[0];
  }

  public getAllFillers(): Array<Filler<{}>> {
    return this.fillers;
  }

  public getFileFormat(): FileFormat<{}> {
    const selected =  OptionsSelectors.getSelectedStrategy(this.state.getStore().getState(), 'FileFormat');
    return this.fileFormats.find((strategy: FileFormat<{}>) => strategy.name === selected)
      || this.fileFormats[0];
  }

  public getAllFileFormats(): Array<FileFormat<{}>> {
    return this.fileFormats;
  }

  @executeInCorrectContext(executionContext.background)
  public reloadEntries(): Promise<this> {
    const enabledExtensionNames = OptionsSelectors.getEnabledExtensions(this.state.getStore().getState());
    const enabledExtensions = this.extensions
      .filter((extension: Extension<{}>) => enabledExtensionNames.includes(extension.name));

    return Promise
      .all(enabledExtensions.map((extension: Extension<{}>) => extension.initializeList()))
      .then(() => this);
  }

  @executeInCorrectContext(executionContext.background)
  public async reloadExtension(): Promise<{}> {
    browser.runtime.reload();
    return {};
  }
}
