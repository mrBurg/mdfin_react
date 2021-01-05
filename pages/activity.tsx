import React, { ReactElement } from 'react';
import Head from 'next/head';

import { TStores } from '@src/stores';
import { Router } from '@components/Router';

const Activity = (props: TStores): ReactElement => {
  return (
    <Router {...props}>
      <Head>
        <meta name="referrer" content="no-referrer"></meta>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
    </Router>
  );
};

export default Activity;
