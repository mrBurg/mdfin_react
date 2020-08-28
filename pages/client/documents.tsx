import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../../src/utils';
import { TComponenProps, TCopyright } from '../../src/interfaces';
import { fetchCopyright } from '../../src/apis';
import { Documents } from '../../src/components/client';

const DocumentsPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle, pageData },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Documents staticData={pageData} />
      </div>
    </>
  );
};

export default DocumentsPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    headerLess: true,
    footerLess: true,
  };

  const pageData = {
    documentTitle: 'Address',
    title: 'Thông Tin Tài Khoản và Chứng Từ',
    attachments: {
      isPresent: {
        title: 'Thông Tin Tài Khoản và Chứng Từ',
        buttons: {
          idFront: 'Tải lên CMND (Mặt Trước)',
          idBack: 'Tải Lên CMND (Mặt Sau)',
          selfie: 'Tải Lên Ảnh Chụp Selfie Cầm CMND Trên Tay',
          other: 'Giấy Tờ Khác',
        },
      },
      notPresent: {
        title: 'Chứng từ cần thiết và thông tin tài khoản',
        buttons: {
          idFront: 'CMND/CCCD Mặt Trước',
          idBack: 'CMND/CCCD Mặt Sau',
          selfie: 'Ảnh chụp selfie cầm CMND/CCCD',
          other: 'Giấy Tờ Khác',
        },
      },
    },
    accounts: {
      isPresent: {
        title: 'Thêm Tài Khoản Ngân Hàng',
      },
      notPresent: {
        'bank account': 'Chọn Tài Khoản Ngân Hàng',
      },
      buttons: {
        add: 'Tài khoản ngân hàng mới',
        select: 'Chọn Ngân Hàng',
        enter: 'Số Tài Khoản Ngân Hàng',
        confirm: 'Xác Nhận',
      },
    },
    docs: {
      idFront: 'CMND hoặc CCCD (Mặt Trước)',
      idBack: 'CMND hoặc CCCD (Mặt Sau)',
      selfie: 'Ảnh Chụp Chân Dung Cá Nhân cùng với CMND/CCCD của bạn',
      other: 'Các loại giấy tờ chứng từ khác',
      selectAccount: 'Chọn Tài Khoản Ngân Hàng',
      selectBank: 'Chọn Ngân Hàng',
      accountNumber: 'Số Tài Khoản',
    },
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
