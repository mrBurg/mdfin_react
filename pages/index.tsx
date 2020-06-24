import Head from 'next/head';
import { ReactElement, useEffect } from 'react';
/* import {
  GetStaticProps,
  GetStaticPropsContext,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'; */

import { gt } from '../src/utils';
import { useRouter, NextRouter } from 'next/router';

export default (): ReactElement => {
  const router: NextRouter = useRouter();

  useEffect(() => {
    console.info(router.route);
    // router.replace('/[lang]', `/`)
  });

  return (
    <>
      <Head>
        <title>{gt.gettext('hello')}</title>
      </Head>
      {/* <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head> */}
    </>
  );
};

/* export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  return {
    props: {
      ...context,
      title: gt.gettext('hello'),
      mr: Math.random(),
    },
  };
}; */

/* export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {
      title: gt.gettext('hello'),
    },
  };
}; */
