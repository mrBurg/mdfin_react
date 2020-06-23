import React, { Component, ReactElement } from 'react';

import './../../scss/index.scss';
import './Layout.scss';

import { defaultLocale } from './../../config.json';
import { IPageProps } from '../../interfaces';
import WithLocale from './WithLocale';
import Header from '../Header';
import { observer, inject } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import LocaleStore from '../../stores/localeStore';

type TLayout = {
  localeStore: LocaleStore;
} & IPageProps;

@inject(STORE_IDS.LOCALE_STORE)
@observer
export class Layout extends Component<TLayout> {
  constructor(props: TLayout) {
    super(props);

    const { localeStore } = props;

    localeStore.setCurrentLanguage(defaultLocale);
  }

  public render(): ReactElement {
    const { Component, localeStore, ...pageProps } = this.props;

    return (
      <WithLocale {...localeStore}>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </WithLocale>
    );
  }
}
