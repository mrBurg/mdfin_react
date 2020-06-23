import { ReactNode, useEffect, ReactElement, FC } from 'react';

type TWithLocale = {
  children: ReactNode;
  locale: string;
};

const WithLocale: FC<TWithLocale> = ({
  children,
  locale,
}: TWithLocale): ReactElement => {
  useEffect(() => {
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};

export default WithLocale;
