import { Component, ReactElement } from 'react';
import Link from 'next/link';
import { inject, observer } from 'mobx-react';

import style from './Logo.module.scss';

import LogoDark from './svg/logo-dark.svg';
import LogoWhite from './svg/logo-white.svg';

import MainStore from '../../../stores/mainStore';
import { STORE_IDS } from '../../../stores';
import { URLS } from './../../../routes';

type TLogo = {
  mainStore?: MainStore;
};

@inject(STORE_IDS.MAIN_STORE)
@observer
export class Logo extends Component<TLogo> {
  render(): ReactElement | null {
    const { mainStore } = this.props;

    if (mainStore) {
      const { isMainPage } = mainStore;
      const LogoImage: string = isMainPage ? LogoWhite : LogoDark;

      return (
        <div className={style.logo}>
          <Link href={URLS.HOME} as={URLS.HOME}>
            <a>
              <LogoImage />
            </a>
          </Link>
        </div>
      );
    }

    return null;
  }
}
