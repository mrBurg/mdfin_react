import { ReactElement, FC } from 'react';
import { inject } from 'mobx-react';
import classNames from 'classnames';

import style from './LanguagesSwitcher.module.scss';

import { STORE_IDS } from '../../../stores';
import { locales } from '../../../config.json';
import LocaleStore from '../../../stores/LocaleStore';

type TLanguagesSwitcherProps = {
  localeStore?: LocaleStore;
};

export const LanguagesSwitcher: FC<TLanguagesSwitcherProps> = inject(
  STORE_IDS.LOCALE_STORE
)(
  ({ localeStore }: TLanguagesSwitcherProps): ReactElement => (
    <ul className={style.language}>
      {locales.map((item: string, index: number): ReactElement | null => {
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
);
