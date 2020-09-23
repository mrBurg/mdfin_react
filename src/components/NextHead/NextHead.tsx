import { FC, ReactElement } from 'react';
import Head from 'next/head';

import { siteName } from './../../config.json';

export const NextHead: FC = (): ReactElement => {
  return (
    <Head>
      <meta
        name='viewport'
        content='user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0'
      />
      <title>{siteName}</title>
    </Head>
  );
};
