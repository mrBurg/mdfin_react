import { ReactElement } from 'react';
import { GetStaticPropsContext, GetStaticProps } from 'next';
import Head from 'next/head';

import { TCopyright } from '../src/interfaces';
import { fetchCopyright } from '../src/apis';

const NotFound = (): ReactElement => {
  return (
    <>
      <Head>
        <title>{'404'}</title>
      </Head>

      <div className='container' />
      <style jsx>{`
        .container {
          background: #e8e8e8 url('/theme/404.svg') center center/contain
            no-repeat;
          font-size: 5em;
          flex-grow: 1;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default NotFound;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template = {
    headerLess: true,
    footerLess: true,
  };

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.less },
      template,
    },
  };
};
