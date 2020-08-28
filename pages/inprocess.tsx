import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { fetchCopyright } from '../src/apis';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { Inprocess } from './../src/components/Inprocess';

const InprocessPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <h2 className='page-title'>
          Hồ Sơ của Quý Khách đang trong quá trình xử lý. Vui lòng chờ kết quả
        </h2>

        <Inprocess />
      </div>
    </>
  );
};

export default InprocessPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  /* const pageData: TJSON = await fetchStaticData({
    block: 'contacts-page',
    path: 'static',
  }); */
  const pageData: TJSON = {
    documentTitle: 'inprocess',
    pageTitle: 'Inprocess',
  };

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
    },
  };
};
