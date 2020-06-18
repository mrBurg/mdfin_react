import { useStaticRendering } from 'mobx-react';
import { isServer } from '../utils';
import MainStore from './mainStore';

export enum STORE_IDS {
  MAIN_STORE = 'mainStore',
}

export type TStores = {
  [STORE_IDS.MAIN_STORE]: MainStore;
};

useStaticRendering(isServer);

let stores: TStores | undefined;

//@ts-ignore
export default function initializeStores(initialData: any = null) {
  // console.info(initialData);

  const _stores: TStores = stores ?? {
    [STORE_IDS.MAIN_STORE]: new MainStore(),
  };

  if (isServer) return _stores;
  if (!stores) stores = _stores;

  return _stores;
}
