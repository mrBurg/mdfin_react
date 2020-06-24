import React, { Component, ReactElement } from 'react';

import style from './Layout.module.scss';

import { IPageProps } from '../../interfaces';
import WithLocale from './WithLocale';
import Header from '../Header';
import { observer, inject } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import LocaleStore from '../../stores/localeStore';

type TLayoutProps = {
  localeStore: LocaleStore;
} & IPageProps;

type TLayoutState = {
  isCSR?: boolean;
};

// export const LocaleContext = createContext<LocaleStore | null>(null);
// const LocaleContextProvider = LocaleContext.Provider;

@inject(STORE_IDS.LOCALE_STORE)
@observer
export class Layout extends Component<TLayoutProps, TLayoutState> {
  public render(): ReactElement {
    const { Component, localeStore, ...pageProps } = this.props;
    const { locale } = localeStore;

    return (
      <WithLocale locale={locale}>
        <Header />
        <main className={style.main}>
          <Component {...pageProps} />
        </main>
      </WithLocale>
    );
  }
}
