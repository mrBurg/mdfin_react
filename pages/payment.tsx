import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import PageStore from '../src/stores/pageStore';
import { fetchCopyright } from '../src/apis/static/footer';
import { TJSON } from '../src/interfaces';
import { fetchPageData } from '../src/apis/static/paymentPage';
import { PaymentInfo } from '../src/components/sections';
import Payment from '../src/components/Payment';

type TPaymentPageProps = {
  pageStore: PageStore;
};

export default ({ pageStore }: TPaymentPageProps): ReactElement => {
  const {
    documentTitle,
    pageData: { pageTitle, paymentInfo },
  } = pageStore;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <h2 className='page-title'>{gt.gettext(pageTitle)}</h2>

      <Payment />
      <PaymentInfo dataList={paymentInfo} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchPageData();
  const copyright: string = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright, ...pageData },
    },
  };
};
