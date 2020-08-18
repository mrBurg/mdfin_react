import React, { PureComponent, ReactElement } from 'react';
import { NextComponentType } from 'next';
import { Router } from 'next/router';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

import style from './Layout.module.scss';

import WithLocale from './WithLocale';
import { STORE_IDS } from '../../stores';
import Header from '../Header';
import Footer from '../Footer';
import { TJSON, TComponenProps } from '../../interfaces';
import { DeveloperMenu } from '../developer';
import { isDev } from '../../utils';

export type TLayoutProps = {
  Component: NextComponentType;
  template?: TJSON;
} & TComponenProps;

@inject(STORE_IDS.LOCALE_STORE, STORE_IDS.PAGE_STORE, STORE_IDS.USER_STORE)
@observer
export class Layout extends PureComponent<TLayoutProps> {
  constructor(props: TLayoutProps) {
    super(props);

    Router.events.on('routeChangeComplete', (url: string) => {
      console.info(`Page changed to ${url}`);
    });
  }

  componentDidMount() {
    const { userStore } = this.props;

    userStore.makeFingerprint();
  }

  public render(): ReactElement {
    const { Component, template, ...props } = this.props;
    const {
      localeStore: { locale },
      pageStore: { copyright },
    } = props;

    let hasBackground;
    let header: ReactElement = <Header />;
    let footer: ReactElement = <Footer copyright={copyright} />;

    if (template) {
      const { background, headerLess, footerLess } = template;

      hasBackground = background;
      header = <Header less={headerLess} />;
      footer = <Footer copyright={copyright} less={footerLess} />;
    }

    return (
      <WithLocale locale={locale}>
        {isDev && <DeveloperMenu {...props} />}
        {header}
        <main
          className={classNames(style.main, {
            [style.background]: hasBackground,
          })}
        >
          <div className={style.container}>
            <Component {...props} />
          </div>
        </main>
        {footer}
      </WithLocale>
    );
  }
}
