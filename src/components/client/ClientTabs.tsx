import React, { ReactElement, FC } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './ClientTabs.module.scss';
import { CLIENT_URLS } from '../../routes';
import { useRouter } from 'next/router';

export const ClientTabs: FC = ({ children }): ReactElement => {
  const router = useRouter();

  return (
    <div className={style.client}>
      <ul className={style.tabs}>
        {_.map(CLIENT_URLS, (item: string, index: string) => {
          return (
            <li
              key={index}
              className={classNames(style.tab, {
                [style.currentTab]: item == router.route,
              })}
            />
          );
        })}
      </ul>
      {children}
    </div>
  );
};
