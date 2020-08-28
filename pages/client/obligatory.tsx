import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../../src/utils';
import { TComponenProps, TCopyright } from '../../src/interfaces';
import { fetchCopyright } from '../../src/apis';
import { Obligatory } from '../../src/components/client';

const ObligatoryPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle, pageData },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Obligatory staticData={pageData} />
      </div>
    </>
  );
};

export default ObligatoryPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    headerLess: true,
    footerLess: true,
  };

  const pageData = {
    documentTitle: 'Obligatory',
    title: 'Thông Tin Cá Nhân',
    name: 'Họ Tên Đầy Đủ *',
    birthDate: 'Ngày Sinh *',
    idNumber: 'Số CMND/CCCD *',
    issueIdDate: 'Ngày Cấp *',
    expireIdDate: 'Có Giá Trị Đến *',
    gender: 'Giới Tính *',
    maritalStatus: 'Tình Trạng Hôn Nhân *',
    childrenAmount: 'Số con ruột (dưới 16 tuổi) *',
    email: 'Email *',
    loanPurpose: 'Mục Đích Vay *',
    whatPhone: 'Bạn sử dụng điện thoại di động thương hiệu gì *',
    phoneBrand: 'Thương hiệu *',
    otherPhoneBrand: 'Thương Hiệu Khác',
    phoneModel: 'Loại *',
    otherPhoneModel: 'Mẫu mã khác',
    otherPhoneNumber: 'Số Điện Thoại Di Động Cá Nhân Khác',
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
