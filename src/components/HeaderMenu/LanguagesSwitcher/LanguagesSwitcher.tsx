import { ReactElement, FC, ReactNode } from 'react';
import { inject } from 'mobx-react';
import { STORE_IDS } from '../../../stores';

import { locales } from './../../../config.json';
import LocaleStore from '../../../stores/localeStore';

type TLanguagesSwitcher = {
  localeStore?: LocaleStore;
  children?: ReactNode;
};

export const LanguagesSwitcher: FC = inject(STORE_IDS.LOCALE_STORE)(
  ({ localeStore }: TLanguagesSwitcher): ReactElement => {
    return (
      <div className='language'>
        <a
          onClick={() => {
            if (localeStore) {
              localeStore.setCurrentLanguage(locales[0]);
            }
          }}
          className='language-button'
        >
          УКР
        </a>
        <ul>
          <li>
            <a
              onClick={() => {
                if (localeStore) {
                  localeStore.setCurrentLanguage(locales[1]);
                }
              }}
            >
              РУС
            </a>
          </li>
        </ul>
      </div>
    );
  }
);
