import React, { ReactElement, FC, ReactNode, useEffect } from 'react';

type TWithGettext = {
  children?: ReactNode;
  locale?: string;
};

const WithGettext: FC = ({ children, locale }: TWithGettext): ReactElement => {
  if (locale) {
    useEffect(() => {
      document.documentElement.lang = locale;
    });
  }

  return <>{children}</>;
};

export default WithGettext;
