import Head from 'next/head';
import { ReactElement } from 'react';
/* import {
  GetStaticProps,
  GetStaticPropsContext,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next'; */

import { gt } from '../src/utils';

export default (): ReactElement => {
  return (
    <>
      <Head>
        <title>{gt.gettext('hello')}</title>
      </Head>
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
