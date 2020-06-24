import { useEffect, ReactElement, FC, ReactNode } from 'react';

import { LANG_COOKIE_NAME } from '../../constants';
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
    setCookie('string', locale, '/asd');
    setCookie('number', locale, 1);
    setCookie('object', locale, { path: '/', exdays: 5 });
    setCookie('array', locale, []);

    setCookie(LANG_COOKIE_NAME, locale);
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};

export default WithLocale;
