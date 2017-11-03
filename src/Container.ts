import * as Interfaces from 'InjectableInterfaces';

const Symbols = {
  Extension: Symbol('Extension'),
  FileFormat: Symbol('FileFormat'),
  Filler: Symbol('Filler'),
  Matcher: Symbol('Matcher'),
  PassB: Symbol('PassB'),
  PassCli: Symbol('PassCli'),
  State: Symbol('State'),
  StorageAdapter: Symbol('StorageAdapter'),
};

import {Container} from 'inversify';

const container = new Container({defaultScope: 'Singleton'});

import {PassB as PassBImplementation} from 'PassB';
import {PassCli as PassCliImplementation} from 'PassCli';
import {BrowserStorageAdapter} from 'State/BrowserStorageAdapter';
import {State as StateImplementation} from 'State/State';

container.bind<Interfaces.PassB>(Symbols.PassB).to(PassBImplementation);
container.bind<Interfaces.PassCli>(Symbols.PassCli).to(PassCliImplementation).inSingletonScope();
container.bind<Interfaces.State>(Symbols.State).to(StateImplementation).inSingletonScope();
container.bind<Interfaces.StorageAdaper>(Symbols.StorageAdapter).to(BrowserStorageAdapter);

import {PassExtension} from 'Extensions/PassExtension';
import {QRCodeExtension} from 'Extensions/QRCodeExtension';

container.bind<Interfaces.Extension<{}>>(Symbols.Extension).to(PassExtension);
container.bind<Interfaces.Extension<{}>>(Symbols.Extension).to(QRCodeExtension);

import {FillPasswordInputs} from 'PluggableStrategies/Fillers/FillPasswordInputs';

container.bind<Interfaces.Filler<{}>>(Symbols.Filler).to(FillPasswordInputs);

import {FirstLineFileFormat} from 'PluggableStrategies/FileFormats/FirstLineFileFormat';
import {PrefixFileFormat} from 'PluggableStrategies/FileFormats/PrefixFileFormat';

container.bind<Interfaces.FileFormat<{}>>(Symbols.FileFormat).to(FirstLineFileFormat);
container.bind<Interfaces.FileFormat<{}>>(Symbols.FileFormat).to(PrefixFileFormat);

import {FuzzaldrinMatcher} from 'PluggableStrategies/Matchers/FuzzaldrinMatcher';

container.bind<Interfaces.Matcher<{}>>(Symbols.Matcher).to(FuzzaldrinMatcher);

export {container, Interfaces, Symbols};
