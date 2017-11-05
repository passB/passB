import {Store} from 'redux';
import {Persistor} from 'redux-persist';
import {OptionsState} from 'State/Options/Interfaces';
import {PassEntryState} from 'State/PassEntries/Interfaces';

export interface StoreContents {
  options: OptionsState;
  passEntries: PassEntryState;
}

export interface State {
  hydrated: Promise<void>;

  getPersistor(): Persistor;

  getStore(): Store<StoreContents>;
}
