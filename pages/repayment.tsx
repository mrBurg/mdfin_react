import { ReactElement, PureComponent } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { gt } from '../src/utils';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
import { RepaymentInfo } from '../src/components/sections';
import { RepaymentForm } from '../src/components/RepaymentForm';

@observer
export default class PaymentPage extends PureComponent<TComponenProps> {
  public render(): ReactElement {
    const {
      pageStore: {
        pageData: { pageTitle, repaymentInfo },
      },
      repaymentStore: { repayment },
    } = this.props;

    return (
      <div className='page-container'>
        {!repayment && <h2 className='page-title'>{gt.gettext(pageTitle)}</h2>}
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

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
      template,
    },
  };
};
