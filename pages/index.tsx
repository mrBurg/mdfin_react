import { ReactElement } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';

import {
  Welcome,
  HowItWorks,
  HowDoIt,
  NotDifficult,
} from '../src/components/sections';
import { TJSON, TCopyright, TComponenProps } from '../src/interfaces';
import { fetchCopyright, fetchStaticData } from '../src/apis';
import { Feedback } from '../src/components/sections/Feedback';

const IndexPage = (props: TComponenProps): ReactElement => {
  const {
    pageStore: {
      pageData: { welcome, howItWorks, howDoIt, notDifficult },
    },
  } = props;

  return (
    <>
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
  const template: TJSON = await fetchStaticData({
    block: 'main-page',
    path: 'template',
  });

  const pageData: TJSON = await fetchStaticData({
    block: 'main-page',
    path: 'static',
  });

  const copyright: TCopyright = await fetchCopyright();

  return {
    props: {
      ...context,
      pageData: { copyright: copyright.normal, ...pageData },
      template,
    },
  };
};
