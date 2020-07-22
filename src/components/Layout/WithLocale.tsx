import { useEffect, ReactElement, FC, ReactNode } from 'react';

import { localeStoreKey } from '../../config.json';
import { setToLocalStorage } from '../../utils';

type TWithLocaleProps = {
  children: ReactNode;
  locale: string;
};

const WithLocale: FC<TWithLocaleProps> = ({
  children,
  locale,
}: TWithLocaleProps): ReactElement => {
  useEffect((): void => {
    setToLocalStorage(localeStoreKey, locale);
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};

export default WithLocale;
