import {Store} from 'redux';
import {Persistor} from 'redux-persist';
import {StoreContents} from '../State/State';

export interface State {
  hydrated: Promise<void>;

  getPersistor(): Persistor;

  getStore(): Store<StoreContents>;
}
