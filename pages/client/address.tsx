import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../../src/utils';
import { TComponenProps, TCopyright } from '../../src/interfaces';
import { fetchCopyright } from '../../src/apis';
import { Address } from '../../src/components/client';

const AddressPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle, pageData },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Address staticData={pageData} />
      </div>
    </>
  );
};

export default AddressPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    headerLess: true,
    footerLess: true,
  };

  const pageData = {
    documentTitle: 'Address',
    title: 'Địa Chỉ và Thông Tin Liên Hệ',
    cityProvince: 'Tỉnh/Thành Phố *',
    district: 'Quận/Huyện *',
    wardCommune: 'Phường/Xã *',
    street: 'Đường *',
    building: 'Tòa Nhà *',
    apartment: 'Chung Cư',
    livingPeriod: 'Thời gian cư trú',
    years: 'Năm *',
    months: 'Tháng *',
    thirdPartyPhone: 'Số điện thoại người tham chiếu/người thân của bạn là gì?',
    thirdPartyName: 'Tên người tham chiếu/người thân của bạn là gì?',
    thirdPartyRelation:
      'Mối quan hệ của bạn với người tham chiếu/người thân là gì?',
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
