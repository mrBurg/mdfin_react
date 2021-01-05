import { LOCALE_KEY } from '@src/constants';
import { STORE_IDS } from '@stores';
import { setToLocalStorage } from '@utils';
import { inject, observer } from 'mobx-react';
import React, { useEffect, FC } from 'react';
import { TWithLocaleProps } from './@types';

export const WithLocale: FC<TWithLocaleProps> = inject(STORE_IDS.LOCALE_STORE)(
  observer((props) => {
    const { children, localeStore } = props;

    if (localeStore) {
      const { locale } = localeStore;

      useEffect((): void => {
        setToLocalStorage(LOCALE_KEY, locale);
        document.documentElement.lang = locale;
      });
    }

    return <>{children}</>;
  })
);
