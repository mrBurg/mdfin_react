import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { fetchCopyright } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { Notification } from '../src/components/Notification';

const Notify = (props: TComponenProps): ReactElement => {
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
            'Bạn đã không chấp nhận khoản vay, tuy nhiên khoản vay của bạn đã được duyệt sẵn. Vui lòng chọn lại khoản tiền vay và kỳ hạn và đăng ký hồ sơ vay mới',
            'Hồ sơ vay của bạn đã bị từ chối. Vui lòng thử lại sau một tháng',
            'Hồ sơ vay của bạn đã bị hủy. Bạn có thể đăng ký lại trong tương lai và giới thiệu cho bạn bè cùng vay',
            'Vì bạn không chấp nhận khoản vay, nên đăng ký vay đã bị hủy. Vui lòng chọn lại khoản vay và kỳ hạn, và gửi đăng ký vay mới',
          ]}
        />
      </div>
    </>
  );
};

export default Notify;

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
    documentTitle: 'Notify',
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
