import Link from 'next/link';
import classNames from 'classnames';

import './Logo.module.scss';

import { URLS } from '../../routes';
import { TLogoProps } from './@types';

export const Logo = ({ className }: TLogoProps) => (
  <Link href={URLS.HOME} as={URLS.HOME}>
    <a className={classNames(className)}>
      <img src='/theme/logo.svg' alt='Logo' />
    </a>
  </Link>
);
