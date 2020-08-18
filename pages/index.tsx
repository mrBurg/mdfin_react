import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

import {
  Welcome,
  HowItWorks,
  HowDoIt,
  NotDifficult,
} from '../src/components/sections';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchStaticData, fetchCopyright } from '../src/apis';
import { Feedback } from '../src/components/sections/Feedback';

const IndexPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
      documentTitle,
      pageData: { welcome, howItWorks, howDoIt, notDifficult },
    },
  } = props;

  return (
    <>
      <Head>
        <title>{documentTitle}</title>
      </Head>

      <Welcome {...welcome} />
      <HowItWorks {...howItWorks} />
      <HowDoIt {...howDoIt} />
      <NotDifficult {...notDifficult} />
      <Feedback />
    </>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const pageData: TJSON = await fetchStaticData({
    block: 'main-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
    },
  };
};
