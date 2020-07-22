import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import PageStore from '../src/stores/pageStore';
import { fetchCopyright } from '../src/apis/static/footerStatic';
import { TJSON } from '../src/interfaces';
import { fetchPageData } from '../src/apis/static/signUpPage';
import SignIn from '../src/components/SignIn';

type TIndexPageProps = {
  pageStore: PageStore;
};

export default ({ pageStore }: TIndexPageProps): ReactElement => {
  const {
    documentTitle,
    pageData: { pageTitle },
  } = pageStore;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>
      <h2 className='page-title'>{gt.gettext(pageTitle)}</h2>

      <SignIn />

      <style jsx>{`
        .page-title {
          margin: 80px auto 45px;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchPageData();
  const copyright: string = await fetchCopyright({ less: true });

  return {
    props: {
      ...context,
      pageData: { copyright, ...pageData },
      template: { headerLess: true, footerLess: true },
    },
  };
};
