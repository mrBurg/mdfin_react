import { ReactElement, FC, ReactNode } from 'react';
import { inject } from 'mobx-react';
import { STORE_IDS } from '../../../stores';

import { locales } from './../../../config.json';
import LocaleStore from '../../../stores/localeStore';
import { gt } from '../../../utils';

type TLanguagesSwitcher = {
  localeStore?: LocaleStore;
  children?: ReactNode;
};

export const LanguagesSwitcher: FC = inject(STORE_IDS.LOCALE_STORE)(
  ({ localeStore }: TLanguagesSwitcher): ReactElement => {
    return (
      <div className='language'>
        {locales.map(
          (item: string, key: number): ReactElement => {
            return (
              <div key={key}>
                <a
                  onClick={(): void => {
                    if (localeStore) {
                      localeStore.setCurrentLanguage(locales[key]);
                    }
                  }}
                >
                  {gt.gettext(item)}
                </a>
              </div>
            );
          }
        )}
      </div>
    );
  }
);
