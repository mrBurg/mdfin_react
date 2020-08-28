import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { fetchCopyright } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { Notification } from '../src/components/Notification';

const Sendmoney = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Notification
          className={'page-notification'}
          notifications={[
            'Xác Thực Tài Khoản Thất Bại, Vui lòng kiểm tra lại số tài khoản hoặc thay đổi tài khoản',
            'Tiền đã được gửi đến tài khoản của bạn, bạn sẽ nhận được nhanh chóng',
          ]}
        />
      </div>
    </>
  );
};

export default Sendmoney;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    footerLess: true,
  };

  /* const pageData: TJSON = await fetchStaticData({
    block: 'contacts-page',
    path: 'static',
  }); */
  const pageData: TJSON = {
    documentTitle: 'sendmoney',
  };

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
