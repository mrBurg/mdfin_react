import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../../src/utils';
import { TComponenProps, TCopyright } from '../../src/interfaces';
import { fetchCopyright } from '../../src/apis';
import { Job } from '../../src/components/client';

const JobPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle, pageData },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Job staticData={pageData} />
      </div>
    </>
  );
};

export default JobPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    headerLess: true,
    footerLess: true,
  };

  const pageData = {
    documentTitle: 'Address',
    title: 'Nghề Nghiệp',
    socialStatus: 'Tình Trạng Lao Động *',
    education: 'Trình độ học vấn *',
    companyName: 'Tên Công Ty **',
    industry: 'Ngành Nghề **',
    industryDetailed: 'Ngành Nghề Chi Tiết **',
    positionType: 'Cấp bậc chức vụ **',
    positionName: 'Chức Vụ **',
    workPeriod: 'Số Năm làm việc tại công ty',
    years: 'Năm **',
    months: 'Tháng **',
    jobContactPhone: 'Số Điện Thoại bộ phận Nhân Sự/Đồng Nghiệp **',
    jobContactName: 'Tên Người Phụ Trách Nhân Sự/Tên Đồng Nghiệp **',
    jobContactType: 'Loại Số Điện Thoại liên hệ Công Ty **',
    income: 'Thu Nhập Sau Thuế Hàng Tháng *',
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
