import React, { ReactElement } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import _ from 'lodash';

import style from './ClientTabs.module.scss';
import { CLIENT_URLS } from '@routes';
import { TClientTabsProps } from './@types';

export const ClientTabs = ({
  className,
  children,
}: TClientTabsProps): ReactElement => {
  const router = useRouter();

  return (
    <div className={className}>
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
