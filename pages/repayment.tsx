import { ReactElement, Component } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { observer } from 'mobx-react';
import Head from 'next/head';

import { gt } from '../src/utils';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchStaticData, fetchCopyright } from '../src/apis';
import { RepaymentInfo } from '../src/components/sections';
import { RepaymentForm } from '../src/components/RepaymentForm';

@observer
export default class PaymentPage extends Component<TComponenProps> {
  public render(): ReactElement {
    const {
      pageStore: {
        documentTitle,
        pageData: { pageTitle, repaymentInfo },
      },
      repaymentStore: { repayment },
    } = this.props;

    return (
      <>
        <Head>
          <title>{gt.gettext(documentTitle)}</title>
        </Head>

        <div className='page-container'>
          {!repayment && (
            <h2 className='page-title'>{gt.gettext(pageTitle)}</h2>
          )}
          <RepaymentForm {...this.props} />
          {!repayment && <RepaymentInfo dataList={repaymentInfo} />}
        </div>
      </>
    );
  }
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchStaticData({
    block: 'repayment-page',
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
