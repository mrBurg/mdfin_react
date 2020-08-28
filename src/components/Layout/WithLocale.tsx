import { useEffect, ReactElement, FC, ReactNode } from 'react';

import { localeStoreKey } from '../../config.json';
import { setToLocalStorage } from '../../utils';

type TWithLocaleProps = {
  children: ReactNode;
  locale: string;
};

export const WithLocale: FC<TWithLocaleProps> = ({
  children,
  locale,
}: TWithLocaleProps): ReactElement => {
  useEffect((): void => {
    setToLocalStorage(localeStoreKey, locale);
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};
