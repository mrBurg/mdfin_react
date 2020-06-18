import { useStaticRendering } from 'mobx-react';

import { isServer } from '../utils';
import MainStore from './mainStore';

export enum STORE_IDS {
  MAIN_STORE = 'mainStore',
}

export type TStores = {
  [STORE_IDS.MAIN_STORE]: MainStore;
};

const mainStore: MainStore = new MainStore();

let stores: TStores | undefined;

useStaticRendering(isServer);

//@ts-ignore
export default function initializeStores(initialData?: TStores) {
  const _stores: TStores = stores ?? {
    [STORE_IDS.MAIN_STORE]: mainStore,
  };

  if (isServer) return _stores;
  if (!stores) stores = _stores;

  return _stores;
}
