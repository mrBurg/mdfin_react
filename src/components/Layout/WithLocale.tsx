import { useEffect, ReactElement, FC, ReactNode } from 'react';

import { langCookieName } from './../../config.json';
import { setCookie } from '../../utils';

type TWithLocale = {
  children: ReactNode;
  locale: string;
};

const WithLocale: FC<TWithLocale> = ({
  children,
  locale,
}: TWithLocale): ReactElement => {
  useEffect((): void => {
    setCookie(langCookieName, locale);
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};

export default WithLocale;
