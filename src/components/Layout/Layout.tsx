import React, { Component, ReactElement, ReactNode } from 'react';
import { NextComponentType } from 'next';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

import style from './Layout.module.scss';

import WithLocale from './WithLocale';
import { STORE_IDS } from '../../stores';
import LocaleStore from '../../stores/localeStore';
import PageStore from '../../stores/pageStore';
import HeaderLess from '../headers/HeaderLess';
import Header from '../headers/Header';
import FooterLess from '../footers/FooterLess';
import Footer from '../footers/Footer';
import { TJSON } from '../../interfaces';

export type TLayoutProps = {
  localeStore: LocaleStore;
  pageStore: PageStore;
  Component: NextComponentType;
  template?: TJSON;
};

type TComponentProps = {
  pageStore: PageStore;
  children?: ReactNode;
};

@inject(STORE_IDS.LOCALE_STORE, STORE_IDS.PAGE_STORE)
@observer
export class Layout extends Component<TLayoutProps> {
  public render(): ReactElement {
    const { Component, template, localeStore, pageStore } = this.props;
    const { locale } = localeStore;
    const { copyright } = pageStore;

    const ComponentProps: TComponentProps = {
      pageStore,
    };

    let backgroundStyle;
    let header: ReactElement = <Header />;
    let footer: ReactElement = <Footer copyright={copyright} />;

    if (template) {
      const { background, headerLess, footerLess } = template;

      backgroundStyle = background;
      if (headerLess) header = <HeaderLess />;
      if (footerLess) footer = <FooterLess copyright={copyright} />;
    }

    return (
      <WithLocale locale={locale}>
        {header}
        <main
          className={classNames(style.main, {
            [style.background]: backgroundStyle,
          })}
        >
          <div className={style.container}>
            <Component {...ComponentProps} />
          </div>
        </main>
        {footer}
      </WithLocale>
    );
  }
}
