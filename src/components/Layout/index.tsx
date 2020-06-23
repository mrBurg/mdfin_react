import React, { Component, ReactElement, createContext } from 'react';

import './../../scss/index.scss';
import './Layout.scss';

import { IPageProps, IPageState } from '../../interfaces';
import WithLocale from './WithLocale';
import Header from '../Header';
import { isBrowser } from '../../utils';
import { observer, inject } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import LocaleStore from '../../stores/localeStore';

export const LocaleContext = createContext<LocaleStore | null>(null);
const LocaleContextProvider = LocaleContext.Provider;

@inject(STORE_IDS.LOCALE_STORE)
@observer
export class Layout extends Component<IPageProps & any, IPageState> {
  public state: IPageState = {};

  public componentDidMount(): void {
    this.setState(
      (state: IPageState): IPageState => {
        return {
          ...state,
          isCSR: isBrowser,
        };
      }
    );
  }

  public render(): ReactElement | null {
    const { Component, localeStore, ...pageProps } = this.props;
    let { isCSR } = this.state;

    if (isCSR && localeStore) {
      const { locale } = localeStore;

      return (
        <LocaleContextProvider value={localeStore}>
          <WithLocale locale={locale}>
            <Header />
            <main>
              <Component {...pageProps} />
            </main>
          </WithLocale>
        </LocaleContextProvider>
      );
    }

    return (
      <>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </>
    );
  }
}
