import React, { PureComponent, ReactElement } from 'react';
import { Router } from 'next/router';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import style from './Layout.module.scss';

import { WithLocale } from './WithLocale';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { DeveloperMenu } from '../developer';
import { isDev } from '../../utils';
import { TLayoutProps } from './@types';
import * as gtag from './../../libs/gtag';

@observer
export class Layout extends PureComponent<TLayoutProps> {
  constructor(props: TLayoutProps) {
    super(props);

    Router.events.on('routeChangeComplete', (url: string) => {
      console.info(`Page changed to ${url}`);

      gtag.pageview(url);
    });
  }

  public componentDidMount(): void {
    this.checkUserData();
  }

  public componentDidUpdate(): void {
    this.checkUserData();
  }

  private checkUserData(): void {
    const { userStore } = this.props;

    userStore.makeFingerprint();
    userStore.fetchWithAuth(() => {
      userStore.updateUserState();
    });
  }

  public render(): ReactElement {
    const { Component, template, ...props } = this.props;
    const {
      localeStore: { locale },
      pageStore: { copyright, footerTags },
    } = props;

    let hasBackground: boolean = false;
    let header: ReactElement = <Header />;
    let footer: ReactElement = (
      <Footer copyright={copyright} tags={footerTags} />
    );

    if (template) {
      const { background, headerLess, footerLess } = template;

      hasBackground = background;
      header = <Header less={headerLess} />;
      footer = (
        <Footer copyright={copyright} tags={footerTags} less={footerLess} />
      );
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
