import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import { TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright } from '../src/apis';
import { Application } from '../src/components/Application';

const ApplicationPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: { documentTitle },
  } = props;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <div className='page-container'>
        <Application {...props} />
      </div>
    </>
  );
};

export default ApplicationPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    footerLess: true,
  };

  /* const pageData: TJSON = await fetchStaticData({
    block: 'deal-page',
    path: 'static',
  }); */

  const pageData = { documentTitle: 'Application' };
  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less, ...pageData },
      template,
    },
  };
};
