import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchStaticData, fetchCopyright } from '../src/apis';
import { PaymentInfo } from '../src/components/sections';
import Payment from '../src/components/Payment';

const PaymentPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
      documentTitle,
      pageData: { pageTitle, paymentInfo },
    },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <h2 className='page-title'>{gt.gettext(pageTitle)}</h2>

      <div className='page-container'>
        <Payment {...props} />
        <PaymentInfo dataList={paymentInfo} />
      </div>
    </>
  );
};

export default PaymentPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchStaticData({
    block: 'payment-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
    },
  };
};
