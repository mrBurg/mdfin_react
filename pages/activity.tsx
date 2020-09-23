import { ReactElement } from 'react';
import Head from 'next/head';

import { TComponenProps } from '../src/interfaces';
import { Router } from './../src/components/Router';

const Activity = (props: TComponenProps): ReactElement => {
  return (
    <Router {...props}>
      <Head>
        <meta name='referrer' content='no-referrer'></meta>
        <meta name='robots' content='noindex, nofollow' />
      </Head>
    </Router>
  );
};

export default Activity;
