import { useRouter } from 'next/router';
import { FC, ReactElement, useEffect, useState } from 'react';

import { TComponenProps } from '../../interfaces';
import { BASE_URLS } from '../../routes';
import { gt } from '../../utils';

export const Router: FC<TComponenProps> = (props): ReactElement => {
  const { children } = props;
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 1) {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    } else {
      router.push(BASE_URLS.HOME);
    }
  });

  return (
    <>
      <span>
        {gt.xnpgettext('Will be redirected', '%d second', '%d seconds', count)}
      </span>
      {children}
    </>
  );
};
