import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import Client from '../src/components/client';
import { TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright } from '../src/apis';
import { gt } from '../src/utils';

const ClientPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Client {...props} />
      </div>
    </>
  );
};

export default ClientPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  /* const pageData: TJSON = await fetchStaticData({
    block: 'client-page',
    path: 'static',
  }); */

  const pageData = { documentTitle: 'Cabinet' };

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less, ...pageData },
    },
  };
};
