import { FC } from 'react';

import style from './DeveloperMenu.module.scss';

import { allRoutes, TRouter } from '../../../routes';
import Link from 'next/link';
import { LanguagesSwitcher } from '..';

export const DeveloperMenu: FC = () => (
  <div className={style.developerMenu}>
    <p>Developer Menu</p>
    <ul className={style.list}>
      {allRoutes.map((item: TRouter, index: number) => {
        const { href, title } = item;

        return (
          <li key={index} className={style.item}>
            <Link href={href}>
              <a>{title}</a>
            </Link>
          </li>
        );
      })}
      <li>
        <LanguagesSwitcher />
      </li>
    </ul>
  </div>
);
