import { ReactElement, FC } from 'react';
import Link from 'next/link';

import style from './MainMenu.module.scss';

import SingInIcon from './svg/sing-in-icon.svg';

import { mainMenu, TRouter } from '../../routes';
import { gt } from '../../utils';

export const MainMenu: FC = (): ReactElement => (
  <ul className={style.menu}>
    {mainMenu.map((item: TRouter, index: number) => {
      const { href, title, button } = item;

      const linkContent = button ? <SingInIcon /> : gt.gettext(title);

      return (
        <li key={index}>
          <Link href={href}>
            <a>{linkContent}</a>
          </Link>
        </li>
      );
    })}
  </ul>
);
