import { ReactElement, FC } from 'react';
import { inject } from 'mobx-react';
import classNames from 'classnames';

import style from './LanguagesSwitcher.module.scss';

import { STORE_IDS } from '../../stores';
import { locales } from '../../config.json';
import LocaleStore from '../../stores/localeStore';

type TLanguagesSwitcherProps = {
  localeStore?: LocaleStore;
};

export const LanguagesSwitcher: FC<TLanguagesSwitcherProps> = inject(
  STORE_IDS.LOCALE_STORE
)(
  ({ localeStore }: TLanguagesSwitcherProps): ReactElement => (
    <ul className={style.languageSwitcher}>
      {locales.map(
        (item: string, index: number): ReactElement => {
          if (localeStore) {
            const { locale } = localeStore;

            return (
              <li
                key={index}
                className={classNames(style.language, {
                  [style.current]: locale == item,
                })}
              >
                <a
                  onClick={(): void => {
                    localeStore.setCurrentLanguage(locales[index]);
                  }}
                >
                  {item}
                </a>
              </li>
            );
          }

          return <></>;
        }
      )}
    </ul>
  )
);
