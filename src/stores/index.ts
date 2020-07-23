import { useMemo } from 'react';
import { useStaticRendering } from 'mobx-react';

import { TJSON } from '../interfaces';
import { isServer } from '../utils';
import { LoanApi, PaymentApi } from '../apis';
import LocaleStore from './localeStore';
import PageStore from './pageStore';
import LoanStore from './loanStore';
import RegistrationStore from './registrationStore';
import { RegistrationApi } from '../apis/RegistrationApi';
import PaymentStore from './paymentStore';

export enum STORE_IDS {
  LOCALE_STORE = 'localeStore',
  PAGE_STORE = 'pageStore',
  LOAN_STORE = 'loanStore',
  REGISTRATION_STORE = 'registrationStore',
  PAYMENT_STORE = 'paymentStore',
}

export type TStores = {
  [STORE_IDS.LOCALE_STORE]: LocaleStore;
  [STORE_IDS.PAGE_STORE]: PageStore;
  [STORE_IDS.LOAN_STORE]: LoanStore;
  [STORE_IDS.REGISTRATION_STORE]: RegistrationStore;
  [STORE_IDS.PAYMENT_STORE]: PaymentStore;
};

const loanApi: LoanApi = new LoanApi();
const registrationApi: RegistrationApi = new RegistrationApi();
const paymentApi: PaymentApi = new PaymentApi();

const localeStore: LocaleStore = new LocaleStore();
const pageStore: PageStore = new PageStore();
const loanStore: LoanStore = new LoanStore(loanApi);
const registrationStore: RegistrationStore = new RegistrationStore(
  registrationApi
);
const paymentStore: PaymentStore = new PaymentStore(paymentApi);

let stores: TStores | undefined;

useStaticRendering(isServer);

function initializeStores(initialData: TJSON) {
  const _stores: TStores = stores ?? {
    [STORE_IDS.LOCALE_STORE]: localeStore,
    [STORE_IDS.PAGE_STORE]: pageStore,
    [STORE_IDS.LOAN_STORE]: loanStore,
    [STORE_IDS.REGISTRATION_STORE]: registrationStore,
    [STORE_IDS.PAYMENT_STORE]: paymentStore,
  };

  if (initialData) {
    const { documentTitle, copyright, ...pageData } = initialData;

    pageStore.documentTitle = documentTitle;
    pageStore.pageData = pageData;
    pageStore.copyright = copyright;
  }

  if (isServer) return _stores;
  if (!stores) stores = _stores;

  return _stores;
}

export function useStore(initialState: TJSON): TStores {
  const store: TStores = useMemo(
    (): TStores => initializeStores(initialState),
    [initialState]
  );

  return store;
}
