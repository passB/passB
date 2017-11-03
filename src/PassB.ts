import {injectable, multiInject} from 'inversify';
import {executionContext} from 'Constants';
import {Interfaces, Symbols} from 'Container';
import {lazyInject} from 'Decorators/lazyInject';
import {executeInCorrectContext, AsynchronousCallable} from 'Decorators/ExecuteInContext';
import {Extension, FileFormat, Filler, Matcher} from 'InjectableInterfaces';
import * as OptionsSelectors from 'State/Options/Selectors';

@AsynchronousCallable()
@injectable()
export class PassB implements Interfaces.PassB {
  @multiInject(Symbols.Extension)
  protected extensions: Array<Extension<{}>>;
  @multiInject(Symbols.FileFormat)
  protected fileFormats: Array<FileFormat<{}>>;
  @multiInject(Symbols.Matcher)
  protected matchers: Array<Matcher<{}>>;
  @multiInject(Symbols.Filler)
  protected fillers: Array<Filler<{}>>;
  @lazyInject(Symbols.State)
  protected state: Interfaces.State;

  public getAllExtensions(): Array<Extension<{}>> {
    return this.extensions;
  }

  public getEnabledExtensions(): Array<Extension<{}>> {
    const enabledExtensionNames = OptionsSelectors.getEnabledExtensions(this.state.getStore().getState());
    return this.extensions
      .filter((extension: Extension<{}>) => enabledExtensionNames.includes(extension.name));
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
    const selected = OptionsSelectors.getSelectedStrategy(this.state.getStore().getState(), 'FileFormat');
    return this.fileFormats.find((strategy: FileFormat<{}>) => strategy.name === selected)
      || this.fileFormats[0];
  }

  public getAllFileFormats(): Array<FileFormat<{}>> {
    return this.fileFormats;
  }

  @executeInCorrectContext(executionContext.background)
  public reloadEntries(): Promise<this> {
    return Promise
      .all(this.getEnabledExtensions().map((extension: Extension<{}>) => extension.initializeList()))
      .then(() => this);
  }

  @executeInCorrectContext(executionContext.background)
  public async reloadExtension(): Promise<{}> {
    browser.runtime.reload();
    return {};
  }
}
