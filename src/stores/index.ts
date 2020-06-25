import { useStaticRendering } from 'mobx-react';

import { isServer } from '../utils';
import MainStore from './mainStore';
import LocaleStore from './localeStore';

export enum STORE_IDS {
  LOCALE_STORE = 'localeStore',
  MAIN_STORE = 'mainStore',
}

export type TStores = {
  [STORE_IDS.LOCALE_STORE]: LocaleStore;
  [STORE_IDS.MAIN_STORE]: MainStore;
};

const localeStore: LocaleStore = new LocaleStore();
const mainStore: MainStore = new MainStore();

let stores: TStores | undefined;

useStaticRendering(isServer);

export default function initializeStores() {
  const _stores: TStores = stores ?? {
    [STORE_IDS.LOCALE_STORE]: localeStore,
    [STORE_IDS.MAIN_STORE]: mainStore,
  };

  if (isServer) return _stores;
  if (!stores) stores = _stores;

  return _stores;
}
