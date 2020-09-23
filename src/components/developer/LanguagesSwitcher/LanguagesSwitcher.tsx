import { ReactElement, FC } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './LanguagesSwitcher.module.scss';

import { STORE_IDS } from '../../../stores';
import { locales } from '../../../config.json';
import { TLanguagesSwitcherProps } from './@types';

export const LanguagesSwitcher: FC<TLanguagesSwitcherProps> = inject(
  STORE_IDS.LOCALE_STORE
)(
  observer(
    ({ localeStore }: TLanguagesSwitcherProps): ReactElement => (
      <ul className={style.language}>
        {_.map(locales, (item: string, index: number): ReactElement | null => {
          if (localeStore) {
            const { locale } = localeStore;

            return (
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
            );
          }

          return null;
        })}
      </ul>
    )
  )
);
