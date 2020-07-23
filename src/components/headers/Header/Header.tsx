import { ReactElement, FC } from 'react';
import Link from 'next/link';

import style from './Header.module.scss';

import { URLS } from '../../../routes';
import MainMenu from '../../MainMenu';

export const Header: FC = (): ReactElement => (
  <header className={style.header}>
    <div className={style.container}>
      <Link href={URLS.HOME} as={URLS.HOME}>
        <a>
          <img src='/theme/logo.png' alt='Logo' />
        </a>
      </Link>
      <MainMenu />
    </div>
  </header>
);
