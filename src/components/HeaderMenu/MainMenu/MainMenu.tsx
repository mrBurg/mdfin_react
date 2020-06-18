import { ReactElement } from 'react';
import Link from 'next/link';

import { mainMenu, testPages, TRouter } from './../../../routes';

export function MainMenu(): ReactElement {
  return (
    <div className='menu'>
      <ul>
        {mainMenu.map((item: TRouter, i: number) => {
          const { href, alias, title } = item;

          return (
            <li key={i}>
              <Link href={href} as={alias}>
                <a>{title}</a>
              </Link>
            </li>
          );
        })}

        {testPages.map((item: TRouter, i: number) => {
          const { href, alias, title } = item;

          return (
            <Link key={i} href={href} as={alias}>
              <a>{title}</a>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
