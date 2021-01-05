import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './LanguagesSwitcher.module.scss';

import { locales } from '@src/config.json';
import { STORE_IDS } from '@stores';
import { TLanguagesSwitcherProps } from './@types';

export const LanguagesSwitcher: FC<TLanguagesSwitcherProps> = inject(
  STORE_IDS.LOCALE_STORE
)(
  observer(({ localeStore }: TLanguagesSwitcherProps) => {
    if (localeStore) {
      const { locale } = localeStore;

      return (
        <ul className={style.language}>
          {_.map(locales, (item: string, index: number) => (
            <li key={index}>
              <button
                className={classNames(style.button, {
                  [style.current]: locale == item,
                })}
                onClick={(): void => {
                  localeStore.setCurrentLanguage(locales[index]);
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      );
    }

    return null;
  })
);
