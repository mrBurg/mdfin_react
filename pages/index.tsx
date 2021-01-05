import React, { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import { TStores } from '@stores';
import {
  CalculationExample,
  HowDoIt,
  HowItWorks,
  NotDifficult,
  Welcome,
} from '@components/sections';
import { Feedback } from '@components/sections/Feedback';
import { fetchCopyright, fetchStaticData } from '@src/apis';
import { TCopyright, TJSON } from '@interfaces';
import { isDev } from '@utils';

const IndexPage = (props: TStores): ReactElement => {
  const {
    pageStore: {
      pageData: {
        welcome,
        howItWorks,
        howDoIt,
        notDifficult,
        contactsData,
        calculationExample,
      },
    },
  } = props;

  return (
    <>
      <Welcome {...welcome} />
      <HowItWorks {...howItWorks} />
      <HowDoIt {...howDoIt} />
      <NotDifficult {...notDifficult} />
      <Feedback {...contactsData} />
      <CalculationExample {...calculationExample} />
    </>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const template: TJSON = await fetchStaticData({
    block: 'main-page',
    path: 'template',
  });

  const mainData: TJSON = await fetchStaticData({
    block: 'main-page',
    path: 'static',
  });

  const contactsData: TJSON = await fetchStaticData({
    block: 'contacts-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  const pageData = {
    ...mainData,
    contactsData,
  };

  if (isDev) console.info('Context:', context);

  return {
    props: {
      pageData: {
        copyright: copyright.normal,
        ...pageData,
      },
      template,
    },
  };
};
