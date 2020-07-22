import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import PageStore from '../src/stores/pageStore';
import { fetchCopyright } from '../src/apis/static/footerStatic';

type TPaymentPageProps = {
  pageStore: PageStore;
};

export default ({ pageStore }: TPaymentPageProps): ReactElement => {
  const { documentTitle } = pageStore;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>
      <div>Payment</div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const copyright: string = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright, documentTitle: 'Payment' },
    },
  };
};
