import { useMemo } from 'react';
import { useStaticRendering } from 'mobx-react';

import { TJSON } from '../interfaces';
import { isServer } from '../utils';
import { LoanApi, PaymentApi, OtpApi, CommonApi } from '../apis';
import LocaleStore from './LocaleStore';
import PageStore from './PageStore';
import LoanStore from './LoanStore';
import PaymentStore from './PaymentStore';
import { UserApi } from '../apis';
import UserStore from './UserStore';
import OtpStore from './OtpStore';

export enum STORE_IDS {
  LOCALE_STORE = 'localeStore',
  PAGE_STORE = 'pageStore',
  LOAN_STORE = 'loanStore',
  REGISTRATION_STORE = 'registrationStore',
  PAYMENT_STORE = 'paymentStore',
  USER_STORE = 'userStore',
  OTP_STORE = 'otpStore',
}

export type TStores = {
  [STORE_IDS.LOCALE_STORE]: LocaleStore;
  [STORE_IDS.PAGE_STORE]: PageStore;
  [STORE_IDS.LOAN_STORE]: LoanStore;
  [STORE_IDS.PAYMENT_STORE]: PaymentStore;
  [STORE_IDS.USER_STORE]: UserStore;
  [STORE_IDS.OTP_STORE]: OtpStore;
};

//APIS
const commonApi: CommonApi = new CommonApi();
const loanApi: LoanApi = new LoanApi();
const paymentApi: PaymentApi = new PaymentApi();
const userApi: UserApi = new UserApi();
const otpApi: OtpApi = new OtpApi();

//STORES
const localeStore: LocaleStore = new LocaleStore();
const pageStore: PageStore = new PageStore();
const loanStore: LoanStore = new LoanStore(loanApi, userApi, commonApi);
const paymentStore: PaymentStore = new PaymentStore(paymentApi);
const userStore: UserStore = new UserStore(userApi, commonApi);
const otpStore: OtpStore = new OtpStore(otpApi, userApi);

let stores: TStores | undefined;

useStaticRendering(isServer);

function initializeStores(initialData: TJSON) {
  const _stores: TStores = stores ?? {
    [STORE_IDS.LOCALE_STORE]: localeStore,
    [STORE_IDS.PAGE_STORE]: pageStore,
    [STORE_IDS.LOAN_STORE]: loanStore,
    [STORE_IDS.PAYMENT_STORE]: paymentStore,
    [STORE_IDS.USER_STORE]: userStore,
    [STORE_IDS.OTP_STORE]: otpStore,
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
