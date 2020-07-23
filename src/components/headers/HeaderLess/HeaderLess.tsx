import { ReactElement, FC } from 'react';
import Link from 'next/link';

import style from './HeaderLess.module.scss';

import { URLS } from '../../../routes';

export const HeaderLess: FC = (): ReactElement => (
  <header className={style.header}>
    <div className={style.container}>
      <Link href={URLS.HOME} as={URLS.HOME}>
        <a>
          <img src='/theme/logo.png' alt='Logo' />
        </a>
      </Link>
    </div>
  </header>
);
