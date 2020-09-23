import { useEffect, ReactElement, FC, ReactNode } from 'react';

import { LOCALE_KEY } from '../../constants';
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
    setToLocalStorage(LOCALE_KEY, locale);
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};
