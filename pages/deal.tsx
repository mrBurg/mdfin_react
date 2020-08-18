import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright } from '../src/apis';
import { Deal } from '../src/components/deal';

const DealPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Deal {...props} />
      </div>
    </>
  );
};

export default DealPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  /* const pageData: TJSON = await fetchStaticData({
    block: 'deal-page',
    path: 'static',
  }); */

  const pageData = { documentTitle: 'Deal' };
  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
    },
  };
};
