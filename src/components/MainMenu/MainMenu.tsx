import { ReactElement, FC } from 'react';
import Link from 'next/link';

import style from './MainMenu.module.scss';

import SingInIcon from './svg/sing-in-icon.svg';

import { mainMenu, TRouter } from '../../routes';
import { gt } from '../../utils';

export const MainMenu: FC = (): ReactElement => (
  <ul className={style.menu}>
    {mainMenu.map((item: TRouter, i: number) => {
      const { href, alias, title, button, hidden } = item;

      if (hidden) return null;

      const linkContent = button ? <SingInIcon /> : gt.gettext(title);

      return (
        <li key={i}>
          <Link href={href} as={alias}>
            <a>{linkContent}</a>
          </Link>
        </li>
      );
    })}
  </ul>
);
