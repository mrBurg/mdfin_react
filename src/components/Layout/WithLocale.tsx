import { useEffect, ReactElement, FC, ReactNode } from 'react';

type TWithLocale = {
  children: ReactNode;
  locale: string;
};

const WithLocale: FC<TWithLocale> = ({
  children,
  locale,
}: TWithLocale): ReactElement => {
  useEffect((): void => {
    document.documentElement.lang = locale;
  });

  return <>{children}</>;
};

export default WithLocale;
