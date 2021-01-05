import React, { PureComponent, ReactElement } from 'react';
import { Router } from 'next/router';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { BrowserView } from 'react-device-detect';

import style from './Layout.module.scss';

import { TLayoutProps } from './@types';
import { EEvents, ENVIRONMENT } from '@src/constants';
import { EGlobalEvent, ETrackingActions } from '@src/trackingConstants';
import { delay, getSelectedData, isDev, isTest } from '@utils';
import * as gtag from '@libs/gtag';
import { Header } from '@components/Header';
import { DeveloperMenu } from '@components/developer';
import { Footer } from '@components/Footer';
import { WithLocale } from '@components/hocs';
import { Preloader } from '@components/Preloader';

@observer
export class Layout extends PureComponent<TLayoutProps> {
  public readonly state = {
    uuid: null,
  };

  constructor(props: TLayoutProps) {
    super(props);

    Router.events.on(EEvents.CHANGE_COMPLETE, (url: string) => {
      console.info(`Page changed to ${url}`);

      props.trackingStore.sendPageInfo(ETrackingActions.PAGES);
      gtag.pageview(url);
    });
  }

  public componentDidMount(): void {
    const { trackingStore, userStore } = this.props;

    window.onscroll = () => {
      trackingStore.updateDataOnScroll();
    };

    window.onbeforeunload = () => {
      trackingStore.updateDataBeforeUnload();
    };

    document[EGlobalEvent.SELECTION_CHANGE] = (event) => {
      const { target } = event;

      delay(() => {
        const { content, text } = getSelectedData();

        this.props.trackingStore.sendEvent(EGlobalEvent.SELECT_START, {
          target,
          content,
          text,
        });
      }, 500);
    };

    userStore.сollectFingerPrint(async (fp) => {
      await trackingStore.getExternalSessionData({
        new_id: 1,
        uuid: fp.visitorId,
      });

      const device = await import('current-device');

      userStore.setCurrentDevice(device.default);

      this.setState({ uuid: fp.visitorId }, () => {
        userStore.fetchWithAuth(() => {
          userStore.updateUserState();
          trackingStore.sendSessionInfo(ETrackingActions.COMMON);
        }, false);
      });
    });
  }

  public componentDidUpdate(): void {
    const { trackingStore, userStore } = this.props;

    userStore.сollectFingerPrint(async () => {
      await trackingStore.getExternalSessionData();

      userStore.fetchWithAuth(() => {
        userStore.updateUserState();
        trackingStore.sendSessionInfo(ETrackingActions.COMMON);
      }, false);
    });
  }

  public render(): ReactElement {
    const { Component, template, ...restProps } = this.props;
    const { uuid } = this.state;
    const {
      pageStore: { copyright },
    } = restProps;

    let hasBackground = false;
    let header = <Header />;
    let footer = <Footer copyright={copyright} />;

    if (template) {
      const { background, headerLess, footerLess } = template;

      hasBackground = background;
      header = <Header less={headerLess} />;
      footer = <Footer copyright={copyright} less={footerLess} />;
    }

    if (uuid) {
      return (
        <WithLocale>
          {isDev && (
            <BrowserView>
              <DeveloperMenu {...restProps} />
            </BrowserView>
          )}
          {header}
          {(isDev || isTest) && (
            <h1 className={style.environmentInfo}>{ENVIRONMENT}</h1>
          )}
          <main
            className={classNames(style.main, {
              [style.background]: hasBackground,
            })}
          >
            <div className={style.container}>
              <Component {...restProps} />
            </div>
          </main>
          {footer}
        </WithLocale>
      );
    }

    return <Preloader />;
  }
}
