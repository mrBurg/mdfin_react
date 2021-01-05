import React, { ReactElement, PureComponent } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { observer } from 'mobx-react';

import { TStores } from '@stores';
import { RepaymentForm } from '@components/RepaymentForm';
import { RepaymentInfo } from '@components/sections';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { gt, isDev } from '@utils';

@observer
export default class PaymentPage extends PureComponent<TStores> {
  public render(): ReactElement {
    const {
      pageStore: {
        pageData: { pageTitle, repaymentInfo },
      },
      repaymentStore: { repayment },
    } = this.props;

    return (
      <div className="page-container">
        {!repayment && <h2 className="page-title">{gt.gettext(pageTitle)}</h2>}
        <RepaymentForm {...this.props} />

        {!repayment && <RepaymentInfo dataList={repaymentInfo} />}
      </div>
    );
  }
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'repayment-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'repayment-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  if (isDev) console.info('Context:', context);

  return {
    props: {
      pageData: { copyright: copyright.normal, ...pageData },
      template,
    },
  };
};
