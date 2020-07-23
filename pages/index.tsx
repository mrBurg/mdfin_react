import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { gt } from '../src/utils';
import PageStore from '../src/stores/pageStore';
import { fetchCopyright } from '../src/apis/static/footer';
import {
  Welcome,
  HowItWorks,
  HowDoIt,
  NotDifficult,
} from '../src/components/sections';
import { fetchPageData } from '../src/apis/static/mainPage';
import { TJSON } from '../src/interfaces';

type TIndexPageProps = {
  pageStore: PageStore;
};

export default ({ pageStore }: TIndexPageProps): ReactElement => {
  const { documentTitle, pageData } = pageStore;
  const { welcome, howItWorks, howDoIt, notDifficult } = pageData;

  return (
    <>
      <Head>
        <title>{gt.gettext(documentTitle)}</title>
      </Head>

      <Welcome {...welcome} />
      <HowItWorks {...howItWorks} />
      <HowDoIt {...howDoIt} />
      <NotDifficult {...notDifficult} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchPageData();
  const copyright: string = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright, ...pageData },
    },
  };
};
